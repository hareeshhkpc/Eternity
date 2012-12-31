package com.hin.hl7messaging;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.hin.hl7.messaging.api.IMessageRepository;
import com.hin.hl7messaging.api.IWorkFlowMessageService;
//import com.hin.hl7messaging.service.IWorkFlowTask;

@Service(value="workFlowMessageService")
public class WorkFlowMessageService implements IWorkFlowMessageService {
	
	private Logger logger = Logger.getLogger(WorkFlowMessageService.class.getName());

	@Resource(name="messageRepositoryStandard")
	private IMessageRepository standardMessageRepository;
	@Resource(name="messageRepository")
	private IMessageRepository messageRepository;

	public WorkFlowMessageService() {

	}

	public void saveMessage(String msgkey, String messageId, String message)
			throws Exception {

	}

	public List<String> getUserList(String condition) {
		List<String> userList = new ArrayList<String>();
		return userList;
	}

	public String getMessage(String messageID) {
		Map<String, HashMap<String, String>> resultMap;
		String columnFamily = "MESSAGE_STORE";
		String message = "";
		resultMap = standardMessageRepository.retrieveStandardColumnFamily(
				columnFamily, messageID);
		Set rowKeySet = resultMap.entrySet();
		Iterator iterator = rowKeySet.iterator();
		while (iterator.hasNext()) {
			Map.Entry entry = (Map.Entry) iterator.next();
			String key = (String) entry.getKey();
			HashMap<String, String> valueMap = (HashMap<String, String>) entry
					.getValue();
			Set superColumnSet = valueMap.entrySet();
			Iterator iter = superColumnSet.iterator();
			while (iter.hasNext()) {
				Map.Entry subEntry = (Map.Entry) iter.next();
				key = (String) subEntry.getKey();
				message = subEntry.getValue().toString();

			}
		}
		return message;
	}

	public void saveMessage(String message, String messageId) {
		String columnFamily = "MESSAGE_STORE";
		HashMap<String, String> objMessage = new HashMap<String, String>();
		objMessage.put(messageId, message);
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("ROWKEY", messageId);
		map.put("messageId", message);
		standardMessageRepository.saveMessage(columnFamily, map);
	}

	public void saveOrganisationUserMessage(String orgId, String userId,
			String messageId, String taskId, String message) {
		saveMessage(message, messageId);
		HashMap<String, Object> columnValueMap = new HashMap<String, Object>();
		HashMap<String, String> userMap = new HashMap<String, String>();
		HashMap<String, String> orgUserMap = new HashMap<String, String>();
		HashMap<String, String> orgMap = new HashMap<String, String>();
		HashMap<String, String> regMessageMap = new HashMap<String, String>();
		columnValueMap.put("ROWKEY", userId + orgId);
		userMap.put("value", userId);
		orgMap.put("value", orgId);
		regMessageMap.put("Message", message);
		regMessageMap.put("taskId", taskId);
		regMessageMap.put("MessageId", messageId);
		columnValueMap.put("ORGNISATION", orgMap);
		columnValueMap.put("USER_ID", userMap);
		//columnValueMap.put("ORG_USER_ID", orgUserMap);
		columnValueMap.put(taskId, regMessageMap);
		messageRepository.saveMessage("ORGANISATION_USER_MESSAGE",
				columnValueMap);
		columnValueMap.clear();

	}

	public List<String> getUserOrganization(String userId) throws Exception{
		Map<String, Map<String, Map<String, String>>> mainMap = new HashMap<String, Map<String, Map<String, String>>>();
		HashMap<String, Object> valueMap = new HashMap<String, Object>();
		List<String> userOrganization = new ArrayList<String>();
		String key = "", message = "";
		HashMap<String, Object> columnValueMap = new HashMap<String, Object>();
		columnValueMap.put("ROWKEY", userId);
		mainMap = messageRepository.retrieveSuperColumnFamily(userId, userId,
				"IDENTITY_REPO", null, null, columnValueMap);
		if (mainMap != null) {
			Set rowKeySet = mainMap.entrySet();
			Iterator iterator = rowKeySet.iterator();
			while (iterator.hasNext()) {
				Map.Entry entry = (Map.Entry) iterator.next();
				key = (String) entry.getKey();
				//System.out.println("RowKey: " + key);
				valueMap = (HashMap<String, Object>) entry.getValue();
				Set superColumnSet = valueMap.entrySet();
				Iterator iter = superColumnSet.iterator();
				while (iter.hasNext()) {
					Map.Entry subEntry = (Map.Entry) iter.next();
					key = (String) subEntry.getKey();
					valueMap = (HashMap<String, Object>) subEntry.getValue();
					Set columnSet = valueMap.entrySet();
					Iterator itr = columnSet.iterator();
					while (itr.hasNext()) {
						Map.Entry valueEntry = (Map.Entry) itr.next();
						key = (String) valueEntry.getKey();
						if (key.equals("OrgId")) {
							userOrganization
									.add((String) valueEntry.getValue());
							break;
						}

					}

				}
			}

		}
		return userOrganization;
	}

	/*public List<IWorkFlowTask> getOrganisationUserMessages(String userId) throws Exception{
		List<IWorkFlowTask> workFlowTaskList = new ArrayList<IWorkFlowTask>();
		List<String> orgList = getUserOrganization(userId);
		for (String orgId : orgList) {
			workFlowTaskList.addAll(getUserMessages(userId + orgId ));
		}
		workFlowTaskList.addAll(getUserMessages(userId));
		return workFlowTaskList;
	}

	public List<IWorkFlowTask> getOrganisationUserMessages(String orgId,
			String userId) {
		return getUserMessages(userId + orgId);
	}

	private List<IWorkFlowTask> getUserMessages(String rowKey) {
		List<IWorkFlowTask> workFlowTaskList = new ArrayList<IWorkFlowTask>();
		Map<String, Object> mainMap = new HashMap<String, Object>();
		HashMap<String, Object> valueMap = new HashMap<String, Object>();
		String key = "", message = "";
		HashMap<String, Object> columnValueMap = new HashMap<String, Object>();
		columnValueMap.put("ROWKEY", rowKey);
		try {
			// messageRepository.connect("172.25.250.165", 9160, true);
			// messageRepository.selectKeyspace("MessageKS", true);
			mainMap = messageRepository.retrieveSuperColumn(
					"ORGANISATION_USER_MESSAGE", columnValueMap);
		} catch (Exception ex) {
			logger.error("An error occured in retrieving SuperColumn:"+ex.getMessage());
		}
		if (mainMap != null) {
			Set rowKeySet = mainMap.entrySet();
			Iterator iterator = rowKeySet.iterator();
			while (iterator.hasNext()) {
				Map.Entry entry = (Map.Entry) iterator.next();
				key = (String) entry.getKey();
				//System.out.println("RowKey: " + key);
				valueMap = (HashMap<String, Object>) entry.getValue();

				Set superColumnSet = valueMap.entrySet();
				Iterator iter = superColumnSet.iterator();
				while (iter.hasNext()) {
					Map.Entry subEntry = (Map.Entry) iter.next();
					byte[] keyinBytes = (byte[]) subEntry.getKey();
					String keyinString = new String(keyinBytes);
					IWorkFlowTask workFlowTask = new WorkFlowTask();
					if (!keyinString.equals("ORGNISATION")
							&& !keyinString.equals("USER_ID")
							&& !keyinString.equals("ORG_USER_ID")) {
						valueMap = (HashMap<String, Object>) subEntry
								.getValue();
						Set columnSet = valueMap.entrySet();
						Iterator itr = columnSet.iterator();
						while (itr.hasNext()) {
							Map.Entry valueEntry = (Map.Entry) itr.next();
							byte[] columnKeyinBytes = (byte[]) valueEntry
									.getKey();
							String columnKeyinString = new String(
									columnKeyinBytes);
							if (columnKeyinString.equals("taskId")) {
								byte[] taskIdinBytes = (byte[]) valueEntry
										.getValue();
								String taskIdinString = new String(
										taskIdinBytes);
								workFlowTask.setTaskId(taskIdinString);
							}
							if (columnKeyinString.equals("Message")) {
								byte[] messageInBytes = (byte[]) valueEntry
										.getValue();
								String messageInString = new String(
										messageInBytes);
								if(messageInString!=null && messageInString.length()>0){
									messageInString = messageInString.replaceAll("--del--", "\n");
									messageInString = messageInString.replaceAll("\\\\", "'");
								}
								workFlowTask.setMessage(messageInString);
							}
							if (columnKeyinString.equals("MessageId")) {
								byte[] messageIdinBytes = (byte[]) valueEntry
										.getValue();
								String messageIdinString = new String(
										messageIdinBytes);
								workFlowTask
										.setUserProcessKey(messageIdinString);
							}
							workFlowTask.setCompleted(true);
							workFlowTaskList.add(workFlowTask);
						}
					}
				}
			}
		}
		return workFlowTaskList;
	}*/

	public String getMessageWorkFlow(String messageType) {
		Map<String, HashMap<String, String>> resultMap;
		String columnFamily = "MESSAGE_WORKFLOW_STORE";
		String message = "";
		resultMap = standardMessageRepository.retrieveStandardColumnFamily(
				columnFamily, messageType);
				

		Set rowKeySet = resultMap.entrySet();
		Iterator iterator = rowKeySet.iterator();
		while (iterator.hasNext()) {
			Map.Entry entry = (Map.Entry) iterator.next();
			String key = (String) entry.getKey();
			HashMap<String, String> valueMap = (HashMap<String, String>) entry
					.getValue();
			Set superColumnSet = valueMap.entrySet();
			Iterator iter = superColumnSet.iterator();
			while (iter.hasNext()) {
				Map.Entry subEntry = (Map.Entry) iter.next();
				key = (String) subEntry.getKey();
				message = subEntry.getValue().toString();

			}
		}
		return message;
	}

	public void saveMessageWorkFlow(String messageType, String workFlowName) {
		String columnFamily = "MESSAGE_WORKFLOW_STORE";
		HashMap<String, String> objMessage = new HashMap<String, String>();
		objMessage.put("value", workFlowName);
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("ROWKEY", messageType);
		map.put("WORKFLOWNAME", workFlowName);
		standardMessageRepository.saveMessage(columnFamily, map);
	}

}
