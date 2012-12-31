package com.hin.web;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.ExclusionStrategy;
import com.google.gson.FieldAttributes;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.hin.domain.Concept;
import com.hin.domain.Message;
import com.hin.domain.MessageType;
import com.hin.domain.ProcessDefinition;
import com.hin.domain.ProcessInstance;
import com.hin.domain.ProcessList;
import com.hin.domain.Step;
import com.hin.hl7messaging.api.IMessageService;
import com.hin.messaging.IWorkFlowProvider;
import com.hin.service.IConceptClassService;
import com.hin.service.IConceptService;
import com.hin.service.IMessageParticipantService;
import com.hin.service.IProcessDefService;
import com.hin.service.IProcessDefinitionService;
import com.hin.service.IProcessInstanceService;

@Controller
public class ProcessController {

	private Logger logger = Logger.getLogger(ProcessController.class.getName());

	@Autowired
	private IProcessDefService processDefinitionService;
	//private IProcessDefinitionService processDefinitionService;

	@Autowired
	private IProcessInstanceService processInstanceService;

	@Autowired
	IMessageParticipantService messageParticipantService;

	/*
	 * @Autowired IProcessClassService processClassService;
	 */
	@Autowired
	IWorkFlowProvider workFlowProvider;
	
	@Autowired
	IMessageService messageService;

	/*
	 * @Autowired private IConceptClassService conceptClassService;
	 */
	@Autowired
	private IConceptService conceptService;

	@RequestMapping(value = "/process", method = RequestMethod.GET)
	public @ResponseBody
	String getProcessDefinition(@RequestParam String processName) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		ProcessDefinition processDefinition = null;
		try {
			processDefinition = processDefinitionService
					.findByProcessName(processName);

		} catch (Exception e) {
			e.printStackTrace();
		}
		if (processDefinition != null) {
			data = gson.toJson(processDefinition);
		}
		return data;
	}

	@RequestMapping(value = "/processDefinitions", method = RequestMethod.GET)
	public @ResponseBody
	String getProcessDefinitions() {
		String data = "";
		Gson gson = new GsonBuilder().create();
		List<ProcessDefinition> processDefinitions = null;
		try {
			/*processDefinitions = processDefinitionService
					.findAll(ProcessDefinition.class);*/
			processDefinitions = processDefinitionService.getAllProcess();

		} catch (Exception e) {
			e.printStackTrace();
		}
		if (processDefinitions != null) {
			data = gson.toJson(processDefinitions);
		}
		return data;
	}

	@RequestMapping(value = "/processDefByVersion", method = RequestMethod.GET)
	public @ResponseBody
	String getProcessDefinition(@RequestParam String processName,
			@RequestParam int version) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		ProcessDefinition processDefinition = null;
		try {
			processDefinition = processDefinitionService.findByProcessName(
					processName, version);
		} catch (Exception e) {
			e.printStackTrace();
		}
		if (processDefinition != null) {
			data = gson.toJson(processDefinition);
		}
		return data;
	}

	/*
	 * @RequestMapping(value = "/saveProcessClass", method = RequestMethod.POST)
	 * public @ResponseBody String saveProcessClass(@RequestParam String
	 * processClassJsonString) { String data = ""; Gson gson = new
	 * GsonBuilder().create(); ProcessClass processClass = null; try {
	 * processClass = gson.fromJson(processClassJsonString, ProcessClass.class);
	 * processClass = processClassService.save(processClass); } catch (Exception
	 * e) { e.printStackTrace(); } if (processClass != null) { data =
	 * gson.toJson(processClass); } return data; }
	 */

	@RequestMapping(value = "/getprocessInstance", method = RequestMethod.GET)
	public @ResponseBody
	String getProcessInstance(@RequestParam String processId) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		ProcessInstance processInstance = null;

		try {
			processInstance = processInstanceService.findById(processId,
					ProcessInstance.class);
		} catch (Exception e) {
			e.printStackTrace();
		}
		if (processInstance != null) {
			if (processInstance.getProcessDefinition() != null)
				data = gson.toJson(processInstance.getProcessDefinition());
		}
		return data;
	}

	@RequestMapping(value = "/saveProcessInstance", method = RequestMethod.POST)
	public @ResponseBody
	String saveProcessInstance(@RequestParam String processInstanceJsonString) {
		String data = "";
		/* Gson gson = new GsonBuilder().create(); */
		Gson gson = new GsonBuilder().setExclusionStrategies(
				new CustomExclusionStrategy())
		// .serializeNulls() <-- uncomment to serialize NULL fields as well
				.create();
		ProcessInstance processInstance = null;
		ProcessDefinition processDefinitionObject = null;
		try {
			processDefinitionObject = gson.fromJson(processInstanceJsonString,
					ProcessDefinition.class);
			processInstance = processInstanceService
					.saveProcessInstance(processDefinitionObject);
			System.out.println("Process Instance saved sucessfully");
		} catch (Exception e) {
			e.printStackTrace();
		}
		if (processInstance != null) {
			if (processInstance.getProcessDefinition() != null) {
				updateMessageStatus(processInstance.getProcessDefinition());
				data = gson.toJson(processInstance.getProcessDefinition());
			}
		}
		return data;
	}

	@RequestMapping(value = "/getProcessInstanceForUserAndProcess", method = RequestMethod.GET)
	public @ResponseBody
	String getProcessInstanceForUser(@RequestParam String userId,
			@RequestParam String processName) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		ProcessInstance processInstance = null;
		try {
			processInstance = processInstanceService.getProcessInstanceForUser(
					userId, processName);
		} catch (Exception e) {
			e.printStackTrace();
		}
		if (processInstance != null) {
			data = gson.toJson(processInstance);
		}
		return data;
	}

	@RequestMapping(value = "/getProcessInstancesForUser", method = RequestMethod.GET)
	public @ResponseBody
	String getProcessInstanceForUser(@RequestParam String userId) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		List<ProcessDefinition> processDefinition = null;
		try {
			processDefinition = processInstanceService
					.getProcessDefinitionsForUser(userId);

		} catch (Exception e) {
			e.printStackTrace();
		}
		if (processDefinition != null) {
			data = gson.toJson(processDefinition);
		}
		return data;
	}

	@RequestMapping(value = "/saveProcessParticipant", method = RequestMethod.POST)
	public @ResponseBody
	String saveProcessParticipant(@RequestParam String userId,
			@RequestParam String processId) {
		String data = "";
		try {
			processInstanceService.updateParticipant(processId, userId);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return data;
	}

	@RequestMapping(value = "/getprocessDefinitionForProcessId", method = RequestMethod.GET)
	public @ResponseBody
	String getProcessDefinitionForProcessId(@RequestParam String processId) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		ProcessDefinition processDefinition = null;
		try {
			processDefinition = fetchProcessDefinition(processId);
		} catch (Exception e) {
			e.printStackTrace();
		}
		if (processDefinition != null) {
			data = gson.toJson(processDefinition);
		}
		return data;
	}

	@RequestMapping(value = "/getProcessListForUser", method = RequestMethod.GET)
	public @ResponseBody
	String getProcessListForUser(@RequestParam String userId) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		List<ProcessList> processList = null;
		try {
			processList = processInstanceService.getProcessListForUser(userId);

		} catch (Exception e) {
			e.printStackTrace();
		}
		if (processList != null) {
			data = gson.toJson(processList);
		}
		return data;
	}

	private ProcessDefinition fetchProcessDefinition(String processId) {
		ProcessInstance processInstance = processInstanceService.findById(
				processId, ProcessInstance.class);
		ProcessDefinition processDefinition = processInstance
				.getProcessDefinition();
		processDefinition.setId(processInstance.getId());
		updateMessageStatus(processDefinition);
		return processDefinition;
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

	@RequestMapping(value = "/program", method = RequestMethod.GET)
	public @ResponseBody
	String getPrograms() {
		String data = "";
		Gson gson = new GsonBuilder().create();
		// ConceptClass conceptclass = null;
		List<Concept> concept = null;

		try {

			/*
			 * conceptclass = conceptClassService.findByProperty("name",
			 * "eternity_programs", ConceptClass.class);
			 */
			concept = conceptService.findAllByProperty("conceptClasses.name",
					"eternity_programs", Concept.class);

		} catch (Exception e) {
			e.printStackTrace();
		}
		if (concept != null) {
			data = gson.toJson(concept);
		}
		return data;
	}

	class CustomExclusionStrategy implements ExclusionStrategy {

		public boolean shouldSkipClass(Class<?> arg0) {
			return false;
		}

		public boolean shouldSkipField(FieldAttributes f) {
			return (f.getName().equals("message"));
		}

	}
}
