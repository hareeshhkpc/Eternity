/**
 * 
 */
package com.hin.hl7messaging.config;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import org.junit.Test;

import com.google.gson.Gson;
import com.hin.domain.Message;
import com.hin.domain.MessageType;
import com.hin.domain.ProcessDefinition;
import com.hin.domain.ProcessInstance;
import com.hin.domain.ProcessSteps;
import com.hin.domain.Step;

import junit.framework.TestCase;

/**
 * @author salam.halley
 * 
 */
public class ProcessJSOnTest {

	@Test
	public void testCreaterRegistrationProcessJSON() throws IOException {
		ProcessDefinition processdefinition = new ProcessDefinition("");

		processdefinition.setProcessName("PatientRegistration");
		processdefinition.setId("id");

		Step stepA = createStep("1", "Registration",
				"Record Basic Information", "Registration");
		
		MessageType msgTypeA1 = createMessageType("PRPA_1000", "Pending");
		
		MessageType msgTypeA2 = createMessageType("PRPA_1001", "Pending");
		
		Message message = createMessage("", "<PRPA></PRPA>", "Pending",
				"REGISTRATION_FORM");
		
		msgTypeA1.getMessages().add(message);
		
		stepA.getMessageTypes().add(msgTypeA1);
		stepA.getMessageTypes().add(msgTypeA2);
		
		processdefinition.getSteps().add(stepA);

		Step stepB = createStep("2", "Appointment", "Appointment Scheduling",
				"Appointment");
		MessageType msgTypeB1 = createMessageType("PRPA_1000", "Pending");
		MessageType msgTypeB2 = createMessageType("PRPA_1002", "Pending");
		stepB.getMessageTypes().add(msgTypeB1);
		stepB.getMessageTypes().add(msgTypeB2);
		
		processdefinition.getSteps().add(stepB);

		Step stepC = createStep("3", "Consent",
				"Welcome and Booking Confirmation", "Consent");
		
		MessageType msgTypeC1 = createMessageType("PRPA_1002", "Pending");
		MessageType msgTypeC2 = createMessageType("PRPA_1001", "Pending");
		
		stepC.getMessageTypes().add(msgTypeC1);
		stepC.getMessageTypes().add(msgTypeC2);
		
		processdefinition.getSteps().add(stepC);

		Gson g = new Gson();
		String processJson = g.toJson(processdefinition);
		System.out.println(processJson);
		
		File file=new File("E:\\HINWork\\source\\hin-web\\src\\main\\webapp\\WEB-INF\\processDefinition\\" +processdefinition.getProcessName());
		BufferedWriter output = new BufferedWriter(new FileWriter(file));
		output.write(processJson);
		output.close();
		 
	}

	private Step createStep(String stepname, String ShortDescription,
			String LongDescription, String GroupName) {
		Step step = new Step();
		step.setStepName(stepname);
		step.setShortDescription(ShortDescription);
		step.setLongDescription(LongDescription);
		step.setGroupName(GroupName);
		return step;
	}

	private MessageType createMessageType(String messageTypeValue,
			String messageState) {
		MessageType messageType = new MessageType();
		messageType.setType(messageTypeValue);
		messageType.setState(messageState);
		return messageType;
	}
	
	private Message createMessage(String messageId, String message,
			String messageStatus, String messageForm) {
		Message messageObj = new Message();
		messageObj.setMessageId(messageId);
		messageObj.setMessage(message);
		messageObj.setMessageStatus(messageStatus);
		messageObj.setMessageForm(messageForm);
		return messageObj;
	}

/*	@Test
	public void testCreateProcessInstanceJSON() throws IOException {

		ProcessInstance processInstance = new ProcessInstance();
		processInstance.setProcessName("PatientRegistration");
		processInstance.setProcessId("pc123");
		processInstance.setProcessDefinitionId("1212");
		processInstance.getParticipantList().add("admin");

		ProcessSteps processStep = new ProcessSteps();
		processStep.setStep("Step1");

		processInstance.getProcessStepList().add(processStep);

		//Message messageA = createMessage("1", "<PRPA></PRPA>", "pending","");
		//Message messageB = createMessage("2", "<PRPA></PRPA>",
		/		"Approval awaiting","");
		Message messageC = createMessage("3", "<PRPA></PRPA>", "completed","");

		//processStep.getMessageList().add(messageA);
		//processStep.getMessageList().add(messageB);
		//processStep.getMessageList().add(messageC);

		Gson g = new Gson();
		String processJson = g.toJson(processInstance);
		System.out.println(processJson);
	}
*/

}
