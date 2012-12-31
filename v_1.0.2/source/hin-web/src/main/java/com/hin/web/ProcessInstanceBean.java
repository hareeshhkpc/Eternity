/**
 * 
 */
package com.hin.web;

import java.util.ArrayList;
import java.util.List;

import javax.faces.model.SelectItem;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.data.annotation.Transient;
import org.springframework.stereotype.Component;

import com.hin.domain.ConceptClass;
import com.hin.domain.MessageType;
import com.hin.domain.ProcessDefinition;
import com.hin.domain.ProcessInstance;
import com.hin.domain.Step;
import com.hin.service.IConceptClassService;
import com.hin.service.IProcessInstanceService;
import com.hin.web.base.BaseBean;

/**
 * @author ranga.reddy
 * 
 */
@Component(value = "processInstanceBean")
@Scope(value = "session")
public class ProcessInstanceBean extends BaseBean {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Transient
	@Autowired
	private IProcessInstanceService processInstanceService;

	@Transient
	@Autowired
	private IConceptClassService conceptClassService;

	private ProcessInstance processInstance = new ProcessInstance();
	private ProcessDefinition processDefinition = new ProcessDefinition();

	private List<ProcessInstance> processInstances = new ArrayList<ProcessInstance>();

	private List<SelectItem> conceptClassList = new ArrayList<SelectItem>();
	private List<SelectItem> stepList = new ArrayList<SelectItem>();

	private String processInstanceId;
	private String processSearchId;
	private String processName;
	private Step step = new Step();
	private MessageType messageType = new MessageType();

	private String stepName;
	private String msgTypeId;
	private String selectedProcess = "";

	private String conceptClassId;

	private boolean newProcess = true;
	private boolean showStepView = false;
	private boolean showMsgType = false;
	private boolean newStep = true;
	private boolean newMessage = true;
	private boolean disableProcess = false;

	public String saveProcess() {

		if (processInstanceService.findByProcessName(processInstance
				.getProcessName()) == null || processInstance.getId() != null) {
			try {

				String processInitializeScript = processDefinition
						.getInitializeScript();
				if (processInitializeScript != null) {
					processInitializeScript = processInitializeScript.replace(
							'\t', ' ');
					processInitializeScript = processInitializeScript.replace(
							'\n', ' ');
					processDefinition
							.setInitializeScript(processInitializeScript);
				}

				for (Step step : processDefinition.getSteps()) {
					String stepInitializeScript = step.getInitializeScript();
					if (stepInitializeScript != null) {
						stepInitializeScript = stepInitializeScript.replace(
								'\t', ' ');
						stepInitializeScript = stepInitializeScript.replace(
								'\n', ' ');
						step.setInitializeScript(stepInitializeScript);
					}
				}
				processInstanceService.save(processInstance);
			} catch (Exception e) {
				e.printStackTrace();
			}
			return "processinstancelist";
		} else {
			return "";
		}

	}

	public void removeProcessInstance() {
		try {
			processInstance = processInstanceService.findById(
					processInstanceId, ProcessInstance.class);
			processInstanceService.delete(processInstance);
			processInstanceList();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public ProcessDefinition getProcessDefinition() {
		return processDefinition;
	}

	public void setProcessDefinition(ProcessDefinition processDefinition) {
		this.processDefinition = processDefinition;
	}

	public Step getStep() {
		return step;
	}

	public void setStep(Step step) {
		this.step = step;
	}

	public void addToStepList() {
		if (step.getId() != null && step.getId().length() > 0) {

		} else {
			int id = processDefinition.getSteps().size() + 1;
			step.setId(processDefinition.getId() + "_" + step.getStepName()
					+ "_" + +id);
			processDefinition.addStep(step);
		}
		showStepView = false;
	}

	public void newStep() {
		newProcess = false;
		newStep = true;
		showStepView = true;
		step = new Step();
	}

	public MessageType getMessageType() {
		return messageType;
	}

	public void setMessageType(MessageType messageType) {
		this.messageType = messageType;
	}

	/**
	 * @return the processName
	 */
	public String getProcessName() {
		return processName;
	}

	/**
	 * @param processName
	 *            the processName to set
	 */
	public void setProcessName(String processName) {
		this.processName = processName;
	}

	public void removeStep() {
		showStepView = false;
		if (stepName != null) {
			processDefinition.removeStep(stepName);
		}
	}

	public String addProcessDefinition() {
		disableProcess = false;
		newProcess = true;
		showStepView = false;
		processDefinition = new ProcessDefinition();
		step = new Step();
		return "addprocessdefinition";
	}

	public String viewprocessdefinitionInstance() {
		// processDefinition = new ProcessDefinition();
		disableProcess = true;
		newProcess = false;
		showStepView = false;
		processInstance = processInstanceService.findById(processInstanceId,
				ProcessInstance.class);
		processDefinition = processInstance.getProcessDefinition();
		return "viewprocessdefinitionInstance";
	}

	public String viewStep() {
		newStep = false;
		newMessage = false;
		showStepView = true;
		showMsgType = false;
		step = processDefinition.getStepByStepId(stepName);
		return "viewprocessdefinitionInstance";
	}

	/**
	 * @return the newProcess
	 */
	public boolean isNewProcess() {
		return newProcess;
	}

	/**
	 * @param newProcess
	 *            the newProcess to set
	 */
	public void setNewProcess(boolean newProcess) {
		this.newProcess = newProcess;
	}

	/**
	 * @return the showStepView
	 */
	public boolean isShowStepView() {
		return showStepView;
	}

	/**
	 * @param showStepView
	 *            the showStepView to set
	 */
	public void setShowStepView(boolean showStepView) {
		this.showStepView = showStepView;
	}

	public void newMsgType() {
		conceptClassList.clear();
		showMsgType = true;
		newMessage = true;
		messageType = new MessageType();
	}

	/**
	 * @return the showMsgType
	 */
	public boolean isShowMsgType() {
		return showMsgType;
	}

	/**
	 * @param showMsgType
	 *            the showMsgType to set
	 */
	public void setShowMsgType(boolean showMsgType) {
		this.showMsgType = showMsgType;
	}

	public void addToMsgTypeList() {
		if (conceptClassId.equals("Select")) {
			messageType.setCategory("");
		} else {
			messageType.setCategory(conceptClassService.findById(
					conceptClassId, ConceptClass.class).getName());
		}
		if (messageType.getId() != null && messageType.getId().length() > 0) {

		} else {
			int id = step.getMessageTypes().size() + 1;
			messageType.setId(step.getId() + "_" + messageType.getType() + "_"
					+ +id);
			step.addMsgType(messageType);
		}
		showMsgType = false;
	}

	public void removeMsgType() {
		showMsgType = false;
		if (msgTypeId != null) {
			step.removeMsgType(msgTypeId);
		}
	}

	public String viewMsgType() {
		showMsgType = true;
		messageType = step.getMessageTypeById(msgTypeId);
		return "viewprocessdefinitionInstance";
	}

	/**
	 * @return the selectedProcess
	 */
	public String getSelectedProcess() {
		return selectedProcess;
	}

	/**
	 * @param selectedProcess
	 *            the selectedProcess to set
	 */
	public void setSelectedProcess(String selectedProcess) {
		this.selectedProcess = selectedProcess;
	}

	/**
	 * @return the newStep
	 */
	public boolean isNewStep() {
		return newStep;
	}

	/**
	 * @param newStep
	 *            the newStep to set
	 */
	public void setNewStep(boolean newStep) {
		this.newStep = newStep;
	}

	/**
	 * @return the disableProcess
	 */
	public boolean isDisableProcess() {
		return disableProcess;
	}

	/**
	 * @param disableProcess
	 *            the disableProcess to set
	 */
	public void setDisableProcess(boolean disableProcess) {
		this.disableProcess = disableProcess;
	}

	/**
	 * @return the conceptClassService
	 */
	public IConceptClassService getConceptClassService() {
		return conceptClassService;
	}

	/**
	 * @param conceptClassService
	 *            the conceptClassService to set
	 */
	public void setConceptClassService(IConceptClassService conceptClassService) {
		this.conceptClassService = conceptClassService;
	}

	/**
	 * @return the conceptClassList
	 */
	public List<SelectItem> getConceptClassList() {
		try {
			conceptClassList.clear();
			List<ConceptClass> list = conceptClassService.findAllConceptClass();
			conceptClassList.add(new SelectItem("Select", "Select"));
			for (ConceptClass conceptClass : list) {
				SelectItem selectItem = new SelectItem();
				selectItem.setLabel(conceptClass.getName());
				selectItem.setValue(conceptClass.getId());
				conceptClassList.add(selectItem);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return conceptClassList;
	}

	/**
	 * @param conceptClassList
	 *            the conceptClassList to set
	 */
	public void setConceptClassList(List<SelectItem> conceptClassList) {
		this.conceptClassList = conceptClassList;
	}

	/**
	 * @return the conceptClassId
	 */
	public String getConceptClassId() {
		return conceptClassId;
	}

	/**
	 * @param conceptClassId
	 *            the conceptClassId to set
	 */
	public void setConceptClassId(String conceptClassId) {
		this.conceptClassId = conceptClassId;
	}

	/**
	 * @return the stepList
	 */
	public List<SelectItem> getStepList() {
		try {
			stepList.clear();
			processDefinition = processInstance.getProcessDefinition();
			List<Step> steps = processDefinition.getSteps();
			for (Step step : steps) {
				SelectItem selectItem = new SelectItem(step.getStepName(),
						step.getStepName());
				stepList.add(selectItem);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return stepList;
	}

	/**
	 * @param stepList
	 *            the stepList to set
	 */
	public void setStepList(List<SelectItem> stepList) {
		this.stepList = stepList;
	}

	/**
	 * @return the processInstance
	 */
	public ProcessInstance getProcessInstance() {
		return processInstance;
	}

	/**
	 * @param processInstance
	 *            the processInstance to set
	 */
	public void setProcessInstance(ProcessInstance processInstance) {
		this.processInstance = processInstance;
	}

	/**
	 * @return the processInstances
	 */
	public List<ProcessInstance> getProcessInstances() {
		if (selectedProcess == null) {
			processInstances = new ArrayList<ProcessInstance>();
		} else if (processInstances.isEmpty()) {
			processInstanceSearch();
		}
		return processInstances;
	}

	/**
	 * @param processInstances
	 *            the processInstances to set
	 */
	public void setProcessInstances(List<ProcessInstance> processInstances) {
		this.processInstances = processInstances;
	}

	public void processInstanceSearch() {
		processInstances.clear();
		if (processSearchId != null && processSearchId.length() != 0) {
			processInstances.add(processInstanceService.findById(
					processSearchId, ProcessInstance.class));
			if (processSearchId != processInstanceId) {
				System.out.println("No record found");
			}
		} else {
			processInstances.addAll(processInstanceService
					.findAll(ProcessInstance.class));
		}

	}

	/**
	 * @return the processInstanceService
	 */
	public IProcessInstanceService getProcessInstanceService() {
		return processInstanceService;
	}

	/**
	 * @param processInstanceService
	 *            the processInstanceService to set
	 */
	public void setProcessInstanceService(
			IProcessInstanceService processInstanceService) {
		this.processInstanceService = processInstanceService;
	}

	/**
	 * @return the processInstanceId
	 */
	public String getProcessInstanceId() {
		return processInstanceId;
	}

	/**
	 * @param processInstanceId
	 *            the processInstanceId to set
	 */
	public void setProcessInstanceId(String processInstanceId) {
		this.processInstanceId = processInstanceId;
	}

	/**
	 * @return the newMessage
	 */
	public boolean isNewMessage() {
		return newMessage;
	}

	/**
	 * @param newMessage
	 *            the newMessage to set
	 */
	public void setNewMessage(boolean newMessage) {
		this.newMessage = newMessage;
	}

	public void processInstanceList() {
		processInstances.clear();
		processInstances.addAll(processInstanceService
				.findAll(ProcessInstance.class));
	}

	/**
	 * @return the processSearchId
	 */
	public String getProcessSearchId() {
		return processSearchId;
	}

	/**
	 * @param processSearchId
	 *            the processSearchId to set
	 */
	public void setProcessSearchId(String processSearchId) {
		this.processSearchId = processSearchId;
	}

	/**
	 * @return the msgTypeId
	 */
	public String getMsgTypeId() {
		return msgTypeId;
	}

	/**
	 * @param msgTypeId
	 *            the msgTypeId to set
	 */
	public void setMsgTypeId(String msgTypeId) {
		this.msgTypeId = msgTypeId;
	}

	/**
	 * @return the stepName
	 */
	public String getStepName() {
		return stepName;
	}

	/**
	 * @param stepName the stepName to set
	 */
	public void setStepName(String stepName) {
		this.stepName = stepName;
	}
}
