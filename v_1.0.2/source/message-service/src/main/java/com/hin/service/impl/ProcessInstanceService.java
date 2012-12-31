package com.hin.service.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hin.domain.ListItem;
import com.hin.domain.Message;
import com.hin.domain.MessageType;
import com.hin.domain.ProcessDefinition;
import com.hin.domain.ProcessInstance;
import com.hin.domain.ProcessList;
import com.hin.domain.ProcessSteps;
import com.hin.domain.Step;
import com.hin.domain.vo.SearchVO;
import com.hin.hl7messaging.api.IIndexService;
import com.hin.hl7messaging.api.IProcessSearchService;
import com.hin.service.IMessageParticipantService;
import com.hin.service.IProcessInstanceService;

@Service(value = "processInstanceService")
public class ProcessInstanceService extends BaseService<ProcessInstance>
		implements IProcessInstanceService {
	
	private Logger logger = Logger.getLogger(ProcessInstanceService.class.getName());

	@Autowired
	IMessageParticipantService messageParticipantService;

	@Autowired
	IIndexService indexService;

	@Autowired
	IProcessSearchService searchService;

	public ProcessInstance saveProcessInstance(
			ProcessDefinition processDefinitionObject) {
		ProcessInstance processInstance = null;
		try {
			if (processDefinitionObject.getId() != null
					&& processDefinitionObject.getId().length() > 1) {
				processInstance = this.findById(
						processDefinitionObject.getId(), ProcessInstance.class);
			}

			if (processInstance == null) {
				processInstance = createProcessInstance(processDefinitionObject);
				if (processDefinitionObject.getId() != null
						&& processDefinitionObject.getId().length() > 1) {
					processInstance.setId(processDefinitionObject.getId());
				}/*else{
					processInstance.setId(getNewKey());
				}*/
			} else {
				processInstance = updateProcessInstance(
						processDefinitionObject, processInstance);
				processInstance.setProcessDefinition(processDefinitionObject);
			}
			/*if(processInstance.getId()==null || processInstance.getId().length()<=1)
				processInstance.setId(getNewKey());*/
			save(processInstance);
			indexService.createIndex(processInstance);
			processInstance.getProcessDefinition().setId(
					processInstance.getId());
		} catch (Exception e) {
			e.printStackTrace();
		}
		return processInstance;
	}

	private ProcessInstance createProcessInstance(
			ProcessDefinition processDefinitionObject) {
		ProcessInstance processInstance = new ProcessInstance();
		processInstance
				.setProcessName(processDefinitionObject.getProcessName());
		processInstance.setProcessDefinition(processDefinitionObject);
		processInstance.setProcessDefinitionId(processDefinitionObject.getId());
		String newKey=getNewKey();
		Integer i=0;
		try {
			for (Step step : processDefinitionObject.getSteps()) {
				step.setId(newKey+(++i).toString());
				for (MessageType messageType : step.getMessageTypes()) {
					messageType.setId(newKey+(++i).toString());
					for (Message message : messageType.getMessages()) {
						/*ProcessSteps processStep = new ProcessSteps();
						processStep.setStep(step.stepName);
						processStep.setMessageId(message.getMessageId());*/
						if (message.getMessageId() != null
								&& message.getMessageId().length() > 0) {
							List<String> messageParticipantList = messageParticipantService
									.getMessageParticipants(message
											.getMessageId(),processDefinitionObject.getOrganizationId());
							for (String messageParticipant : messageParticipantList) {
								if (!processInstance.getParticipantList()
										.contains(messageParticipant)) {
									processInstance.getParticipantList().add(
											messageParticipant);
								}
							}
						}
					}
				}
			}
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return processInstance;
	}
	public String getNewKey() {
/*
		Date date = new Date();
		try {
			Thread.currentThread().sleep(1000);
		} catch (InterruptedException e) {
			logger.error("Failure in getting NewMessageKey: " + e.getMessage());
		}
		SimpleDateFormat smpd = new SimpleDateFormat("yyyyMMddHHmmss");
		
		return smpd.format(date);*/
		
		 return UUID.randomUUID().toString();
	}
	private ProcessInstance updateProcessInstance(
			ProcessDefinition processDefinitionObject,
			ProcessInstance processInstance) {
		processInstance.setProcessDefinition(processDefinitionObject);
		processInstance.setProcessDefinitionId(processDefinitionObject.getId());
		try {
			for (Step step : processDefinitionObject.getSteps()) {
				for (MessageType messageType : step.getMessageTypes()) {
					for (Message message : messageType.getMessages()) {
						ProcessSteps processStep = processInstance
								.getProcessStep(message.getMessageId());
						if (processStep.getStep() != null
								&& processStep.getStep().length() <= 0) {
							processStep.setStep(step.stepName);
						}
						if (message.getMessageId() != null
								&& message.getMessageId().length() > 0) {
							List<String> messageParticipantList = messageParticipantService
									.getMessageParticipants(message
											.getMessageId(),processDefinitionObject.getOrganizationId());
							for (String messageParticipant : messageParticipantList) {
								if (!processInstance.getParticipantList()
										.contains(messageParticipant)) {
									processInstance.getParticipantList().add(
											messageParticipant);
								}
							}
						}
					}
				}
			}
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return processInstance;
	}

	public ProcessInstance getProcessInstanceForUser(String userId,
			String processName) {
		for (ProcessInstance processInstance : this.findAllByProperty(
				"ProcessName", processName, ProcessInstance.class)) {
			if (processInstance.getParticipantList().contains(userId)) {
				return processInstance;
			}
		}
		return null;
	}

	public List<ProcessDefinition> getProcessProcessDefinitionsForUser(
			String userId) {
		List<ProcessDefinition> processDefinitions = new ArrayList<ProcessDefinition>();
		for (ProcessInstance processInstance : this
				.findAll(ProcessInstance.class)) {
			if (processInstance.getParticipantList().contains(userId)) {
				processDefinitions.add(processInstance.getProcessDefinition());
			}
		}
		return processDefinitions;
	}

	public List<ProcessDefinition> getProcessDefinitionsForUser(String userId) {
		List<ProcessDefinition> processDefinitions = new ArrayList<ProcessDefinition>();
		SearchVO searchVO = new SearchVO();
		
		searchVO.setIndexFolder("processInstance");
		List<ListItem> conditionMaps = new ArrayList<ListItem>();
		ListItem listItem = new ListItem();
		listItem.setKey("user");
		listItem.setValue(userId);
		listItem.setLogicalOperator("AND");
		conditionMaps.add(listItem);
		List<String> parameterList=new ArrayList<String>();
		parameterList.add("id");
		searchVO.setParameterList(parameterList);
		List<Object> processIdList = (List<Object>) searchService.search(searchVO);

		for (Object id : processIdList) {
			ProcessInstance processInstance = this.findById(id,
					ProcessInstance.class);
			if (processInstance != null
					&& processInstance.getProcessDefinition() != null) {
				processInstance.getProcessDefinition().setId(
						processInstance.getId());
				processDefinitions.add(processInstance.getProcessDefinition());
			}
		}
		return processDefinitions;
	}

	public void updateParticipant(String id, String userId) {
		ProcessInstance processInstance = this.findById(id,
				ProcessInstance.class);
		processInstance.getParticipantList().add(userId);
		indexService.deleteIndex(processInstance.getId(),
				processInstance.getIndexingDirectory());
		indexService.createIndex(processInstance);
	}

	public List<ProcessList> getProcessListForUser(String userId) {
		List<ProcessList> processList = new ArrayList<ProcessList>();
		
	SearchVO searchVO = new SearchVO();
		
		searchVO.setIndexFolder("processInstance");
		List<ListItem> conditionMaps = new ArrayList<ListItem>();
		ListItem listItem = new ListItem();
		listItem.setKey("user");
		listItem.setValue(userId);
		listItem.setLogicalOperator("AND");
		conditionMaps.add(listItem);
		searchVO.setMax(100);
		searchVO.setConditionMaps(conditionMaps);
		List<String> parameterList=new ArrayList<String>();
		parameterList.add("id");
		searchVO.setParameterList(parameterList);
		HashMap processIdList = (HashMap) (searchService.search(searchVO));
		
		
		
/*		HashMap processIdList = (HashMap) (searchService.search(
				"processInstance", "user", userId, new ProcessList(), 50)
				.get(0));
		*/
		
		Iterator iter = processIdList.entrySet().iterator();
		while (iter.hasNext()) {
			Map.Entry pairs = (Map.Entry) iter.next();
			String key = (String) pairs.getKey();
			processList.add((ProcessList) processIdList.get(key));
		}
		return processList;
	}
	
	
	public String getProcessListForUser(String userId,String processName) {
		
	SearchVO searchVO = new SearchVO();
		
		searchVO.setIndexFolder("processInstance");
		List<ListItem> conditionMaps = new ArrayList<ListItem>();
		ListItem listItem = new ListItem();
		listItem.setKey("user");
		listItem.setValue(userId);
		listItem.setLogicalOperator("AND");
		conditionMaps.add(listItem);
		ListItem listItem1 = new ListItem();
		listItem1.setKey("processName");
		listItem1.setValue(processName);
		listItem1.setLogicalOperator("AND");
		conditionMaps.add(listItem1);
		searchVO.setConditionMaps(conditionMaps);
		List<String> parameterList=new ArrayList<String>();
		parameterList.add("id");
		searchVO.setParameterList(parameterList);
		HashMap processIdList = (HashMap) (searchService.search(searchVO));	
		if(processIdList.entrySet()!=null){
			Iterator iter = processIdList.entrySet().iterator();
			while (iter.hasNext()) {
				Map.Entry pairs = (Map.Entry) iter.next();
				String key = (String) pairs.getKey();
				 return ((ProcessList) processIdList.get(key)).getProcessIdList().get(0);
			}
		}
		return null;
	}

	@Override
	public ProcessInstance findByProcessName(String processName) {
		List<ProcessInstance> processInstanceList = findAllByProperty(
				"processName", (Object) processName, ProcessInstance.class);
		ProcessInstance processInstance = null;
		for (ProcessInstance processInsta : processInstanceList) {
			if (processInsta.getVersion() == null) {
				processInsta.setVersion(0);
			}
			if (processInstance == null
					|| (processInstance != null && processInstance
							.getVersion() < processInsta.getVersion()))
				processInstance = processInsta;
		}
		return processInstance;
	}

}
