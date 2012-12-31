/**
 * 
 */
package com.hin.hl7messaging.config;

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
public class ProcessDefinitionTest {

	@Test
	public void testAgeMgtProcess() {
		// this is only for Age Management Program
		ProcessDefinition processDefinition = new ProcessDefinition(
				"AgeManagementProgram");
		/* processDefinition.setId("AgeManagementProgram-1"); */
		Step step = createStep("Step1", "History", "History", "History",
				"History");
		MessageType messageType = createMessageType("POXX_MT111000HT02",
				"Questionnaire", "messageState",
				"LIFE_STYLE_QUESTIONNAIRE_FORM", "Life Style");

		Message message = createMessage("", "Questionnaire", "Life Style",
				"Questionnaire", false);
		messageType.addMessage(message);
		step.addMessageType(messageType);

		message = createMessage(1, "", "", "pending", "LIFE_STYLE_FORM");
		messageType.addMessage(message);
		step.getMessageTypes().add(messageType);

		messageType = createMessageType("POCD_MT000040HT07", "Questionnaire",
				"Pending", "AWARENESS_QUESTIONNAIRE_FORM", "Awareness");

		message = createMessage("", "Awareness", "Awareness", "Questionnaire",
				false);
		messageType.addMessage(message);
		step.addMessageType(messageType);

		messageType = createMessageType("POCD_MT000040HT07", "Questionnaire",
				"Pending", "ENVIRONMENT_FORM", "Environment");
		message = createMessage("", "", "", "pending", false);
		messageType.addMessage(message);
		step.addMessageType(messageType);

		messageType = createMessageType("POCD_MT000040HT07", "Questionnaire",
				"Pending", "CULTURE_FORM", "Culture");
		message = createMessage("", "", "", "pending", false);
		messageType.addMessage(message);
		step.getMessageTypes().add(messageType);

		processDefinition.steps.add(step);

		step = createStep("Step2", "Measure", "Diagnostic Tests", "Measure",
				"Measure");

		messageType = createMessageType("POXX_MT111000HT02", "DiagnosticTests",
				"Pending", "CAC_FORM", "CAC");
		message = createMessage("", "CAC", "CAC  I", "Diagnostic Tests", false);
		messageType.addMessage(message);
		step.addMessageType(messageType);

		messageType = createMessageType("POXX_MT111000HT02", "DiagnosticTests",
				"Pending", "MCG_FORM", "MCG");
		message = createMessage("", "MCG", "MCG I", "Diagnostic Tests", false);
		messageType.addMessage(message);
		step.addMessageType(messageType);

		messageType = createMessageType("POXX_MT111000HT02", "DiagnosticTests",
				"Pending", "IMT_FORM", "IMT");
		message = createMessage("", "IMT", "IMT I", "Diagnostic Tests", false);
		messageType.addMessage(message);
		step.addMessageType(messageType);

		messageType = createMessageType("POXX_MT111000HT02", "DiagnosticTests",
				"Pending", "SPHYGMOCOR_FORM", "Sphygmocor");
		message = createMessage("", "Sphygmocor", "Sphygmocor I",
				"Diagnostic Tests", false);
		messageType.addMessage(message);
		step.addMessageType(messageType);

		messageType = createMessageType("POXX_MT111000HT02", "DiagnosticTests",
				"Pending", "BIOSPACE_FORM", "Biospace");
		message = createMessage("", "Biospace", "Biospace I",
				"Diagnostic Tests", false);
		messageType.addMessage(message);
		step.addMessageType(messageType);

		messageType = createMessageType("POXX_MT111000HT02", "DiagnosticTests",
				"Pending", "ABI_FORM", "ABI");
		message = createMessage("", "ABI", "ABI I", "Diagnostic Tests", false);
		messageType.addMessage(message);
		step.addMessageType(messageType);

		messageType = createMessageType("POXX_MT111000HT02", "DiagnosticTests",
				"Pending", "CARDIOSCAN_FORM", "Cardioscan");
		message = createMessage("", "Cardioscan", "Cardioscan I",
				"Diagnostic Tests", false);
		messageType.addMessage(message);
		step.addMessageType(messageType);

		messageType = createMessageType("POXX_MT111000HT02", "DiagnosticTests",
				"Pending", "THYROFLEX_FORM", "Thyroflex");
		message = createMessage("", "Thyroflex", "Thyroflex I",
				"Diagnostic Tests", false);
		messageType.addMessage(message);
		step.addMessageType(messageType);

		messageType = createMessageType("POXX_MT111000HT02", "DiagnosticTests",
				"Pending", "BIOCLIP_FORM", "Bioclip");
		message = createMessage("", "Bioclip", "Bioclip I", "Diagnostic Tests",
				false);
		messageType.addMessage(message);
		step.addMessageType(messageType);

		messageType = createMessageType("POXX_MT111000HT02", "DiagnosticTests",
				"Pending", "LABS_FORM", "Labs");
		message = createMessage("", "Labs", "Labs I", "Diagnostic Tests", false);
		messageType.addMessage(message);
		step.addMessageType(messageType);

		processDefinition.steps.add(step);

		step = createStep("Step3", "Mentor", "Results", "Mentor", "Mentor");

		messageType = createMessageType("POXX_MT111000HT02", "Results",
				"Pending", "OVERVIEW_REPORT_FORM", "Overview Report");
		message = createMessage("", "Overview Report", "Overview Report",
				"Results", false);
		messageType.addMessage(message);
		step.addMessageType(messageType);

		messageType = createMessageType("POXX_MT111000HT02", "Results",
				"Pending", "INFLAMMATION_FORM", "Inflammation Control Report");
		message = createMessage("", "Inflammation Control Report",
				"Inflammation Control Report", "Results", false);
		messageType.addMessage(message);
		step.addMessageType(messageType);

		messageType = createMessageType("POXX_MT111000HT02", "Results",
				"Pending", "NUTRITION_METABOLIC_FORM",
				"Nutrition and Metabolic Report");
		message = createMessage("", "Nutrition and Metabolic Report",
				"Nutrition and Metabolic Report", "Results", false);
		messageType.addMessage(message);
		step.addMessageType(messageType);

		messageType = createMessageType("POXX_MT111000HT02", "Results",
				"Pending", "TOXIN_FORM", "Toxin Reduction Report");
		message = createMessage("", "Toxin Reduction Report",
				"Toxin Reduction Report", "Results", false);
		messageType.addMessage(message);
		step.addMessageType(messageType);

		messageType = createMessageType("POXX_MT111000HT02", "Results",
				"Pending", "EXERCISE_FORM", "Exercise Report");
		message = createMessage("", "Exercise Report", "Exercise Report",
				"Results", false);
		messageType.addMessage(message);
		step.addMessageType(messageType);

		messageType = createMessageType("POXX_MT111000HT02", "Results",
				"Pending", "AESTHETICS_FORM", "Genetics Aesthetics Report");
		message = createMessage("", "Genetics Aesthetics Report",
				"Genetics Aesthetics Report", "Results", false);
		messageType.addMessage(message);
		step.addMessageType(messageType);

		messageType = createMessageType("POXX_MT111000HT02", "Results",
				"Pending", "RESTORATION_FORM", "Restoration of Hormones Report");
		message = createMessage("", "Restoration of Hormones Report",
				"Restoration of Hormones Report", "Results", false);
		messageType.addMessage(message);
		step.addMessageType(messageType);

		messageType = createMessageType("POXX_MT111000HT02", "Results",
				"Pending", "SUPPLEMENTATION_FORM",
				"Advanced Supplementation Report");
		message = createMessage("", "Advanced Supplementation Report",
				"Advanced Supplementation Report", "Results", false);
		messageType.addMessage(message);
		step.addMessageType(messageType);

		messageType = createMessageType("POXX_MT111000HT02", "Results",
				"Pending", "LEARNING_FORM", "Lifelong Learning Report");
		message = createMessage("", "Lifelong Learning Report",
				"Lifelong Learning Report", "Results", false);
		messageType.addMessage(message);
		step.addMessageType(messageType);

		messageType = createMessageType("POXX_MT111000HT02", "Results",
				"Pending", "CARDIO_FORM", "Cardio-metabolic Score");
		message = createMessage("", "Cardio-metabolic Score",
				"Cardio-metabolic Score", "Results", false);
		messageType.addMessage(message);
		step.addMessageType(messageType);

		messageType = createMessageType("POXX_MT111000HT02", "Results",
				"Pending", "ORGAN_FORM", "Organ System Score");
		message = createMessage("", "Organ System Score", "Organ System Score",
				"Results", false);
		messageType.addMessage(message);
		step.addMessageType(messageType);

		messageType = createMessageType("POXX_MT111000HT02", "Products",
				"pending", "SUBSTANCES_FORM", "Restoration of Hormones");
		message = createMessage("", "Restoration_of_Hormones",
				"Restoration_of_Hormones", "Products", false);
		messageType.addMessage(message);
		step.addMessageType(messageType);

		messageType = createMessageType("POXX_MT111000HT02", "Products",
				"pending", "SUBSTANCES_FORM", "Advanced Supplementation");
		message = createMessage("", "Advanced Supplementation",
				"Advanced Supplementation", "Products", false);
		messageType.addMessage(message);
		step.addMessageType(messageType);

		messageType = createMessageType("POXX_MT111000HT02", "Products",
				"pending", "SUBSTANCES_FORM", "Genetics and Aesthetics");
		message = createMessage("", "Genetics and Aesthetics",
				"Genetics and Aesthetics", "Products", false);
		messageType.addMessage(message);
		step.addMessageType(messageType);

		messageType = createMessageType("POXX_MT111000HT02", "ClientReport",
				"pending", "CLIENT_REPORT_FORM", "Client Report");
		message = createMessage("", "Client Report", "ClientReport",
				"ClientReport", false);
		messageType.addMessage(message);
		step.addMessageType(messageType);

		processDefinition.steps.add(step);

		step = createStep("Step4", "Monitor", "", "Monitor", "Monitor");
		messageType = createMessageType("POXX_MT111000HT02", "Monitoring",
				"pending", "MONITORING_FORM", "Monitoring");
		message = createMessage("", "", "pending", "", false);
		messageType.addMessage(message);
		step.addMessageType(messageType);
		processDefinition.steps.add(step);

		step = createStep("Step5", "Renew", "Renew", "Renew", "Renew");
		messageType = createMessageType("POXX_MT111000HT02", "RenewMembership",
				"pending", "RENEW_FORM", "Renew");
		message = createMessage("", "", "pending", "", false);
		messageType.addMessage(message);

		step.addMessageType(messageType);
		processDefinition.steps.add(step);

		Gson g = new Gson();
		String processJson = g.toJson(processDefinition);
		createJson(processJson);
	}

	@Test
	public void testRegistrationProcess() throws IOException {
		ProcessDefinition processDefinition = new ProcessDefinition(
				"PatientRegistration");
		Step step = createStep("Step1", "Registration",
				"Record Basic Information", "Registration",
				"PatientRegistration");
		/*
		 * MessageType messageType = createMessageType("PRPA_MT201000HT03",
		 * "Registration", "Pending", "");
		 */

		/*
		 * Message message = createMessage("PRPA_MT201000HT03", "",
		 * "Registration", "Registration - I", "Registration",
		 * "REGISTRATION_FORM", false); step.addMessage(message);
		 */

		MessageType messageType = createMessageType("PRPA_MT201000HT03",
				"typeName", "messageState", "REGISTRATION_FORM", "Registration");
		Message message = createMessage("", "Registration", "Registration - I",
				"Registration", false);
		//messageType.addMessage(message);
		step.addMessageType(messageType);

		processDefinition.steps.add(step);

		step = createStep("Step2", "Appointment", "Schedule Appointment",
				"Appointment", "AppointmentSchedule");

		messageType = createMessageType("PRPA_MT410001HT02", "Appointment",
				"messageState", "APPOINTMENT_FORM", "Appointment");
		message = createMessage("", "Appointment", "Schedule Appointment - I",
				"Appointment", false);
		// messageType.addMessage(message);
		step.addMessageType(messageType);

		processDefinition.steps.add(step);

		step = createStep("Step3", "Welcome", "Welcome & Booking Confirmation",
				"Welcome", "Welcome");

		messageType = createMessageType("PRPA_MT410001HT02", "Appointment",
				"Pending", "WELCOME_BOOKING_FORM", "Welcome");
		message = createMessage("", "Welcome", "Welcome I", "Welcome", false);
		//messageType.addMessage(message);
		step.addMessageType(messageType);

		processDefinition.steps.add(step);

		Gson g = new Gson();
		String processJson = g.toJson(processDefinition);
		createJson(processJson);

	}

	@Test
	public void testDemographicsAndBackground() throws IOException {

		ProcessDefinition processDefinition = new ProcessDefinition(
				"DemographicsAndBackground");
		/* processDefinition.setId("DemographicsAndBackground-1"); */
		Step step = createStep("Step1", "Demographics",
				"Complete/Confirm Patient Demographics", "Demographics",
				"PatientDemographics");

		MessageType messageType = createMessageType("PRPA_MT201000HT03",
				"PatientDemographics", "messageState", "DEMOGRAPHICS_FORM",
				"PatientDemographics");
		Message message = createMessage("", "Patient Demographics",
				"Patient Demographics", "PatientDemographics", false);
		messageType.addMessage(message);
		step.addMessageType(messageType);

		processDefinition.steps.add(step);

		step = createStep("Step2", "History", "Health History Questionnaire",
				"History", "History");

		messageType = createMessageType("POCD_MT000040HT01", "Questionnaire",
				"Complete", "HEALTH_HISTORY_QUESTIONNAIRE_FORM", "History");
		message = createMessage("", "History", "History -I", "History", false);
		messageType.addMessage(message);
		step.addMessageType(messageType);

		processDefinition.steps.add(step);

		step = createStep("Step3", "Consent", "Sign & Upload Consent Form",
				"Consent", "Consent");
		messageType = createMessageType("POCD_MT000040HT01", "Consent",
				"messageState", "CONSENT_FORM", "Consent");
		message = createMessage("", "Consent", "Consent I", "Consent", false);
		messageType.addMessage(message);
		step.addMessageType(messageType);

		processDefinition.steps.add(step);

		step = createStep("Step4", "Consultation", "Choose a Program",
				"Consultation", "Programs");

		messageType = createMessageType("POCD_MT000040HT01", "Consultation",
				"messageState", "PROGRAM_FORM", "Consultation");
		message = createMessage("", "Consultation", "Consultation -I",
				"Consultation", false);
		messageType.addMessage(message);
		step.addMessageType(messageType);
		processDefinition.steps.add(step);

		step = createStep("Step5", "Enroll", "Enroll Patient in Program",
				"Enroll", "Enrollment");

		/*
		 * message = createMessage("POCD_MT000040HT01", "",
		 * "< Add a Questionnaire >", "Questionnaire Info", "Questionnaire",
		 * "LIFE_STYLE_QUESTIONNAIRE_FORM", true); step.addMessage(message);
		 * message = createMessage("POCD_MT000040HT01", "",
		 * "< Add a Diagnostics Test >", "Diagnostics Info", "Diagnostics",
		 * "LIFE_STYLE_QUESTIONNAIRE_FORM", true); step.addMessage(message);
		 */
		messageType = createMessageType("PRPA_MT201000HT03", "Appointment",
				"messageState", "APPOINTMENT_FORM", "Appointment");
		message = createMessage("", "Appointment", "Appointment Info I",
				"Appointment", false);
		/*messageType.addMessage(message);*/
		step.addMessageType(messageType);

		/*
		 * messageType = createMessageType("POCD_MT000040HT01", "Appointment",
		 * "messageState", "APPOINTMENT_FORM"); message = createMessage("",
		 * "Appointment", "Appointment Info I", "Appointment", false);
		 * messageType.addMessage(message); step.addMessageType(messageType);
		 * 
		 * messageType = createMessageType("PRPA_MT201000HT03", "Appointment",
		 * "messageState", "APPOINTMENT_FORM"); message = createMessage("",
		 * "Appointment", "Appointment Info I", "Appointment", false);
		 * messageType.addMessage(message); // step.addMessageType(messageType);
		 * 
		 * messageType = createMessageType("PRPA_MT201000HT03",
		 * "AppointmentType1", "messageState", "APPOINTMENT_FORM"); message =
		 * createMessage("", "Appointment", "Appointment Info II",
		 * "Appointment", false);
		 */
		// messageType.addMessage(message);

		/*
		 * message = createMessage("", "Appointment", "Appointment Info III",
		 * "Appointment", false); messageType.addMessage(message);
		 */

		// step.addMessageType(messageType);

		messageType = createMessageType("PRPA_IN203000HT04", "Fee",
				"messageState", "FEE_FORM", "Fee");
		message = createMessage("", "Fee", "Fee Info", "Fee", false);
		messageType.addMessage(message);
		step.addMessageType(messageType);

		messageType = createMessageType("PRPA_IN203000HT04", "Cost",
				"messageState", "COST_FORM", "Cost");
		message = createMessage("", "Cost", "Cost Info", "Cost", false);
		messageType.addMessage(message);
		step.addMessageType(messageType);

		processDefinition.steps.add(step);

		Gson g = new Gson();
		String processJson = g.toJson(processDefinition);
		createJson(processJson);
	}

	/*
	 * @Test public void testEnrollmentProcess() throws IOException {
	 * 
	 * ProcessDefinition processDefinition = new ProcessDefinition(
	 * "EnrollmentProcess"); Step step = createStep("1", "Enroll",
	 * "Enroll Patient in Program", "Enroll", "Enrollment");
	 * 
	 * MessageType messageType = createMessageType("PRPA_MT201000HT03",
	 * "Questionnaire", "Pending", "");
	 * 
	 * Message message = createMessage(1, "", "LifeStyle Questionnaire",
	 * "Pending", "LIFE_STYLE_QUESTIONNAIRE_FORM");
	 * messageType.addMessage(message);
	 * 
	 * message = createMessage(1, "", "Awareness Questionnaire", "Pending",
	 * "AWARENESS_QUESTIONNAIRE_FORM"); messageType.addMessage(message);
	 * 
	 * step.getMessageTypes().add(messageType);
	 * 
	 * messageType = createMessageType("PRPA_IN203000HT05", "Diagnostic Test",
	 * "Pending", ""); message = createMessage(1, "", "MCT", "Pending",
	 * "MCT_FORM"); messageType.addMessage(message);
	 * 
	 * step.getMessageTypes().add(messageType);
	 * 
	 * messageType = createMessageType("PRPA_IN203000HT06", "Appointment",
	 * "Pending", ""); message = createMessage(1, "", "28 MAY 2012 10:30 AM",
	 * "Pending", "PATIENT_APPOINTMENT_FORM"); messageType.addMessage(message);
	 * 
	 * step.getMessageTypes().add(messageType);
	 * 
	 * messageType = createMessageType("PRPA_IN203000HT07", "Fee", "Pending",
	 * ""); message = createMessage(1, "", "Date Service", "Pending", "");
	 * messageType.addMessage(message);
	 * 
	 * step.getMessageTypes().add(messageType);
	 * 
	 * processDefinition.steps.add(step);
	 * 
	 * Gson g = new Gson(); String processJson = g.toJson(processDefinition);
	 * createJson(processJson);
	 * 
	 * }
	 */

	@Test
	public void testMonitor() throws IOException {
		ProcessDefinition processDefinition = new ProcessDefinition("Monitor");
		/* Step -1 */
		Step step = createStep("Step1", "Measure", "Measure", "Testing",
				"MonitorMeasure");

		MessageType messageType = createMessageType("PRPA_MT201000HT03",
				"AddNewTest", "messageState", "SPHYGMOCOR_FORM", "");
		Message message = createMessage("", "Patient Demographics",
				"PatientDemographics", "", false);
		messageType.addMessage(message);
		step.addMessageType(messageType);

		messageType = createMessageType("PRPA_MT201000HT03", "AddNewFee",
				"messageState", "FEE_FORM", "");
		message = createMessage("", "Patient Demographics",
				"PatientDemographics", "", false);
		messageType.addMessage(message);
		step.addMessageType(messageType);

		processDefinition.steps.add(step);

		/* Step -2 */
		step = createStep("Step2", "Review", "Review", "Testing", "Review");

		messageType = createMessageType("PRPA_MT201000HT03", "Results",
				"messageState", "REVIEW_FORM", "");
		message = createMessage("", "Results", "Results", "", false);
		messageType.addMessage(message);
		step.addMessageType(messageType);

		messageType = createMessageType("PRPA_MT201000HT03", "Trend",
				"messageState", "REVIEW_FORM", "");
		message = createMessage("", "Trend", "Trend", "", false);
		messageType.addMessage(message);
		step.addMessageType(messageType);

		processDefinition.steps.add(step);

		/* Step -3 */
		step = createStep("Step3", "Substances", "Substances", "Substances",
				"Substances");
		messageType = createMessageType("POSA_MT920000HT03",
				"GeneticsAndAesthatics", "messageState", "SUBSTANCES_FORM", "");
		message = createMessage("", "Cleanse", "Cleanse", "", false);
		messageType.addMessage(message);
		// step.addMessageType(messageType);

		/*
		 * messageType = createMessageType("POSA_MT920000HT03",
		 * "RestorationOfHormones", "messageState", "SUBSTANCES_FORM","");
		 */
		message = createMessage("", "Cleanse", "Cleanse", "", false);
		messageType.addMessage(message);
		// step.addMessageType(messageType);

		/*
		 * messageType = createMessageType("POSA_MT920000HT03",
		 * "AdvancedSupplementation", "messageState", "SUBSTANCES_FORM","");
		 */
		message = createMessage("", "Cleanse", "Cleanse", "", false);
		messageType.addMessage(message);
		step.addMessageType(messageType);

		processDefinition.steps.add(step);

		/* Step -4 */

		step = createStep("Step4", "Payments",
				"Products Bill for Services and Products", "Payments",
				"Accounts");
		messageType = createMessageType("FIAB_MT020000HT02", "NewServices",
				"Pending", "SERVICE_FORM", "");
		message = createMessage("msg-1", "", "Pending", "", false);
		messageType.getMessages().add(message);
		step.getMessageTypes().add(messageType);
		processDefinition.steps.add(step);

		Gson g = new Gson();
		String processJson = g.toJson(processDefinition);
		createJson(processJson);
	}

	@Test
	public void testAccount() {

		ProcessDefinition processDefinition = new ProcessDefinition("Accounts");

		/* Step -1 New Fees */

		Step step = createStep("Step1", "NewFees", "", "NewFees", "Accounts");

		MessageType messageType = createMessageType("FIAB_MT020000HT02",
				"NewServices", "Pending", "SERVICE_FORM", "New Services");
		Message message = createMessage("", "", "Pending", "", false);
		// messageType.addMessage(message);
		step.getMessageTypes().add(messageType);

		/*
		 * Message message = createMessage("FIAB_MT020000HT02", "msg-1",
		 * "New Services", "New Services - I", "NewServices", "SERVICE_FORM",
		 * false); step.addMessage(message);
		 */

		/*
		 * messageType.addMessage(message); message = createMessage(1, "msg-2",
		 * "", "Pending", "SERVICE_FORM",false);
		 * messageType.addMessage(message);
		 * step.getMessageTypes().add(messageType);
		 */

		message = createMessage("POCD_MT000040HT01", "msg-2", "New Products",
				"New Products - I", "NewProducts", "PRODUCT_FORM", false);
		// step.addMessage(message);

		// section2

		messageType = createMessageType("POCD_MT000040HT01", "NewProducts",
				"Pending", "PRODUCT_FORM", "New Products");
		message = createMessage(2, "", "", "Pending", "PRODUCT_FORM");
		/*
		 * messageType.addMessage(message);
		 * step.getMessageTypes().add(messageType);
		 */
		step.getMessageTypes().add(messageType);

		processDefinition.steps.add(step);

		/* Step -1 New Fees */

		/* Step-2 Billing */

		step = createStep("Step2", "Billing", "", "Billing", "");

		/*
		 * messageType = createMessageType("FIAB_MT020000HT02",
		 * "CreateanInvoice", "Pending", ""); message = createMessage(1, "", "",
		 * "Pending", "SERVICE_FORM"); messageType.addMessage(message);
		 * step.getMessageTypes().add(messageType);
		 */

		message = createMessage("FIAB_MT020000HT02", "", "CreateanInvoice",
				"Collection I", "collection", "SERVICE_FORM", false);
		//step.addMessage(message);

		// processDefinition.steps.add(step);

		/* Step-2 Billing */

		/* Step-3 Collection */

		step = createStep("Step3", "Collection", "", "Collection", "");

		/*
		 * messageType = createMessageType("FIAB_MT020000HT02",
		 * "RecordaPayment", "Pending", ""); message = createMessage(1, "", "",
		 * "Pending", "SERVICE_FORM"); messageType.addMessage(message);
		 * step.getMessageTypes().add(messageType);
		 */

		message = createMessage("FIAB_MT020000HT02", "", "RecordaPayment",
				"Record I", "Record", "SERVICE_FORM", false);
		//step.addMessage(message);

		// processDefinition.steps.add(step);

		/* Step-3 Collection */

		Gson g = new Gson();
		String processJson = g.toJson(processDefinition);
		createJson(processJson);

	}

	@Test
	public void testSample() throws IOException {

		ProcessDefinition processDefinition = new ProcessDefinition(
				"DemographicsAndBackground");
		Step step = createStep("Step1", "Demographics",
				"Complete/Confirm Patient Demographics", "Demographics",
				"PatientDemographics");

		MessageType messageType = createMessageType("PRPA_MT201000HT03",
				"typeName", "messageState", "DEMOGRAPHICS_FORM", "Demographics");
		Message message = createMessage("PRPA_MT201000HT03", "",
				"Patient Demographics", "Patient Demographics",
				"PatientDemographics", "DEMOGRAPHICS_FORM", false);
		messageType.addMessage(message);
		step.addMessageType(messageType);
		processDefinition.steps.add(step);

		/*
		 * step = createStep("Step4", "Consultation", "Choose Program",
		 * "Consultation", "Programs");
		 * 
		 * processDefinition.steps.add(step);
		 * 
		 * step = createStep("Step5", "Enroll", "Enroll Patient in Program",
		 * "Enroll", "Enrollment");
		 * 
		 * message = createMessage("PRPA_MT201000HT03", "", "Appointment1",
		 * "Appointment Info I", "Appointment", "APPOINTMENT_FORM", true);
		 * step.addMessage(message);
		 * 
		 * message = createMessage("PRPA_MT201000HT03", "", "Appointment2",
		 * "Appointment Info II", "Appointment", "APPOINTMENT_FORM", false);
		 * step.addMessage(message); message =
		 * createMessage("PRPA_IN203000HT04", "", "Fee", "Fee Info", "Fee",
		 * "FEE_FORM", false); step.addMessage(message);
		 * 
		 * 
		 * processDefinition.steps.add(step);
		 */
		/*
		 * Gson g = new Gson(); String processJson =
		 * g.toJson(processDefinition); createJson(processJson);
		 */
		/*
		 * processDefinition = new ProcessDefinition("AgeManagementProgram");
		 * 
		 * step = createStep("Step1", "History", "History", "History",
		 * "History"); message = createMessage("POCD_MT000040HT01", "",
		 * "Life Style", "Life Style 1", "Questionnaire",
		 * "LIFE_STYLE_QUESTIONNAIRE_FORM", false); step.addMessage(message);
		 * message = createMessage("POCD_MT000040HT07", "", "Awareness",
		 * "Awareness1", "Awareness", "AWARENESS_QUESTIONNAIRE_FORM", false);
		 * step.addMessage(message); processDefinition.steps.add(step);
		 */
		/*
		 * g = new Gson(); processJson = g.toJson(processDefinition);
		 * createJson(processJson);
		 */
	}

	private void createJson(String processJson) {
		String jsonScript = "this.process.push('" + processJson + "');";
		System.out.println(jsonScript);
	}

	private Step createStep(String stepname, String shortDescription,
			String longDescription, String groupName, String formHtml) {
		Step step = new Step();
		step.setStepName(stepname);
		step.setShortDescription(shortDescription);
		step.setLongDescription(longDescription);
		step.setGroupName(groupName);
		step.setFormHtml(formHtml);
		return step;
	}

	private MessageType createMessageType(String type, String typeName,
			String messageState, String formHtml, String title) {
		MessageType messageType = new MessageType();
		messageType.setType(type);
		messageType.setTypeName(typeName);
		messageType.setState(messageState);
		messageType.setFormHtml(formHtml);
		messageType.setTitle(title);
		return messageType;
	}

	private Message createMessage(int messageIndex, String messageId,
			String message, String messageStatus, String messageForm) {
		Message messageObj = new Message();
		messageObj.setMessageIndex(-1);// messageIndex);
		messageObj.setMessageId(messageId);
		messageObj.setMessage("");// message);
		messageObj.setMessageStatus(messageStatus);
		messageObj.setMessageForm(messageForm);
		return messageObj;
	}

	private Message createMessage(String messageType, String messageId,
			String title, String header, String groupName, String messageForm,
			boolean empty) {
		Message messageObj = new Message();
		messageObj.setMessageIndex(-1);// messageIndex);
		messageObj.setMessageId(messageId);
		// messageObj.setMessage("");// message);
		messageObj.setMessageStatus("Pending");
		// messageObj.setMessageForm(messageForm);
		// messageObj.setMessageType(messageType);
		messageObj.setGroupName(groupName);
		messageObj.setTitle(title);
		messageObj.setHeader(header);
		messageObj.setEmpty(empty);
		return messageObj;
	}

	private Message createMessage(String messageId, String title,
			String header, String groupName, boolean empty) {
		Message messageObj = new Message();
		messageObj.setMessageIndex(-1);// messageIndex);
		messageObj.setMessageId(messageId);
		// messageObj.setMessage("");// message);
		messageObj.setMessageStatus("Pending");
		// messageObj.setMessageForm(messageForm);
		// messageObj.setMessageType(messageType);
		// messageObj.setGroupName(groupName);
		/*
		 * messageObj.setTitle(title);
		 */
		messageObj.setHeader(header);

		/* messageObj.setEmpty(empty); */
		return messageObj;
	}
}
