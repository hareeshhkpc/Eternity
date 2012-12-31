/**
 * 
 */
package com.hin.hl7messaging.web.service;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.LinkedList;
import java.util.Queue;
import java.util.Stack;

import org.apache.commons.httpclient.DefaultHttpMethodRetryHandler;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.params.HttpMethodParams;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicHeader;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.hin.domain.Message;
import com.hin.domain.MessageType;
import com.hin.domain.ProcessDefinition;
import com.hin.domain.ProcessInstance;
import com.hin.domain.Step;
import com.hin.domain.vo.MessageVO;
import com.hin.hl7messaging.api.IMessageService;
import com.hin.hl7messaging.api.INotificationService;
import com.hin.hl7messaging.vo.CouchChange;
import com.hin.hl7messaging.vo.CouchChanges;
import com.hin.hl7messaging.vo.CouchData;
import com.hin.hl7messaging.vo.CouchProcessData;
import com.hin.hl7messaging.web.service.api.ISyncService;
import com.hin.messaging.IWorkFlowProvider;
import com.hin.service.IProcessInstanceService;

/**
 * @author sreekumar.s
 * 
 */
@Service
public class SyncService implements ISyncService {

	@Value("${couch.DB_PATH}")
	private String couchDbPath;

	/*
	 * @Value("${couch.syncLastSeq}") private Integer syncLastSeq;
	 */

	protected static Logger logger = Logger.getLogger(SyncService.class);
	private Queue<CouchChange> queue = new LinkedList<CouchChange>();

	private Stack<CouchChange> successQueue = new Stack<CouchChange>();
	private Stack<CouchChange> pendingQueue = new Stack<CouchChange>();
	private Stack<CouchChange> failedQueue = new Stack<CouchChange>();

	@Autowired
	IWorkFlowProvider workFlowProvider;

	@Autowired
	IMessageService messageService;
	
	@Autowired
	INotificationService notificationService;

	@Autowired
	private IProcessInstanceService processInstanceService;

	final int MAX_RETRY = 3;
	int retry = 1;
	int last_seq = 0;
	int prev_last_seq = 0;

	@Value("${sync.START}")
	boolean start;

	boolean pause = true;

	private String getHttpClient(String url) {
		// Create an instance of HttpClient.
		HttpClient client = new HttpClient();

		// Create a method instance.
		GetMethod method = new GetMethod(url);

		// Provide custom retry handler is necessary
		method.getParams().setParameter(HttpMethodParams.RETRY_HANDLER,
				new DefaultHttpMethodRetryHandler(3, false));
		method.addRequestHeader("Content-Type", "application/json");

		try {
			// Execute the method.
			int statusCode = client.executeMethod(method);

			if (statusCode != HttpStatus.SC_OK) {
				logger.error("Method failed: " + method.getStatusLine());
				System.out.println("Method failed: " + method.getStatusLine());
			}

			// Read the response body.
			byte[] responseBody = method.getResponseBody();

			// Deal with the response.
			// Use caution: ensure correct character encoding and is not binary
			// data
			return new String(responseBody);

		} catch (HttpException e) {
			logger.error("Fatal protocol violation: " + e.getMessage());
			e.printStackTrace();
		} catch (IOException e) {
			logger.error("Fatal transport error: " + e.getMessage());
			e.printStackTrace();
		} finally {
			// Release the connection.
			method.releaseConnection();
		}
		return null;
	}

	private boolean postHttpClient(String url, String content) {
		HttpPost postRequest = new HttpPost(url);
		try {
			StringEntity entity = new StringEntity(content);
			entity.setContentType(new BasicHeader("Content-Type",
					"application/atom+xml"));
			postRequest.setEntity(entity);

			org.apache.http.client.HttpClient httpclient = new DefaultHttpClient();
			HttpResponse response = httpclient.execute(postRequest);
			int statusCode = response.getStatusLine().getStatusCode();
			if (statusCode != HttpStatus.SC_CREATED) {
				logger.error("Method failed: " + response.getStatusLine());
				System.out
						.println("Method failed: " + response.getStatusLine());
				return false;
			}
			return true;
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		} catch (ClientProtocolException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

		return false;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.hin.hl7messaging.web.service.api.ISyncService#synchronize()
	 */
	@Override
	public void doSynchronize() {
		System.out.println("Sync started" + last_seq);
		// last_seq = getLastSequence();
		// last_seq=syncLastSeq;
		prev_last_seq = last_seq;
		addToQueue();
		startSynchronize();
		if (queue.isEmpty()) {
			updateLastSequence();
		}
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.hin.hl7messaging.web.service.api.ISyncService#addToQueue()
	 */
	@Override
	public boolean addToQueue() {
		String url = couchDbPath + "_changes?filter=hl7store/changedsmo&since="
				+ last_seq;
		// + "_changes?filter=hl7store/objecttype&objecttype=smo&since=0";
		String responseBody = getHttpClient(url);
		Gson gson = new GsonBuilder().create();
		CouchChanges couchChanges = gson.fromJson(responseBody,
				CouchChanges.class);
		logger.info("current sequence  : " + last_seq);
		for (CouchChange couchChange : couchChanges.getResults()) {
			if (!queue.contains(couchChange)
					&& couchChange.getId().indexOf("ProcessIndex_") == -1
					&& couchChange.getId().indexOf("TaskVO_") == -1)
				queue.add(couchChange);
			// logger.info(couchChange);
		}
		last_seq = couchChanges.getLast_seq();
		logger.info("next sequence : " + last_seq);

		return !queue.isEmpty();
	}

	private void startSynchronize() {
		logger.info("Total " + queue.size() + " message(s) to be synchronize");
		while (!queue.isEmpty()) {
			logger.info(queue.size() + " more  messages to be synchronize");
			CouchChange couchChange = queue.peek();
			String id = null;
			boolean completed = false;
			boolean pending = false;
			String message = null;
			String info = "Message ";

			if (couchChange.getId().indexOf("Process_") > -1) {

				CouchProcessData couchProcessData = getCouchProcessData(couchChange
						.getId());
				id = couchProcessData.get_id();
				couchChange.setCouchProcessData(couchProcessData);
				if (couchProcessData.getContent() != null)
					info = couchProcessData.getContent().getProcessName();
				/* System.out.println("Process : " + couchProcessData); */
				// logger.info(couchProcessData);
				if (couchProcessData != null)
					message = synchronizeProcessData(couchProcessData);

			} else {
				CouchData couchData = getCouchData(couchChange.getId());
				couchChange.setCouchData(couchData);
				if (couchData.isFinished()) {
					id = couchData.get_id();
					/* System.out.println("Message :" + couchData); */
					// logger.info(couchData);
					message = synchronizeMessageData(couchData);
				} else {
					pending = true;
				}
			}

			if (pending) {
				pendingQueue.add(couchChange);
				logger.info(info + " [" + id + "] is pending.");
			} else if (message != null) {
				completed = true;// postMessage(id, message);
				logger.info(info + " [" + id
						+ "] is successfully synchronized.");
				System.out.println(info + " [" + id
						+ "] is successfully synchronized.");
				successQueue.add(couchChange);
			} else {
				/* failedQueue.add(couchChange); */
				// completed = true;
				logger.info(info + " synchronization [" + id + "] is failed.");
				System.out.println("Message not found  for id : " + id);
			}

			if (retry < MAX_RETRY && !completed && !pending) {
				logger.info(info + " synchronization [" + id + "] is failed.");
				logger.info(" Retry : " + retry);
				retry++;
			}
			if (retry == MAX_RETRY) {
				retry = 1;
				completed = true;
				logger.info(MAX_RETRY + " times has been retried and " + info
						+ " synchronization [" + id + "] has been failed .");
				failedQueue.add(couchChange);
			}

			if (completed || pending)
				queue.poll();

		}
	}

	/*
	 * private boolean postMessage(String id, String message) { boolean
	 * completed = putCouchData(id, message); while (retry < MAX_RETRY &&
	 * !completed) { logger.debug("Retry : " + retry); retry++; postMessage(id,
	 * message); } if (retry == MAX_RETRY) { retry = 1;
	 * logger.error("Message Sync to CoucheDb is failed."); return true; }
	 * return completed; }
	 */

	private CouchData getCouchData(String id) {
		String url = couchDbPath + id;
		/* String url = couchDbPath + "_design/hl7store/_show/xmlmessage/" + id; */
		String responseBody = getHttpClient(url);
		Gson gson = new GsonBuilder().create();
		CouchData couchData = null;
		try {
			couchData = gson.fromJson(responseBody, CouchData.class);
		} catch (Exception e) {
			logger.error("Message Gson conversion failed.", e);
			System.out.println("Message Gson conversion failed");
		}
		return couchData;
	}

	private CouchProcessData getCouchProcessData(String id) {
		String url = couchDbPath + "_design/hl7store/_show/xmlmessage/" + id;
		String responseBody = getHttpClient(url);
		Gson gson = new GsonBuilder().create();
		CouchProcessData couchProcessData = new CouchProcessData();
		try {
			ProcessDefinition processDefinition = gson.fromJson(responseBody,
					ProcessDefinition.class);
			couchProcessData.set_id(id);
			couchProcessData.setContent(processDefinition);
		} catch (Exception e) {
			logger.error("Process Gson conversion failed.", e);
			logger.error("Check in couch db for the process. url details :" + url);
 	  //	logger.error("ResponseBody :"+responseBody);
			System.out.println("url :" + url);
		//	System.out.println("ResponseBody :"+responseBody);
			System.out.println("Process Gson conversion failed");
		}
		return couchProcessData;
	}

	private String synchronizeMessageData(CouchData couchData) {
		MessageVO messageVO;
		try {
			messageVO = messageService.createMessageVO(couchData.getContent());
			// String userId = couchData.getUserid();
			messageVO.setUserid(couchData.getUserid());
			messageVO.setFinish(couchData.isFinished());
			messageVO.setDeleted(couchData.isDeleted());
			notificationService.createNotification(messageVO);
			/*
			 * IWorkFlowTask workFlowtask=null;
			 * if(workFlowProvider.getWorkFlowTask
			 * (messageVO.getTaskId())==null){ workFlowtask =
			 * workFlowProvider.createNewTask(userId, messageVO); return
			 * workFlowtask.getMessage(); }else{
			 */
			
			return workFlowProvider.finishTask(messageVO);
			/* } */

		} catch (Exception e) {
			logger.error("workFlowtask failed: " + e);
			System.out.println("workFlowtask failed: " + e);
		}

		return null;
	}

	private String synchronizeProcessData(CouchProcessData couchProcessData) {

		try {
			String data = null;
			// String processInstanceJsonString = couchData.getContent();
			ProcessInstance processInstance = null;
			ProcessDefinition processDefinitionObject = couchProcessData
					.getContent();
			Gson gson = new GsonBuilder().create();
			try {
				/*
				 * processDefinitionObject = gson.fromJson(
				 * processInstanceJsonString, ProcessDefinition.class);
				 */
				if (processDefinitionObject != null) {
					processInstance = processInstanceService
							.saveProcessInstance(processDefinitionObject);

					if (processInstance != null) {
						if (processInstance.getProcessDefinition() != null) {
							updateMessageStatus(processInstance
									.getProcessDefinition());
							data = gson.toJson(processInstance
									.getProcessDefinition());
						}
					}
				} else {
					System.out.println("couchProcessData	.getContent() id : "
							+ couchProcessData.get_id() + " rev : "
							+ couchProcessData.get_rev());
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
			return data;

		} catch (Exception e) {
			logger.error("workFlowtask failed: " + e);
			System.out.println("workFlowtask failed: " + e);
		}

		return null;
	}

	private void updateMessageStatus(ProcessDefinition processDefinition) {
		for (Step step : processDefinition.getSteps()) {
			for (MessageType messageType : step.getMessageTypes()) {
				for (Message message : messageType.getMessages()) {
					message.setMessageStatus(messageService
							.getMessageStatus(message.getMessageId(),processDefinition.getOrganizationId()));
				}
			}
		}
	}

	private boolean putCouchData(String id, String message) {
		// String id = couchData.get_id();
		String url = couchDbPath + "_design/hl7store/_update/postDoc/" + id
				+ "?objecttype=smo";
		// Gson gson = new GsonBuilder().create();
		// couchData.setContent(message);
		// String content = couchData.getContent();//
		// gson.toJson(couchData.getContent());
		return postHttpClient(url, message);// content);
		// return true;
	}

	public int getLastSequence() {
		// String sequence;
		try {

			return last_seq;
			/*
			 * sequence = messageService.getCouchLastSequence();
			 * logger.info("Laste sequence :" + sequence); return
			 * Integer.parseInt(sequence);
			 */

		} catch (Exception e) {
			e.printStackTrace();
			logger.error("getLastSequence failed: " + e);
			return prev_last_seq;
		}

	}

	private void updateLastSequence() {
		try {
			logger.info("Updating couch sequence :" + last_seq);
			messageService.updateCouchLastSequence(Integer.toString(last_seq));
			logger.info("Updated sequence");
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("updateLastSequence failed: " + e);
		}
	}

	@Override
	public boolean isQueueEmpty() {
		return queue.isEmpty();
	}

	@Override
	public Queue<CouchChange> getQueue() {
		return queue;
	}

	@Override
	public Stack<CouchChange> getSuccessQueue() {
		return successQueue;
	}

	@Override
	public Stack<CouchChange> getPendingQueue() {
		return pendingQueue;
	}

	@Override
	public Stack<CouchChange> getFailedQueue() {
		return failedQueue;
	}

	@Override
	public boolean clearQueue() {
		if (queue != null) {
			queue.clear();
			return queue.size() > 0 ? false : true;
		}
		return false;
	}

	@Override
	public int resetSequence(int sequence) {
		last_seq = sequence;
		updateLastSequence();
		return sequence;
	}

	@Override
	public void start() {
		setPause(false);
		logger.info("Services is started ");
		// System.out.println("Services is started ");
	}

	@Override
	public void stop() {
		setPause(true);
		logger.info("Services is stopped ");
		// System.out.println("Services is stopped ");
	}

	/**
	 * @return the pause
	 */
	public boolean isPause() {
		return pause;
	}

	/**
	 * @param pause
	 *            the pause to set
	 */
	private void setPause(boolean pause) {
		this.pause = pause;
	}

	@Override
	public boolean isStopped() {
		if (isPause() && isQueueEmpty()) {
			return true;
		}
		return false;
	}

	/**
	 * @return the start
	 */
	public boolean isStart() {
		return start;
	}

	/**
	 * @param start
	 *            the start to set
	 */
	public void setStart(boolean start) {
		this.start = start;
		pause = !this.start;
	}

}
