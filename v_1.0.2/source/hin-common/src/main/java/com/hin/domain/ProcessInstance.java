package com.hin.domain;

import java.util.ArrayList;
import java.util.List;

import com.hin.domain.core.BaseDomain;
import com.hin.domain.vo.IndexFieldsVO;

public class ProcessInstance extends BaseDomain implements IIndexable {
	
	private String processId;
	private String processDefinitionId;
	private String ProcessName;
	
	private ProcessDefinition processDefinition;
	
	private List<String> participantList = new ArrayList<String>();
	
    private List<ProcessSteps> processStepList=new ArrayList<ProcessSteps>();

	public String getProcessDefinitionId() {
		return processDefinitionId;
	}

	public void setProcessDefinitionId(String processDefinitionId) {
		this.processDefinitionId = processDefinitionId;
	}

	public String getProcessName() {
		return ProcessName;
	}

	public void setProcessName(String processName) {
		ProcessName = processName;
	}

	public List<String> getParticipantList() {
		return participantList;
	}

	public void setParticipantList(List<String> participantList) {
		this.participantList = participantList;
	}


	public String getProcessId() {
		return processId;
	}

	public void setProcessId(String processId) {
		this.processId = processId;
	}


	public ProcessDefinition getProcessDefinition() {
		return processDefinition;
	}

	public void setProcessDefinition(ProcessDefinition processDefinition) {
		this.processDefinition = processDefinition;
	}

	public List<ProcessSteps> getProcessStepList() {
		return processStepList;
	}

	public void setProcessStepList(List<ProcessSteps> processStepList) {
		this.processStepList = processStepList;
	}

	@Override
	public String getIndexingDirectory() {
		// TODO Auto-generated method stub
		return "processInstance";
	}

	@Override
	public List<IndexFieldsVO> getIndexFieldList() {
		// TODO Auto-generated method stub
		List<IndexFieldsVO> indexFieldsVOs=new ArrayList<IndexFieldsVO>();
		for(String participant:participantList){
			if (participant!=null){
			IndexFieldsVO indexFiledVo=new IndexFieldsVO("user", "true", "", participant,"false");
			indexFieldsVOs.add(indexFiledVo);
			}
		}
		if(getId()!=null){
		IndexFieldsVO indexFiledDefId=new IndexFieldsVO("id", "true", "", getId(),"false");
		indexFieldsVOs.add(indexFiledDefId);
		}
		if(getProcessName()!=null){
		IndexFieldsVO indexFiledDefName=new IndexFieldsVO("processName", "true", "", getProcessName(),"false");
		indexFieldsVOs.add(indexFiledDefName);
		}
		return indexFieldsVOs;
	}
	public ProcessSteps getProcessStep(String messageId){
		for(ProcessSteps processStep:processStepList){
			if(processStep.getMessageId().equals(messageId)){
				return processStep;
			}
		}
		ProcessSteps processStep=new ProcessSteps();
		processStep.setMessageId(messageId);
		return processStep;
	}
}
