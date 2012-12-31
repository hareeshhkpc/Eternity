/**
 * 
 */
package com.hin.hl7messaging.config;

import static org.junit.Assert.*;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;

import org.junit.Test;

import com.google.gson.Gson;
import com.hin.domain.Message;
import com.hin.domain.MessageType;
import com.hin.domain.ProcessDefinition;
import com.hin.domain.Step;

/**
 * @author sanal.p
 * 
 */
public class EnrollmentProcessDefinitionTest {


	/*@Test
	public void testEnrollmentProcess() throws IOException {

		ProcessDefinition processDefinition = new ProcessDefinition(
				"EnrollmentProcess");
		Step step = createStep("1", "Demographics",
				"Complete/Confirm Patient Demographics", "Demographics");
		
		MessageType messageType = createMessageType("PRPA_1000", "Pending");
		Message message = createMessage("", "", "Pending",
				"REGISTRATION_FORM");
		messageType.getMessages().add(message);
		
		step.getMessageTypes().add(messageType);

		processDefinition.steps.add(step);

		Gson g = new Gson();
		String processJson = g.toJson(processDefinition);
		System.out.println(processJson);

	}*/
	
	@Test
	public void testAgeManagementProcess() throws IOException {

		ProcessDefinition processDefinition = new ProcessDefinition(
				"AgeManagementProcess");
		Step step = createStep("1", "AgeManagement",
				"Age Management Program", "AgeManagement");
		
		MessageType messageType1 = createMessageType("Questionnaire", "Pending");
		Message lifestyle = createMessage("LifeStyle", "LifeStyle Questionnaire", "Pending",
				"LIFESTYLE_QUESTIONNAIRE_FORM");
		Message awareness = createMessage("Awareness", "Awareness Questionnaire", "Pending",
				"AWARENESS_QUESTIONNAIRE_FORM");
		Message culture = createMessage("Culture", "Culture Questionnaire", "Pending",
				"CULTURE_QUESTIONNAIRE_FORM");
		Message environment = createMessage("Environment", "Environment Questionnaire", "Pending",
				"ENVIRONMENT_QUESTIONNAIRE_FORM");
		messageType1.getMessages().add(lifestyle);
		messageType1.getMessages().add(awareness);
		messageType1.getMessages().add(culture);
		messageType1.getMessages().add(environment);
		
		MessageType messageType2 = createMessageType("Diagnostic Test", "Pending");
		Message mct = createMessage("MCT", "MCT", "Pending",
				"MCT_FORM");
		Message sphygmocor = createMessage("Sphygmocor", "Sphygmocor", "Pending",
				"SPHYGMOCOR_FORM");
		Message ict = createMessage("ICT", "ICT", "Pending",
				"ICT_FORM");
		Message bio_clip = createMessage("Bio_Clip", "Bio Clip", "Pending",
				"BIO_CLIP_FORM");
		messageType2.getMessages().add(mct);
		messageType2.getMessages().add(sphygmocor);
		messageType2.getMessages().add(ict);
		messageType2.getMessages().add(bio_clip);
		
		
		MessageType messageType3 = createMessageType("Appointment", "Pending");
		Message appointment1 = createMessage("appointment1", "18 May 2012 10:00 AM", "Pending",
				"AGE_MANAGEMENT_PREMIUM_FORM");
		messageType3.getMessages().add(appointment1);
		
		MessageType messageType4 = createMessageType("Fees", "Pending");
		Message ageManagementPremium = createMessage("ageManagement", "Age Management Program Premium", "Pending",
				"AGE_MANAGEMENT_PREMIUM_FORM");
		messageType4.getMessages().add(ageManagementPremium);
		
		step.getMessageTypes().add(messageType1);
		step.getMessageTypes().add(messageType2);
		step.getMessageTypes().add(messageType3);
		step.getMessageTypes().add(messageType4);

		processDefinition.steps.add(step);

		Gson g = new Gson();
		String processJson = g.toJson(processDefinition);
		System.out.println(processJson);

	}

	private Step createStep(String stepname, String shortDescription,
			String longDescription, String groupName) {
		Step step = new Step();
		step.setStepName(stepname);
		step.setShortDescription(shortDescription);
		step.setLongDescription(longDescription);
		step.setGroupName(groupName);
		return step;
	}

	private MessageType createMessageType(String type, String messageState) {
		MessageType messageType = new MessageType();
		messageType.setType(type);
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
}
