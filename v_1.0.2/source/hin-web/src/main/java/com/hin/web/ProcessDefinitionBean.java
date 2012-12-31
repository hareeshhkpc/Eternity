/**
 * 
 */
package com.hin.web;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

import javax.faces.model.SelectItem;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.data.annotation.Transient;
import org.springframework.stereotype.Component;

import com.hin.domain.ConceptClass;
import com.hin.domain.MessageType;
import com.hin.domain.ProcessDefinition;
import com.hin.domain.Step;
import com.hin.service.IConceptClassService;
import com.hin.service.IProcessDefService;
import com.hin.web.base.BaseBean;

/**
 * @author ranga.reddy
 * 
 */
@Component(value = "processDefBean")
@Scope(value = "session")
public class ProcessDefinitionBean extends BaseBean {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Transient
	@Autowired
	private IProcessDefService processDefinitionService;

	@Transient
	@Autowired
	private IConceptClassService conceptClassService;

	private ProcessDefinition processDefinition = new ProcessDefinition();
	private List<ProcessDefinition> process = new ArrayList<ProcessDefinition>();

	private List<SelectItem> conceptClassList = new ArrayList<SelectItem>();
	private List<SelectItem> stepList = new ArrayList<SelectItem>();
	private String processDefinitionId;
	private String stepName;
	private String messagetypeId;
	private String processName;
	private Step step = new Step();
	private MessageType messageType = new MessageType();

	private String selectedProcess = "";

	private String conceptClassId;

	private boolean newProcess = true;
	private boolean showStepView = false;
	private boolean showMsgType = false;
	private boolean newStep = true;
	private boolean disableProcess = false;

	public String saveProcess() {

		try {

			String processInitializeScript = processDefinition
					.getInitializeScript();
			if (processInitializeScript != null) {
				processInitializeScript = processInitializeScript.replace('\t',
						' ');
				processInitializeScript = processInitializeScript.replace('\n',
						' ');
				processDefinition.setInitializeScript(processInitializeScript);
			}

			for (Step step : processDefinition.getSteps()) {
				String stepInitializeScript = step.getInitializeScript();
				if (stepInitializeScript != null) {
					stepInitializeScript = stepInitializeScript.replace('\t',
							' ');
					stepInitializeScript = stepInitializeScript.replace('\n',
							' ');
					step.setInitializeScript(stepInitializeScript);
				}
			}
			processDefinition.setProcessName(processDefinition.getProcessName()
					.toString().trim());
			
			if (step.stepName != null) {
				step.setStepName(step.getStepName().toString().trim());
				step.setGroupName(step.getGroupName().toString().trim());
				step.setShortDescription(step.getShortDescription().toString()
						.trim());
				step.setLongDescription(step.getLongDescription().toString()
						.trim());
				step.setFormHtml(step.getFormHtml().toString().trim());
				step.setInitializeScript(step.getInitializeScript().toString()
						.trim());
				step.setOrder(step.getOrder().toString().trim());
			}
			if (messageType.type != null) {
				messageType.setState(messageType.getState().toString().trim());
				messageType.setType(messageType.getType().toString().trim());
				messageType.setTypeName(messageType.getTypeName().toString()
						.trim());
				messageType.setFormHtml(messageType.getFormHtml().toString()
						.trim());
				messageType.setTitle(messageType.getTitle().toString().trim());
				messageType.setQueryString(messageType.getQueryString()
						.toString().trim());
				messageType.setMsgTypeOrder(messageType.getMsgTypeOrder()
						.toString().trim());
				messageType.setTransactionType(messageType.getTransactionType()
						.toString().trim());
			}
			processDefinitionService.save(processDefinition);
			processDefList();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "processdefinitionlist";
	}

	public void removeProcessDefinition() {
		ProcessDefinition processDef = processDefinitionService
				.findByProcessName(processName);
		processDefinitionService.deleteProcessDefinition(processDef);
		processDefList();
	}

	public ProcessDefinition getProcessDefinition() {
		return processDefinition;
	}

	public void setProcessDefinition(ProcessDefinition processDefinition) {
		this.processDefinition = processDefinition;
	}

	public List<ProcessDefinition> getProcess() {
		if (selectedProcess == null) {
			process = new ArrayList<ProcessDefinition>();
		} else if (process.isEmpty()) {
			processDefList();
		}
		return process;
	}

	public void setProcess(List<ProcessDefinition> process) {
		this.process = process;
	}

	private void processDefList() {
		process.clear();
		process = processDefinitionService.getAllProcess();
	}

	public Step getStep() {
		return step;
	}

	public void setStep(Step step) {
		this.step = step;
	}

	public void addToStepList() {
		if (step.getId() == null) {
			addToProcessDefinition(step, processDefinition);
			processDefinition.addStep(step);
		}
		showStepView = false;
	}
	

	public static void addToProcessDefinition(Step step,
			ProcessDefinition processDefinition) {
		if (step.getId() != null && step.getId().length() > 0) {

		} else {
			int id = processDefinition.getSteps().size() + 1;
			step.setId(processDefinition.getProcessName() + "_"
					+ step.getStepName() + "_" + +id);
		}
	}

	public void newStep() {
		newProcess = false;
		newStep = true;
		showStepView = true;
		step = new Step();
		//addToProcessDefinition(step, processDefinition);
	}

	public IProcessDefService getProcessDefinitionService() {
		return processDefinitionService;
	}

	public void setProcessDefinitionService(
			IProcessDefService processDefinitionService) {
		this.processDefinitionService = processDefinitionService;
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
		String id = generateNewID();
		processDefinition.setProcessDefinitionId(id);
		return "addprocessdefinition";
	}

	/**
	 * @return the processDefinitionId
	 */
	public String getProcessDefinitionId() {
		return processDefinitionId;
	}

	/**
	 * @param processDefinitionId
	 *            the processDefinitionId to set
	 */
	public void setProcessDefinitionId(String processDefinitionId) {
		this.processDefinitionId = processDefinitionId;
	}

	public String viewProcessDefinition() {
		disableProcess = true;
		newProcess = false;
		showStepView = false;
		processDefinition = processDefinitionService.findByProcessName(processName);
		return "viewprocessdefinition";
	}

	public String viewStep() {
		newStep = false;
		showStepView = true;
		showMsgType = false;
		step = processDefinition.getStepByStepId(stepName);
		return "viewprocessdefinition";
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
		if (messageType.getId() == null || messageType.getId().length() <= 0) {
			addToProcessStep(conceptClassId, messageType, step, conceptClassService);
			step.addMsgType(messageType);
		}
		showMsgType = false;
	}

	public static void addToProcessStep(String conceptClassId,
			MessageType messageType, Step step,
			IConceptClassService conceptClassService) {
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
			// step.addMsgType(messageType);
		}
	}

	public void removeMsgType() {
		showMsgType = false;
		if (messagetypeId != null) {
			step.removeMsgType(messagetypeId);
		}
	}

	public String viewMsgType() {
		showMsgType = true;
		messageType = step.getMessageTypeById(messagetypeId);
		return "viewprocessdefinition";
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

	public void selectedProcess() {
		if (!selectedProcess.isEmpty()) {
			processDefinition = processDefinitionService
					.findByProcessName(selectedProcess);
			process.clear();
			process.add(processDefinition);
		} else {
			process = processDefinitionService.getAllProcess();
		}
	}

	public List<ProcessDefinition> processList(String searchKey) {
		List<ProcessDefinition> list = new ArrayList<ProcessDefinition>();
		list.add(processDefinitionService.findByProcessName(searchKey));
		return list;
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

			for (ConceptClass conceptClass : list) {
				SelectItem selectItem = new SelectItem();
				selectItem.setLabel(conceptClass.getName());
				selectItem.setValue(conceptClass.getId());
				conceptClassList.add(selectItem);
				Collections.sort(conceptClassList, comparator);
			}
			conceptClassList.add(0, new SelectItem("Select", "Select"));
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
			ProcessDefinition process = processDefinitionService
					.findByProcessName(processDefinition.getProcessName());
			List<Step> steps = process.getSteps();
			for (Step step : steps) {
				SelectItem selectItem = new SelectItem(step.getStepName(),
						step.getStepName());
				stepList.add(selectItem);
				Collections.sort(stepList, comparator);
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
	 * @return the messagetypeId
	 */
	public String getMessagetypeId() {
		return messagetypeId;
	}

	/**
	 * @param messagetypeId
	 *            the messagetypeId to set
	 */
	public void setMessagetypeId(String messagetypeId) {
		this.messagetypeId = messagetypeId;
	}

	/**
	 * @return the stepName
	 */
	public String getStepName() {
		return stepName;
	}

	/**
	 * @param stepName
	 *            the stepName to set
	 */
	public void setStepName(String stepName) {
		this.stepName = stepName;
	}

	public String generateNewID() {
		return UUID.randomUUID().toString();
	}

	Comparator<SelectItem> comparator = new Comparator<SelectItem>() {
		@Override
		public int compare(SelectItem s1, SelectItem s2) {
			return s1.getLabel().compareToIgnoreCase(s2.getLabel());
		}
	};

}
