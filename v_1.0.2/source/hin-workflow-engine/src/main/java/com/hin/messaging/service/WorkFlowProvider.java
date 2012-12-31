package com.hin.messaging.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import javax.annotation.Resource;
import javax.xml.xpath.XPathConstants;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.hin.domain.ListItem;
import com.hin.domain.vo.MessageVO;
import com.hin.domain.vo.ProfileVO;
import com.hin.domain.vo.SearchVO;
import com.hin.domain.vo.UserVO;
import com.hin.hl7.messaging.api.IIdentityRepository;
import com.hin.hl7messaging.WorkFlowTask;
import com.hin.hl7messaging.api.IAuthenticationService;
import com.hin.hl7messaging.api.IIndexService;
import com.hin.hl7messaging.api.IMessageService;
import com.hin.hl7messaging.api.ISearchService;
import com.hin.hl7messaging.cassandra.ICassandraConnector;
import com.hin.hl7messaging.identity.repository.IdentityMessageRepository;
import com.hin.hl7messaging.service.IWorkFlowTask;
import com.hin.hl7messaging.utils.WorkFlowContants;
import com.hin.hl7messaging.utils.XMLHelper;
import com.hin.messaging.IWorkFlowDefinition;
import com.hin.service.IMessageParticipantService;

@Service(value = "workFlowProvider")
public class WorkFlowProvider implements com.hin.messaging.IWorkFlowProvider {

	private Logger logger = Logger.getLogger(WorkFlowProvider.class.getName());

	@Autowired
	private ICassandraConnector cassandraConnector;
	

	@Resource(name = "identityMessageRepository")
	private IIdentityRepository messageService;
	
	@Autowired
	IWorkFlowDefinition workFlowDefinition;

	@Autowired
	IIndexService indexService;

	@Autowired
	IMessageService msgService;
	

	@Autowired
	IMessageParticipantService messageParticipantService;
	
	@Autowired
	ISearchService searchService;
	
	
	public boolean deployWorkFlowDefinition() throws Exception {
		
		workFlowDefinition.deployWorkFlow();
		return true;
	}

	public IWorkFlowTask createNewTask(String userId, MessageVO messageVO) throws Exception {
	/*	message=updateMessageIdinMessage(message,messageId);*/
		msgService.saveMessage(messageVO);
		return startNewTask(userId, messageVO, "");
	}
	

	
	private String updateMessage(String messageXML, String attrName,
			String value) {
		Document xmlDocument = XMLHelper.getXMLDocument(messageXML);

		NodeList nodeList = (NodeList) XMLHelper.read(xmlDocument, attrName,
				XPathConstants.NODESET);
		if (nodeList.getLength() < 1) {
			return messageXML;
		} else {
			Node node = nodeList.item(0);
			node.setNodeValue(value);
		}
		return XMLHelper.getXMLDocumentAsString(xmlDocument);

	}
	public String getNewMessageKey() {
		return UUID.randomUUID().toString();
	}
   /* public void updateMessage(MessageVO messageVO){
    	
		String messageType = messageService.getColumnValue("MESSAGE_ID_TYPE",
				messageVO.getId(), "MESSAGETYPE");
		String columnFamily=messageType + "_ST";
		if (messageType != null && messageType.length() > 1) {
			String versionString = messageService.getColumnValue(columnFamily, messageVO.getId(), "VERSION");
			Integer version = Integer.parseInt(versionString.equals("") ? "1"
					: versionString);
			messageService.getColumnValue(columnFamily, messageVO.getId(),
					version.toString());
			version=version+1;
			HashMap<String, Object> map = new HashMap<String, Object>();
			map.put("ROWKEY",  messageVO.getId());
			map.put(version.toString(), messageVO.getMessage());
			map.put("VERSION", version.toString());
			Document messageDoc = XMLHelper.getXMLDocument( messageVO.getMessage());
			String MessageConfigFileName = ((Element) messageDoc
					.getElementsByTagName("message").item(0))
					.getAttribute("config");
			map.put("MESSAGETYPE", MessageConfigFileName);
			map.put("MESSAGESTATUS", WorkFlowContants.MessageStatus.LOCKED);
			messageService.saveStandardColumnFamily(map, columnFamily);
		}
		
    	String columnFamily = "MESSAGE_STORE";
		String versionString=messageService.getColumnValue("MESSAGE_STORE", messageVO.getId(), "VERSION");
		Integer version =  Integer.parseInt(versionString.equals("")?"0":versionString);
		version=version+1;
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("ROWKEY",  messageVO.getId());
		map.put(version.toString(), messageVO.getMessage());
		map.put("VERSION", version.toString());
		Document messageDoc = XMLHelper.getXMLDocument( messageVO.getMessage());
		String MessageConfigFileName = ((Element) messageDoc
				.getElementsByTagName("message").item(0))
				.getAttribute("config");
		map.put("MESSAGETYPE", MessageConfigFileName);
		map.put("MESSAGESTATUS", WorkFlowContants.MessageStatus.LOCKED);
		messageService.saveStandardColumnFamily(map, columnFamily);
    }
	*/
	
	public IWorkFlowTask startNewTask(String userId, MessageVO messageVO, String taskName) throws Exception {
		String columnFamily = "WORKFLOW_TASK";
		IWorkFlowTask newWorkFlowTask = null;
		if(messageVO.getTaskId().length()>1){
			newWorkFlowTask = createNewTask(userId, messageVO.getId(),
				messageVO.getType(), messageVO.getMessage(),messageVO.getTaskId(),taskName);
		}else{
			newWorkFlowTask = createNewTask(userId, messageVO.getId(),
					messageVO.getType(), messageVO.getMessage(), taskName);
		}
		if(newWorkFlowTask!=null){
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("ROWKEY", newWorkFlowTask.getTaskId());
		map.put("USERID", userId);
		map.put("MESSAGEID", messageVO.getId());
		map.put("MESSAGETYPE", messageVO.getType());
		map.put("TASKNAME", taskName);
		map.put("TASKSTATUS",WorkFlowContants.WorkFlowTaskStatus.STARTED);
		messageService.saveStandardColumnFamily(map, columnFamily);
	//	messageParticipantService.saveMessageParticipant(userId,messageVO.getId());
		return newWorkFlowTask;
		}else
			return null;
	}

	private IWorkFlowTask createNewTask(String userId, String messageId,
			String messageType, String message, String taskId, String taskName) throws Exception {

		// String messageWorkFlow = getMessageWorkFlow(messageType);
		String messageWorkFlow = messageService.getColumnValue("WORKFLOW_DEFINITION",
				messageType, "MESSAGEWORKFLOW");
		if(messageWorkFlow==null||messageWorkFlow.length()<=1){
			System.out.println("Please configure workflow for message type :"+messageType);
			return null;
		}
		if (taskName.equals("")) {
			taskName = getStartingTaskName(messageWorkFlow);
		}
		List<String> outcomeList = getTaskOutComes(messageWorkFlow, taskName);
		Set<String> mySet = new HashSet(outcomeList);

		HashMap taskPrivacy = getTaskPrivacy(messageWorkFlow, taskName);
	
 	    return getTaskObject(userId, message, messageType, mySet, taskPrivacy, taskId, taskName, messageId);
	}
	private IWorkFlowTask getTaskObject(String asigneeName,String message,String messageType,Set<String> taskOutComes,HashMap<String, String> parameterList,String taskId,String processName,String userProcessKey){
		IWorkFlowTask newWorkFlowTask = new WorkFlowTask();
		if(asigneeName!=null)
		newWorkFlowTask.setAsigneeName(asigneeName);
		if(message!=null)
		newWorkFlowTask.setMessage(message);
		if(messageType!=null)
		newWorkFlowTask.setMessageType(messageType);
		if(taskOutComes!=null)
		newWorkFlowTask.setTaskOutComes(taskOutComes);
		if(parameterList!=null)
		newWorkFlowTask.setParameterList(parameterList);
		if(taskId!=null)
		newWorkFlowTask.setTaskId(taskId);
		if(processName!=null)
		newWorkFlowTask.setProcessName(processName);
		if(userProcessKey!=null)
		newWorkFlowTask.setUserProcessKey(userProcessKey);
		return newWorkFlowTask;
	}

	private IWorkFlowTask createNewTask(String userId, String messageId,
			String messageType, String message, String taskName) throws Exception {
		String taskId = getNewMessageKey();
		return createNewTask(userId, messageId, messageType, message, taskId,
				taskName);
	}

	private String getMessageWorkFlow(String wfName) {
		HashMap<String, Object> columnMap = new HashMap<String, Object>();
		columnMap.put("ROWKEY", wfName);
		HashMap<byte[], HashMap<byte[], Object>> workFlowMessage = messageService
				.retrieveSuperColumn("HIN_ETERNITY", "WORKFLOW_DEFINITION",
						wfName);
		String workFlow = "", columnName = "", status = "";
		HashMap<String, String> columnValueMap = new HashMap<String, String>();
		Iterator iterator = workFlowMessage.entrySet().iterator();
		while (iterator.hasNext()) {
			Map.Entry subscriberIdEntry = (Map.Entry) iterator.next();
			columnValueMap = (HashMap<String, String>) subscriberIdEntry
					.getValue();
			Iterator columnValueIterator = columnValueMap.entrySet().iterator();
			while (columnValueIterator.hasNext()) {
				Map.Entry columnValueEntry = (Map.Entry) columnValueIterator
						.next();
				columnName = new String((byte[]) columnValueEntry.getKey());
				if (columnName.equals("MESSAGETYPE")) {
					// Map.Entry subdEntry = (Map.Entry) iterator.next();
					columnValueMap = (HashMap<String, String>) columnValueEntry
							.getValue();
					Iterator columnIterator = columnValueMap.entrySet()
							.iterator();
					while (columnIterator.hasNext()) {
						Map.Entry columnEntry = (Map.Entry) columnIterator
								.next();
						columnName = new String((byte[]) columnEntry.getKey());
						if (columnName.equals("MESSAGEWORKFLOW")) {
							workFlow = new String(
									(byte[]) columnEntry.getValue());
							break;

						}
					}
				}
				if (workFlow != "") {
					break;
				}
			}

		}
		workFlow = workFlow.replace("--del--", "");
		return workFlow;
	}

	private String getStartingTaskName(String message) throws Exception {
		NodeList nodeList = XMLHelper.getXMLDocument(message)
				.getElementsByTagName("start");
		String nextTask = "";
		int i = 0;
		if(nodeList==null)
			throw new Exception("Please configure workflow."); 
		if (nodeList.getLength() <= 0)
			return "";
		while (i <= nodeList.getLength()) {
			if (nodeList.item(i).getFirstChild().getNextSibling().getNodeName()
					.equals("transition")) {
				org.w3c.dom.Node transitionNode = nodeList.item(i)
						.getFirstChild().getNextSibling();
				nextTask = transitionNode.getAttributes().getNamedItem("to")
						.getNodeValue();
			}
			break;
		}
		return nextTask;
	}

	private List<String> getTaskOutComes(String message, String TaskName) {
		NodeList nodeList = XMLHelper.getXMLDocument(message)
				.getElementsByTagName("task");
		List<String> nextTask = new ArrayList<String>();
		int i = 0;
		if (nodeList.getLength() <= 0)
			return nextTask;
		while (i < nodeList.getLength()) {
			if (nodeList.item(i).getAttributes().getNamedItem("name")
					.getNodeValue().equals(TaskName)) {
				NodeList transitionNodeList = nodeList.item(i).getChildNodes();
				int j = 0;
				while (j < transitionNodeList.getLength()) {
					if (transitionNodeList.item(j).getNodeName()
							.equals("transition")) {
						nextTask.add(transitionNodeList.item(j).getAttributes()
								.getNamedItem("to").getNodeValue());
					}
					j++;
				}
				break;
			}
			i++;
		}
		return nextTask;
	}

	private HashMap<String, String> getTaskPrivacy(String message,
			String TaskName) {
		NodeList nodeList = XMLHelper.getXMLDocument(message)
				.getElementsByTagName("task");
		HashMap<String, String> privacySettings = new HashMap<String, String>();
		int i = 0;
		if (nodeList.getLength() <= 0)
			return privacySettings;
		while (i <= nodeList.getLength()-1) {
			if (nodeList.item(i).getAttributes().getNamedItem("name")
					.getNodeValue().equals(TaskName)) {
				NodeList transitionNodeList = nodeList.item(i).getChildNodes();
				int j = 0;
				while (j < transitionNodeList.getLength()) {
					if (transitionNodeList.item(j).getNodeName()
							.equals("privacy")) {
						NodeList privacySetting = transitionNodeList.item(j)
								.getChildNodes();
						int k = 0;
						while (k < privacySetting.getLength()) {
							if (!privacySetting.item(k).getNodeName()
									.equals("#text")) {
								privacySettings.put(privacySetting.item(k)
										.getNodeName(), privacySetting.item(k).getTextContent());
							}
							k++;
						}
						break;
					}
					j++;
				}
				break;
			}
			i++;
		}
		return privacySettings;
	}

	public List<IWorkFlowTask> getUserTask(String userID) throws Exception {
		Map<String, HashMap<String, String>> resultMap = messageService
				.retrieveStandardColumnFamily("WORKFLOW_TASK", "USERID", userID);
		List<String> columnList = new ArrayList<String>();
		columnList.add("MESSAGEID");
		columnList.add("MESSAGETYPE");
		columnList.add("TASKNAME");
		columnList.add("TASKSTATUS");
		return getWorkFlowTaskList(resultMap, columnList, userID);
	}
	
	private List<IWorkFlowTask> getWorkFlowTaskList(
			Map<String, HashMap<String, String>> resultMap,
			List<String> column, String userID) throws Exception {
		String columnName = "";
		List<String> msgIdList;
		HashMap<String, String> columnValueMap = new HashMap<String, String>();
		HashMap<String, List<String>> columnValues = new HashMap<String, List<String>>();
		List<IWorkFlowTask> workFlowTaskList = new ArrayList<IWorkFlowTask>();
	/*	Iterator iterator = resultMap.entrySet().iterator();
		while (iterator.hasNext()) {
	    	Map.Entry subscriberIdEntry = (Map.Entry) iterator.next();
			columnValues=messageService.getColumnValues(column,subscriberIdEntry);
			workFlowTaskList.add(createNewTask(userID,
					columnValues.get("MESSAGEID").get(0),
					columnValues.get("MESSAGETYPE").get(0),
					msgService.getMessage(columnValues.get("MESSAGEID").get(0)),
					subscriberIdEntry.getKey().toString(),
					columnValues.get("TASKNAME").get(0)));

			columnValues.clear();
		}*/
		return workFlowTaskList;
	}
	private List<IWorkFlowTask> getWorkFlowTaskList(
			Map<String, HashMap<String, String>> resultMap,
			List<String> column, String userID,String messageId) throws Exception {
		String columnName = "";
		List<String> msgIdList;
		HashMap<String, String> columnValueMap = new HashMap<String, String>();
		HashMap<String, List<String>> columnValues = new HashMap<String, List<String>>();
		List<IWorkFlowTask> workFlowTaskList = new ArrayList<IWorkFlowTask>();
		Iterator iterator = resultMap.entrySet().iterator();
		while (iterator.hasNext()) {
	    	Map.Entry subscriberIdEntry = (Map.Entry) iterator.next();
			columnValues=messageService.getColumnValues(column,subscriberIdEntry);
			if(columnValues.get("MESSAGEID").get(0).equals(messageId) && !columnValues.get("TASKSTATUS").get(0).equals(WorkFlowContants.WorkFlowTaskStatus.COMPLETED) ){
			workFlowTaskList.add(createNewTask(userID,
					columnValues.get("MESSAGEID").get(0),
					columnValues.get("MESSAGETYPE").get(0),
					""/*getMessage(columnValues.get("MESSAGEID").get(0))*/,
					subscriberIdEntry.getKey().toString(),
					columnValues.get("TASKNAME").get(0)));
			}else if(columnValues.get("MESSAGEID").get(0).equals(messageId) && columnValues.get("TASKSTATUS").get(0).equals(WorkFlowContants.WorkFlowTaskStatus.COMPLETED)){
			//	workFlowTaskList.add(getTaskObject(null, msgService.getMessage(columnValues.get("MESSAGEID").get(0)), columnValues.get("MESSAGETYPE").get(0), null, null, null, null, columnValues.get("MESSAGEID").get(0)));
			}
			columnValues.clear();
			
		}
		return workFlowTaskList;
	}
  
	private List<IWorkFlowTask> createNextTask(
			Map<String, HashMap<String, String>> resultMap,
			List<String> column, String userID, String taskName,String message) throws Exception {
		String columnName = "";
		List<String> msgIdList;
		HashMap<String, String> columnValueMap = new HashMap<String, String>();
		HashMap<String, List<String>> columnValues = new HashMap<String, List<String>>();
		List<IWorkFlowTask> workFlowTaskList = new ArrayList<IWorkFlowTask>();
		Iterator iterator = resultMap.entrySet().iterator();
		while (iterator.hasNext()) {
			Map.Entry subscriberIdEntry = (Map.Entry) iterator.next();
			columnValues=messageService.getColumnValues(column,subscriberIdEntry);
			MessageVO messageVO=msgService.createMessageVO(message);
			/*messageVO.setMessage(message);
			messageVO.setId(columnValues.get("MESSAGEID").get(0));
			messageVO.setType(columnValues.get("MESSAGETYPE").get(0));*/
			msgService.saveMessage(messageVO);
			if(taskName.equals("Complete")){
			/*	messageService.updateStatus(columnValues.get("MESSAGEID").get(0), messageVO.getType() + "_ST", "MESSAGESTATUS",
						WorkFlowContants.MessageStatus.COMPLETED);*/
				msgService.updateMessageStatus(messageVO);
			}else{
			IWorkFlowTask workFlowTask=startNewTask(userID, messageVO,
						taskName);
			if(workFlowTask!=null){
			workFlowTaskList
					.add(workFlowTask);
			}
			}

			columnValues.clear();
		}
		return workFlowTaskList;
	}

	public boolean taskDone(String taskId, String outCome, String AssigneId,String message) throws Exception {
		messageService.updateStatus(taskId, "WORKFLOW_TASK", "TASKSTATUS",
				WorkFlowContants.WorkFlowTaskStatus.COMPLETED);
		Map<String, HashMap<String, String>> resultMap = messageService
				.retrieveStandardColumnFamily("WORKFLOW_TASK", taskId);
		List<String> columnList = new ArrayList<String>();
		columnList.add("MESSAGEID");
		columnList.add("MESSAGETYPE");
		columnList.add("TASKNAME");
		columnList.add("TASKSTATUS");
		createNextTask(resultMap, columnList, AssigneId, outCome,message);
		
		return true;
	}



/*	public String getMessageStatus(String messageId) {
		String messageType = messageService.getColumnValue("MESSAGE_ID_TYPE",
				messageId, "MESSAGETYPE");
		if (messageType != null && messageType.length() > 1) {
			return messageService.getColumnValue(messageType + "_ST", messageId, "MESSAGESTATUS");
		}
		return "";
	}*/

	private Map<String, HashMap<String, String>> getStandardColumns(
			String columnFamily, String rowKey) {
		Map<String, HashMap<String, String>> resultMap = new HashMap<String, HashMap<String, String>>();
		return messageService
				.retrieveStandardColumnFamily(columnFamily, rowKey);
	}

	
	public IWorkFlowTask getUserTask(String userId,String messageId) throws Exception{
		System.out.println("Creating work flow task.");
		HashMap<String, String> conditionMap=new HashMap<String, String>();
		conditionMap.put("USERID", userId);
		conditionMap.put("TASKSTATUS", WorkFlowContants.WorkFlowTaskStatus.STARTED);
		conditionMap.put("MESSAGEID", messageId);
		Map<String, HashMap<String, String>> resultMap = messageService
				.retrieveStandardColumnFamily("WORKFLOW_TASK",conditionMap);
		List<String> columnList = new ArrayList<String>();
		columnList.add("MESSAGEID");
		columnList.add("MESSAGETYPE");
		columnList.add("TASKNAME");
		columnList.add("TASKSTATUS");
		List<IWorkFlowTask> workFlowTasks= getWorkFlowTaskList(resultMap, columnList, userId,messageId);	
		for(IWorkFlowTask workFlowTask:workFlowTasks){
			if(workFlowTask.getUserProcessKey().equals(messageId))
			{
				workFlowTask = setAssignableUsers(workFlowTask);
				System.out.println("Work flow task created sucessfully");
				return workFlowTask;
			}
		}
		return null;
	}
	private IWorkFlowTask setAssignableUsers(IWorkFlowTask workFlowtask) {
		HashMap<String, String> assignablePeople = new HashMap<String, String>();
		if(workFlowtask.getParameterList()!=null){
		Set<String>	keySet = workFlowtask.getParameterList().keySet();
		for (String key : keySet) {
			if (key != null && key != "") {
				String value = workFlowtask.getParameterList().get(key);
				if (value != null && value != "") {
					List<ListItem> conditionMaps=new ArrayList<ListItem>();
					ListItem listItem=new ListItem();
					listItem.setKey(key);
					listItem.setValue(value);
					listItem.setLogicalOperator("AND");
					conditionMaps.add(listItem);
					SearchVO searchVo =new SearchVO();
					searchVo.setMessageType("PRPA_MT201000HT03");
					Object profileVos = searchService.search(searchVo);
					for (Object profile :(List<Object>)profileVos) {
						ProfileVO profilevO=(ProfileVO)profile;
						if (profilevO.getSubscriberId() != null
								&& profilevO.getName() != null) {
							assignablePeople.put(profilevO.getSubscriberId(),
									profilevO.getName());
						}
					}
				}

			}
		}
		}
		if (assignablePeople.isEmpty()) {
			UserVO user = (UserVO) RequestContextHolder.getRequestAttributes()
					.getAttribute(IAuthenticationService.LOGGED_IN_USER,
							RequestAttributes.SCOPE_SESSION);
			assignablePeople.put(user.getSubscriberId(), user.getUserName());
		}
		workFlowtask.setAssignablePeople(assignablePeople);
		return workFlowtask;
	}
	public IWorkFlowTask getWorkFlowTask(String TaskId){
		if(TaskId.length()<=1)
			return null;
		Map<String, HashMap<String, String>> resultMap = messageService
				.retrieveStandardColumnFamily("WORKFLOW_TASK", TaskId);
		if(resultMap==null)
			return null;
		else
			return new WorkFlowTask();
	}
	public String finishTask(MessageVO messageVO) throws Exception{
		if(messageVO.isDeleted()){
			msgService.removeMessage(messageVO);
			return "";
		}	
		String columnFamily = "WORKFLOW_TASK";
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("ROWKEY", messageVO.getTaskId());
		map.put("USERID", messageVO.getUserid());
		map.put("MESSAGEID", messageVO.getId());
		map.put("MESSAGETYPE", messageVO.getType());
		map.put("TASKNAME", messageVO.getOutCome());
		map.put("TASKSTATUS",WorkFlowContants.WorkFlowTaskStatus.COMPLETED);
		//messageService.saveStandardColumnFamily(map, columnFamily);
		System.out.println("Message type :"+messageVO.getType()+" Organization Id :"+messageVO.getOrganizationId());
		cassandraConnector.saveStandardColumnFamily(map, columnFamily, messageVO.getOrganizationId());
		msgService.saveMessage(messageVO);
		messageParticipantService.saveMessageParticipant(messageVO.getUserid(),messageVO.getId(),messageVO.getOrganizationId());
		messageParticipantService.saveMessageParticipant(messageVO.getAssigneId(),messageVO.getId(),messageVO.getOrganizationId());
		System.out.println("Task created sucessfully.");
		if(messageVO.getOutCome().equals("Complete")){
	/*	messageService.updateStatus(messageVO.getId() ,messageVO.getType() + "_ST", "MESSAGESTATUS",
					WorkFlowContants.MessageStatus.COMPLETED);*/
			msgService.updateMessageStatus(messageVO);
		}
		return messageVO.getMessage();
	}
	
}
