/*package com.hin.hl7messaging.web.service;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.RandomAccessFile;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import java.util.zip.ZipInputStream;

import javax.xml.xpath.XPathConstants;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.ByteArrayRequestEntity;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.RequestEntity;
import org.apache.http.client.ClientProtocolException;
import org.apache.log4j.Logger;
import org.w3c.dom.Document;

import com.hin.hl7messaging.MessageService;
import com.hin.hl7messaging.WorkFlowConstants;
import com.hin.hl7messaging.WorkFlowEngine;
import com.hin.hl7messaging.WorkFlowMessageService;
import com.hin.hl7messaging.WorkFlowTask;
import com.hin.hl7messaging.IdentityEngine.IdentityProcessor;
import com.hin.hl7messaging.IdentityServices.IIdentityProcessor;
import com.hin.hl7messaging.api.IMessageService;
import com.hin.hl7messaging.api.IWorkFlowMessageService;
import com.hin.hl7messaging.config.HINConfigurationProperty;
import com.hin.hl7messaging.context.HINApplicationContext;
import com.hin.hl7messaging.service.IWorkFlowEngine;
import com.hin.hl7messaging.service.IWorkFlowTask;
import com.hin.hl7messaging.utils.XMLHelper;
import com.hin.hl7messaging.web.service.api.IWorkFlowManagerService;

public class WorkFlowManager implements IWorkFlowManagerService {
	Integer i = 29;
	IWorkFlowEngine workFlowEngine;
	IWorkFlowMessageService workFlowMessageService;
	IIdentityProcessor identityProcessor;
	IMessageService messageService;
	private Logger logger = Logger.getLogger(WorkFlowManager.class.getName());

	public WorkFlowManager(String resource) {
		if (workFlowEngine == null) {
			try {
				workFlowEngine = new WorkFlowEngine(resource);
				workFlowMessageService = new WorkFlowMessageService();
				identityProcessor = new IdentityProcessor();
				messageService = new MessageService();
				
				String deploy = HINApplicationContext.getHINApplicationContext().getConfigurationParameter(HINConfigurationProperty.DEPLOY_WORKFLOW);
				if(deploy != null && deploy.equals("true")){
					deployTask();
				}
			} catch (Exception ex) {
				System.out.println(ex.getMessage());
				logger.error("Error in Constructor Initialisation: "+ex.getMessage());
			}
		}
	}

	
	 * public void testHINservice(String message) { try { //IWorkFlowTask
	 * workFlowTask = createNewTask(message); //storeMessage(message); //
	 * sendMailToUser(workFlowTask.getWorkFlowProcessKey()); //
	 * getNewUserTask(workFlowTask.getWorkFlowProcessKey()); } catch (Exception
	 * ex) { System.out.println(ex.getMessage()); } }
	 * 
	 * private void sendMailToUser(String message) {
	 * 
	 * }
	 * 
	 * private IWorkFlowTask createNewTask1(String message) { deployTask("");
	 * System.out.println(">> Workflow Object obtained from App Context: " +
	 * workFlowEngine); String xmlFile =
	 * "E:\\HIN\\source\\hin-workflow-engine\\src\\main\\resources\\PRPA_IN101001UV01_EncounterAppointment.xml"
	 * ; XPATHReader reader = new XPATHReader(xmlFile); String expression =
	 * "PRPA_IN101001UV01/controlActProcess/subject/registrationEvent/subject1/identifiedPerson/id/@root"
	 * ; String peocessKey = (String) reader.read(expression,
	 * XPathConstants.STRING); i = i + 1; peocessKey = i + i.toString();
	 * IWorkFlowTask workFlowTask = new WorkFlowTask();
	 * workFlowTask.setAsigneeType(WorkFlowConstants.INDIVIDUAL); String
	 * userName = getUserDetails(message); if (checkUserAlreadyExist(userName))
	 * { workFlowTask.setAutoAssign(true); } else {
	 * workFlowTask.setAsigneeName(userName); }
	 * workFlowTask.setProcessName("TaskAssignee");
	 * workFlowTask.setUserProcessKey(peocessKey); workFlowTask =
	 * workFlowEngine.initiateTask(workFlowTask); return workFlowTask; }
	 
	public IWorkFlowTask createNewTask(String userId, String message,
			String orgId, String messageType,
			HashMap<String, String> parameterList) {

		String WrokFlowName = workFlowMessageService
				.getMessageWorkFlow(getMessageKey(orgId,messageType));
		String messageId = getNewMessageKey();
		IWorkFlowTask workFlowTask = new WorkFlowTask();
		workFlowTask.setAsigneeType(WorkFlowConstants.INDIVIDUAL);
		workFlowTask.setAsigneeName(userId);
		workFlowTask.setProcessName(WrokFlowName);
		workFlowTask.setUserProcessKey(messageId);
		workFlowTask.setMessageType(messageType);
		workFlowTask.setOrgId(orgId);
		
		 * if(workFlowTask.getOrgId().equals(userId)){
		 * workFlowTask.setAutoAssign(true); }
		 
		if (messageType != "AddFriend" && parameterList != null) {
			workFlowTask.setParameterList(parameterList);
		}
		workFlowTask = workFlowEngine.initiateTask(workFlowTask);
		if (!messageType.equals("AddFriend")) {
			storeMessage(message, messageId);
		}
		return workFlowTask;
	}

	public IWorkFlowTask createNewTask(String userId, String message,
			String orgId, String messageType) {
		String WrokFlowName = workFlowMessageService
				.getMessageWorkFlow(getMessageKey(orgId,messageType));
		String messageId = getNewMessageKey();
		IWorkFlowTask workFlowTask = new WorkFlowTask();
		workFlowTask.setAsigneeType(WorkFlowConstants.INDIVIDUAL);
		workFlowTask.setAsigneeName(userId);
		workFlowTask.setProcessName(WrokFlowName);
		workFlowTask.setUserProcessKey(messageId);
		workFlowTask.setMessageType(messageType);
		workFlowTask.setOrgId(orgId);
		if(workFlowTask.getAsigneeName()!=null && workFlowTask.getAsigneeName().length()>0){
		workFlowTask = workFlowEngine.initiateTask(workFlowTask);
		storeMessage(message, messageId);
		}else{
			System.out.println("No Assignee : [ Expecting from message "+messageType+" ]");
		}
		return workFlowTask;
	}

	
	 * public IWorkFlowTask createNewTask(String userId,String message) {
	 * deployTask(""); IWorkFlowTask workFlowTask = new WorkFlowTask(); String
	 * messageId=getMessageKey();
	 * workFlowTask.setAsigneeType(WorkFlowConstants.INDIVIDUAL);
	 * workFlowTask.setAsigneeName(userId);
	 * workFlowTask.setProcessName("TaskAssignee");
	 * workFlowTask.setUserProcessKey(messageId); workFlowTask =
	 * workFlowEngine.initiateTask(workFlowTask);
	 * storeMessage(message,messageId); return workFlowTask; }
	 
	private String getNewMessageKey() {

		Date date = new Date();
		try {
			Thread.currentThread().sleep(1000);
		} catch (InterruptedException e) {
			logger.error("Failure in getting NewMessageKey: "+e.getMessage());
		}
		SimpleDateFormat smpd = new SimpleDateFormat("yyyyMMddHHmmss");

		return smpd.format(date);
	}

	public void storeMessage(String message, String messageId) {
		// store message to casandraDB.
		workFlowMessageService.saveMessage(message, messageId);
	}

	public List<IWorkFlowTask> getNewUserTask(String Key) {
		List<IWorkFlowTask> workFlowTaskList = workFlowEngine
				.getNewUserTask(Key);
		return retriveMessage(workFlowTaskList);
	}

	public IWorkFlowTask retriveMessage(IWorkFlowTask workFlowTask) {
		String message = "";
		// retrive message from casandra DB
		message = workFlowMessageService.getMessage(workFlowTask
				.getUserProcessKey());
		workFlowTask.setMessage(message);
		return workFlowTask;
	}

	private List<IWorkFlowTask> retriveMessage(
			List<IWorkFlowTask> workFlowTaskList) {
		for (IWorkFlowTask workFlowTask : workFlowTaskList) {
			try {
				if (!workFlowTask.getMessageType().equals("AddFriend")) {
					retriveMessage(workFlowTask);
					updateAssignablePeople(workFlowTask);
				}
			} catch (Exception ex) {
				logger.error("Failure in retrieving Message: "+ex.getMessage());
			}
		}
		return workFlowTaskList;
	}

	public List<IWorkFlowTask> getUserTask(String userName) {
		return retriveMessage(workFlowEngine.getUserTasks(userName));
	}

	public List<IWorkFlowTask> getUserGroupTask(String userName) {
		return retriveMessage(workFlowEngine.getUserTasks(userName));
	}

	public void assignTask(IWorkFlowTask workFlowTask, String userName) {
		workFlowEngine.assignTask(workFlowTask.getTaskAssigned().getId(),
				userName);
	}

	public void taskDone(String taskId, String input, String AsigneeType,
			String asigneeName) {
		IWorkFlowTask workFlowTask = new WorkFlowTask();
		workFlowTask.setTaskId(taskId);
		workFlowTask.setOutCome(input);
		workFlowTask.setAsigneeType(WorkFlowConstants.INDIVIDUAL);
		workFlowTask.setAsigneeName(asigneeName);
		workFlowEngine.taskDone(workFlowTask);
	}

	public void taskDone(String orgId, String userId, String messageId,
			String message, String taskId, String input, String AsigneeType,
			String asigneeName) {
		IWorkFlowTask workFlowTask = new WorkFlowTask();
		if (input.equals("Complete")) {
			asigneeName = identityProcessor.getUserId(message);
			System.out.println(asigneeName);
		}
		workFlowTask.setTaskId(taskId);
		workFlowTask.setOutCome(input);
		workFlowTask.setAsigneeType(WorkFlowConstants.INDIVIDUAL);
		workFlowTask.setAsigneeName(asigneeName);
		workFlowTask.setOrgId((orgId == null ? "" : orgId));
		workFlowEngine.taskDone(workFlowTask);
		workFlowMessageService.saveOrganisationUserMessage(orgId, userId,
				messageId, workFlowTask.getTaskId(), message);

		if (workFlowTask.getNewTask() != "") {
			message = "abc";
			createNewTask(asigneeName, message, orgId,
					workFlowTask.getNewTask());
		}
		Document xmlDocument = XMLHelper.getXMLDocument(message);
		String messageType = (String) XMLHelper.read(xmlDocument, "name(/*)",
				XPathConstants.STRING);
		if (messageType.equals("PRPA_IN400000")) {
			try {
				postToHttpServiceAsMultipartOnlyBody(message);
			} catch (ClientProtocolException e) {
				System.out.println("Message couldn't able to send");
				logger.error("Unable to send Message: "+e.getMessage());
			} catch (IOException e) {
				System.out.println("Message couldn't able to send");
				logger.error("Unable to send Message: "+e.getMessage());
			}
		}
		createNewTask(identityProcessor.getUserId(message),
				message, orgId, "USERCOPY_" + messageType);
		HashMap<String, String> variable = new HashMap<String, String>();
		variable.put("MESSAGE", message);
		variable.put("PROFILE_ID", userId);
		variable.put("ORGANIZATION_ID", orgId);
		messageService.archieveMessage(userId, message,
				variable);
	}

	public void taskDone(String orgId, String userId, String messageId,
			String message, String taskId, String input, String AsigneeType,
			String asigneeName, String messageType) {
		IWorkFlowTask workFlowTask = new WorkFlowTask();
		workFlowTask.setTaskId(taskId);
		workFlowTask.setOutCome(input);
		workFlowTask.setAsigneeType(WorkFlowConstants.INDIVIDUAL);
		workFlowTask.setAsigneeName(asigneeName);
		workFlowTask.setMessageType(messageType);
		workFlowTask.setOrgId((orgId == null ? "" : orgId));
		workFlowEngine.taskDone(workFlowTask);
		workFlowMessageService.saveOrganisationUserMessage(orgId, userId,
				messageId, workFlowTask.getTaskId(), message);
		HashMap<String, String> variable = new HashMap<String, String>();
		variable.put("MESSAGE", message);
		variable.put("PROFILE_ID", userId);
		variable.put("MESSAGE_TYPE", messageType);
		variable.put("ORGANIZATION_ID", orgId);
		messageService.archieveMessage(userId, message, variable);
		if (workFlowTask.getNewTask() != "") {
			String newMessage = "abc";
			createNewTask(asigneeName, newMessage, orgId,
					workFlowTask.getNewTask());
		}
	}

	private void updateAssignablePeople(IWorkFlowTask workFlowTask)
			throws Exception {
		if (workFlowTask.getOrgId() != null
				&& !workFlowTask.getOrgId().equals("")) {
			workFlowTask.setAssignablePeople(identityProcessor
					.getUserListForOrg(workFlowTask.getOrgId(),
							workFlowTask.getFilterConditions()));
		} else {
			workFlowTask.setAssignablePeople(identityProcessor
					.getRelatedUsers(workFlowTask.getTaskAssigned()
							.getAssignee()));
		}
	}

	public void deployTask(String filePath, String messageType,
			String workFlowName) {
		workFlowEngine.deployProcessDefinition(filePath);
		workFlowMessageService.saveMessageWorkFlow(messageType, workFlowName);
	}

	public void deployTask() {
		workFlowEngine.deleteAllDeployment();
		String configLocation = (String) HINApplicationContext
				.getHINApplicationContext().getConfigurationParameter(
						HINConfigurationProperty.WORKFLOW_DEPLOYMENT_PATH);
		String deploymentPath = HINApplicationContext
				.getHINApplicationContext().getRealPath(configLocation);

		File file = new File(deploymentPath);
		for (File deploymentFile : file.listFiles()) {
			//workFlowEngine.deployProcessDefinition(deploymentFile);
		
			ZipEntry zipentry;
			try{
		    workFlowEngine.deployProcessDefinition(deploymentFile.getAbsolutePath());
			ZipInputStream zipinputstream = new ZipInputStream(
			                 new FileInputStream(deploymentFile));
			zipentry = zipinputstream.getNextEntry();
			ZipFile zf = new ZipFile(deploymentFile);
		      
			while (zipentry != null) { 
			                String entryName = zipentry.getName();
			                int dotPos = entryName.lastIndexOf(".");
			    			String  extension = entryName.substring(dotPos);
			    			if(extension.equals(".xml")){
			    			File newFile = new File(entryName);
			    			  RandomAccessFile  rf;
			    			//  rf = new RandomAccessFile(entryName,"r");    
			    			  
			    			  BufferedReader br = new BufferedReader(
			    		                new InputStreamReader(zf.getInputStream(zipentry)));
			    		            
			                  String line;
			                  org.w3c.dom.Document deploymentDocument=null ;
			                  String process="";
			                  while ((line =br.readLine()) !=null)
			                  {
			                	
			                	  process=process+line;
					    					
			                }
			                  deploymentDocument = XMLHelper.getXMLDocument(process);
			             //   rf.close(); 
			    			String workFlowName = (String) XMLHelper.read(deploymentDocument,
			    					"/process/@name", XPathConstants.STRING);
			    		//	workFlowEngine.getProcessImageByProcessDefinitionName();
			    			String messageTypeJpdlFile = entryName;
			    			if (messageTypeJpdlFile != null && messageTypeJpdlFile.length() > 0
			    					&& messageTypeJpdlFile.indexOf(".") != -1) {
			    				messageTypeJpdlFile = messageTypeJpdlFile.substring(0,
			    						messageTypeJpdlFile.indexOf("."));
			    			}
			    			workFlowMessageService.saveMessageWorkFlow(messageTypeJpdlFile,
			    					workFlowName);
			    		
			    			}
			    			zipinputstream.closeEntry();
			                zipentry = zipinputstream.getNextEntry();			               
			 }
			
			}catch(Exception ex){
				System.out.println("Error while deploying:" + deploymentFile.getName());
			}
			System.out.println("File :" + deploymentFile.getName()
					+ " deployed sucessfully.");
		
		}
	}

	public List<IWorkFlowTask> getOrganisationUserMessages(String userId,
			String orgId) {
		List<IWorkFlowTask> workFlowTaskList = new ArrayList<IWorkFlowTask>();
		workFlowMessageService.getOrganisationUserMessages(orgId, userId);
		return workFlowTaskList;
	}

	public List<IWorkFlowTask> getOrganisationUserMessages(String userId)
			throws Exception {
		
		 * List<IWorkFlowTask> workFlowTaskList = new
		 * ArrayList<IWorkFlowTask>(); HashMap<String, String> objOrgList = new
		 * HashMap<String, String>(); objOrgList =
		 * identityProcessor.getOrgListForUser(userId, new HashMap<String,
		 * Object>()); for (String orgId : objOrgList.keySet()) { if (orgId !=
		 * "") { workFlowTaskList.addAll(workFlowMessageService.
		 * getOrganisationUserMessages(orgId,userId)); } }
		 
		return workFlowMessageService.getOrganisationUserMessages(userId);
	}

	public List<IWorkFlowTask> getAllUserMessages(String userId)
			throws Exception {
		List<IWorkFlowTask> workFlowTaskList = getUserTask(userId);
		workFlowTaskList.addAll(workFlowMessageService
				.getOrganisationUserMessages(userId));
		return workFlowTaskList;
				//sortMessages(workFlowTaskList);
	}

	public List<IWorkFlowTask> sortMessages(List<IWorkFlowTask> workFlowTaskList) {
		
		Collections.sort(workFlowTaskList, new WorkFlowComparator());
		Collections.reverse(workFlowTaskList) ;
		for(IWorkFlowTask flowTask:workFlowTaskList){
			System.out.println(flowTask.getUserProcessKey());
		}
		TreeMap<Long, Object> sortingList = new TreeMap<Long, Object>();
		List<IWorkFlowTask> sortedWorkFlowTaskList = new ArrayList<IWorkFlowTask>();
		for (IWorkFlowTask workFlowTask : workFlowTaskList) {
			sortingList.put(Long.parseLong(workFlowTask.getUserProcessKey()),
					workFlowTask);
		}

		Set rowKeySet = sortingList.entrySet();
		Iterator iterator = rowKeySet.iterator();
		while (iterator.hasNext()) {
			Map.Entry entry = (Map.Entry) iterator.next();
			sortedWorkFlowTaskList.add((IWorkFlowTask) entry.getValue());
		}
		// Collections.reverse(sortedWorkFlowTaskList);
		// ValueComparator obj=new ValueComparator(base)
		
		return workFlowTaskList;
	}

	// ***********************************************Friend
	// Request**********************************************************////////
/*
	public void createFriendRequestTask(String loginUserId,
			String friendUserId, String message, String relationship)
			throws Exception {
		IWorkFlowTask friendRequestWorkFlow = createRequestSendWorkFlow(
				loginUserId, message, friendUserId, relationship);
		HashMap<String, String> parameterList = new HashMap<String, String>();
		parameterList.put("friendRequestBy", loginUserId);
		parameterList.put("friendRequestKey",
				friendRequestWorkFlow.getWorkFlowProcessKey());
		if (relationship != null)
			parameterList.put("relationship", relationship);
		createFriendRequestWorkFlow(friendUserId, message, parameterList,
				loginUserId, relationship);
	}

	private IWorkFlowTask createRequestSendWorkFlow(String userId,
			String message, String friendId, String relationship)
			throws Exception {
		String WrokFlowName = "RequestSend";
		String messageId = getNewMessageKey();
		IWorkFlowTask workFlowTask = new WorkFlowTask();
		workFlowTask.setAsigneeType(WorkFlowConstants.INDIVIDUAL);
		workFlowTask.setAsigneeName(userId);
		workFlowTask.setProcessName(WrokFlowName);
		workFlowTask.setMessage(getRequestSentMessage(relationship, friendId));
		workFlowTask.setUserProcessKey(messageId);
		workFlowTask.setMessageType("IMTAC_CONTACT_SEND_REQUEST");
		workFlowTask = workFlowEngine.initiateTask(workFlowTask);
		storeMessage(workFlowTask.getMessage(), messageId);
		return workFlowTask;
	}

	private void createFriendRequestWorkFlow(String userId, String message,
			HashMap<String, String> parameterList, String loginUserId,
			String relationship) throws Exception {
		String WrokFlowName = "AddRelation";
		String messageId = getNewMessageKey();
		IWorkFlowTask workFlowTask = new WorkFlowTask();
		workFlowTask.setAsigneeType(WorkFlowConstants.INDIVIDUAL);
		workFlowTask.setAsigneeName(userId);
		workFlowTask.setProcessName(WrokFlowName);
		workFlowTask.setUserProcessKey(messageId);
		workFlowTask.setParameterList(parameterList);
		workFlowTask.setMessage(getRequestMessage(relationship, loginUserId));
		workFlowTask.setMessageType("IMTAC_CONTACT_GOT_REQUEST");
		workFlowTask = workFlowEngine.initiateTask(workFlowTask);
		storeMessage(workFlowTask.getMessage(), messageId);
	}

	public void handleFriendRequestTask(String loginUserId,
			String friendUserId, String friendRequestKey, String taskId,
			String message, String input, String relationship) throws Exception {
		makeFriendRequestTaskCompeleted(friendRequestKey, taskId, input);
		if (input.equals("Accept")) {
			updateRelationshipInProfiles(loginUserId, friendUserId, message,
					relationship);
		}
	}

	private void makeFriendRequestTaskCompeleted(String friendRequestKey,
			String taskId, String input) {
		notifyFriendAboutDecision(friendRequestKey);
		IWorkFlowTask workFlowTask = new WorkFlowTask();
		workFlowTask.setTaskId(taskId);
		workFlowTask.setOutCome(input);
		workFlowTask.setAsigneeType(WorkFlowConstants.INDIVIDUAL);
		workFlowTask.setOrgId("");
		workFlowEngine.taskDone(workFlowTask);
	}

	private void notifyFriendAboutDecision(String friendRequestKey) {
		List<IWorkFlowTask> workFlowTaskList = getNewUserTask(friendRequestKey);
		for (IWorkFlowTask friendRequestTask : workFlowTaskList) {
			// if(friendRequestTask.getMessageType().equals("AddRelation")){
			friendRequestTask.setOutCome("ok");
			workFlowEngine.taskDone(friendRequestTask);
			// }
		}
	}

	private void updateRelationshipInProfiles(String loginUserId,
			String friendUserId, String message, String relationship)
			throws Exception {
		identityProcessor.createUserRelationships(loginUserId, friendUserId,
				message, relationship);
	}

	private String getRequestSentMessage(String relationship, String userID)
			throws Exception {
		String requestType="";
		if (relationship == null || relationship.equals(""))
			relationship = "Friend";
		if (relationship != null && relationship.equals("nextOfKin")) {
			requestType="Next Of Kin";
		} else if (relationship != null
				&& relationship.equals("emergencyContact")) {
			requestType="Emergency Contact";
		} else if (relationship != null && relationship.equals("guardian")) {
			requestType="Guaridan";
		}
		
	
		return "<IMTAC_CONTACT_SEND_REQUEST id=\"id1_1\"><id id=\"id1_1_id227_1\" root=\" "
				+ requestType
				+ "request send to :"
				+ identityProcessor.getUserName(userID)
				+ "\" extension=\"\" assigningAuthorityName=\"${orgAuthority}\" displayable=\"\" nullFlavor=\"\"></id><name id=\"id1_1_id229_1\" use=\"L\">${orgName}</name><message id=\"id1_1_id232_1\" use=\"${orgMail}\"	value=\"\" nullFlavor=\"\"></message></IMTAC_CONTACT_SEND_REQUEST>";
	}

	private String getRequestMessage(String relationship, String userID)
			throws Exception {
		String requestType="";
		if (relationship == null || relationship.equals(""))
			relationship = "Friend";
		if (relationship != null && relationship.equals("nextOfKin")) {
			requestType="Next Of Kin";
		} else if (relationship != null
				&& relationship.equals("emergencyContact")) {
			requestType="Emergency Contact";
		} else if (relationship != null && relationship.equals("guardian")) {
			requestType="Guaridan";
		}
		return "<IMTAC_CONTACT_GOT_REQUEST id=\"id1_1\"><id id=\"id1_1_id227_1\" root=\"  "
				+ relationship
				+ " request from :"
				+ identityProcessor.getUserName(userID)
				+ "\" extension=\"\" assigningAuthorityName=\"${orgAuthority}\" displayable=\"\" nullFlavor=\"\"></id><name id=\"id1_1_id229_1\" use=\"L\">${orgName}</name><message id=\"id1_1_id232_1\" use=\"\" 	value=\"\" nullFlavor=\"\"></message></IMTAC_CONTACT_GOT_REQUEST>";
	}

	// ***********************************************Friend
	// Request**********************************************************////////
/*
	protected String postToHttpServiceAsMultipartOnlyBody(String content)
			throws ClientProtocolException, IOException {
		String url = HINApplicationContext.getHINApplicationContext()
				.getConfigurationParameter(
						HINConfigurationProperty.MESSAGE_POST_SERVER_URL);
		PostMethod post = new PostMethod(url);
		RequestEntity entity = new ByteArrayRequestEntity(content.getBytes(),
				"text/xml; charset=ISO-8859-1");
		post.setRequestEntity(entity);
		// Get HTTP client
		HttpClient httpclient = new HttpClient();
		// Execute request
		try {
			int result = httpclient.executeMethod(post);
			// Display status code
			System.out.println("Response status code: " + result);
			// Display response
			System.out.println("Response body: ");
			String response = post.getResponseBodyAsString();
			System.out.println(response);
		} finally {
			// Release current connection to the connection pool once you are
			// done
			post.releaseConnection();
		}
		return null;
	}

	public ByteArrayInputStream getWorkFlowProcessImage(String orgId,String messageType){
		String workFlowProcess=workFlowMessageService.getMessageWorkFlow(getMessageKey(orgId,messageType));
		return workFlowEngine.getProcessImageByProcessDefinitionName(workFlowProcess);
	}
    public String getMessageKey(String orgId,String messageKey){
    	try{
    		if(!messageKey.startsWith("USERCOPY")){
    		String orgName="";
    		if(orgId!=null && !orgId.equals("")){
    	      orgName=identityProcessor.getUserName(orgId);
    		}
    		messageKey=orgName+"_"+messageKey;
    		}
    	}catch(Exception ex){
    		System.out.println(ex.getMessage());
    	}
    	return messageKey;
    }
    
}
*/