/*package com.hin.hl7messaging;

import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.annotation.Resource;
import javax.xml.xpath.XPathConstants;

import org.junit.Test;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;
import org.w3c.dom.Document;

import com.hin.hl7messaging.api.IMessageService;
import com.hin.hl7messaging.utils.CalendarVO;
import com.hin.hl7messaging.utils.XMLHelper;

@ContextConfiguration(locations = {
		"classpath:spring/applicationContext-core-test.xml", 
		"classpath:spring/mongodb-test.xml"})
public class TestIndexColumnFamily extends  AbstractJUnit4SpringContextTests {
	
	@Resource(name="messageService")
	private IMessageService messageService;
	
	@Test
	public void testArtifactRegistrationPRPA_IN000001() throws Exception{
		
		Properties messageServiceConfig = new Properties();
		MessageService messageService = new MessageService();
		
		messageServiceConfig.setProperty("messageConfigLocation", "src/config/PRPA_IN000001.xml");		
		//messageService.setMessageServiceConfig(messageServiceConfig);
		
		String message="", profileID="";
		HashMap<String,String> variable = new HashMap<String, String>();
		
		//Document messageDoc = XMLHelper.getXMLDocument(new File("src/RecentMessageTypes/Registration/Registration1.xml"));
		Document messageDoc = XMLHelper.getXMLDocument(new File("src/RecentMessageTypes/Registration/Registration2.xml"));
		//Document messageDoc = XMLHelper.getXMLDocument(new File("src/RecentMessageTypes/Registration/Registration50.xml"));
		
		profileID = "//identifiedPerson/id/@root";
		profileID = (String) XMLHelper.read(messageDoc, profileID, XPathConstants.STRING);
		message = XMLHelper.getXMLDocumentAsString(messageDoc);
		
		System.out.println(profileID);
		
		String messageID = "//id[1]/@root";
		messageID = (String) XMLHelper.read(messageDoc, messageID, XPathConstants.STRING);
		
		variable.put("MESSAGE", message);
		variable.put("MESSAGEID", messageID);
		variable.put("PROFILE_ID", profileID);
		variable.put("ORGANIZATION_ID", "9999");
		
		try {
			messageService.archieveMessage(profileID, message, variable);
			System.out.println("Artifact");
	
		} catch (Exception e){
			e.printStackTrace();
		}
	}
	

	@Test
	public void testArtifactEncounterPRPA_IN400000() throws Exception{
		
		Properties messageServiceConfig = new Properties();
		
		messageServiceConfig.setProperty("messageConfigLocation", "src/config/PRPA_IN400000.xml");		
		//messageService.setMessageServiceConfig(messageServiceConfig);
		
		String message="", profileID="";
		HashMap<String,String> variable = new HashMap<String, String>();
		
		Document messageDoc = XMLHelper.getXMLDocument(new File("src/RecentMessageTypes/Encounter/Encounter1.xml"));
		//Document messageDoc = XMLHelper.getXMLDocument(new File("src/RecentMessageTypes/Encounter/Encounter2.xml"));
		//Document messageDoc = XMLHelper.getXMLDocument(new File("src/RecentMessageTypes/Encounter/Encounter20.xml"));
		
		profileID = "//controlActProcess/subject/encounterEvent/subject/patient/patientPerson/id/@root";
		profileID = (String) XMLHelper.read(messageDoc, profileID, XPathConstants.STRING);
		message = XMLHelper.getXMLDocumentAsString(messageDoc);
		
		System.out.println(profileID);
		
		String messageID = "//id[1]/@root";
		messageID = (String) XMLHelper.read(messageDoc, messageID, XPathConstants.STRING);
		
		variable.put("MESSAGE", message);
		variable.put("MESSAGEID", messageID);
		variable.put("PROFILE_ID", profileID);
		variable.put("ORGANIZATION_ID", "9999");
		
		try {
			messageService.archieveMessage(profileID, message, variable);
			System.out.println("Artifact");
	
		} catch (Exception e){
			e.printStackTrace();
		}
	}
	
	
	@Test
	public void testArtifactEncounterAppointmentPRPA_IN410001() throws Exception{
		
		Properties messageServiceConfig = new Properties();
		
		messageServiceConfig.setProperty("messageConfigLocation", "src/config/PRPA_IN410001.xml");		
		//messageService.setMessageServiceConfig(messageServiceConfig);
		
		String message="", profileID="";
		HashMap<String, String> variable = new HashMap<String, String>();
		
		Document messageDoc = XMLHelper.getXMLDocument(new File("src/RecentMessageTypes/Appointment/Appointment12_PRPA_IN410001.xml"));

		profileID = "//controlActProcess/subject/encounterAppointment/subject/patient/patientPerson/id/@root";
		profileID = (String) XMLHelper.read(messageDoc, profileID, XPathConstants.STRING);
		message = XMLHelper.getXMLDocumentAsString(messageDoc);
		
		System.out.println(profileID);
		
		String messageID = "//id[1]/@root";
		messageID = (String) XMLHelper.read(messageDoc, messageID, XPathConstants.STRING);
		
		variable.put("MESSAGE", message);
		variable.put("MESSAGEID", messageID);
		variable.put("PROFILE_ID", profileID);
		variable.put("ORGANIZATION_ID", "9999");
		
		try {
			messageService.archieveMessage(profileID, message, variable);
			System.out.println("Artifact");
	
		} catch (Exception e){
			e.printStackTrace();
		}
	}
	
	@Test
	public void testArtifactSpecimenObservationPOXX_IN121001() throws Exception{
		Properties messageServiceConfig = new Properties();
		
		messageServiceConfig.setProperty("messageConfigLocation", "src/config/POXX_IN121001.xml");		
		//messageService.setMessageServiceConfig(messageServiceConfig);
		
		String message="", profileID="";
		HashMap<String,String> variable = new HashMap<String, String>();
		
		Document messageDoc = XMLHelper.getXMLDocument(new File("src/RecentMessageTypes/Specimen Observation/SpecimenObservationOrder10_POXX_IN121001_sp1.xml"));
		
		profileID = "//controlActProcess/subject/specimenObservationOrder/author/employmentStaff/employeePerson/id/@root";
		profileID = (String) XMLHelper.read(messageDoc, profileID, XPathConstants.STRING);
		message = XMLHelper.getXMLDocumentAsString(messageDoc);
		
		System.out.println(profileID);
		
		String messageID = "//id[1]/@root";
		messageID = (String) XMLHelper.read(messageDoc, messageID, XPathConstants.STRING);
		
		variable.put("MESSAGE", message);
		variable.put("MESSAGEID", messageID);
		variable.put("PROFILE_ID", profileID);
		variable.put("ORGANIZATION_ID", "9999");
		
		try {
			messageService.archieveMessage(profileID, message, variable);
			System.out.println("Artifact");
	
		} catch (Exception e){
			e.printStackTrace();
		}
	}
	
	
	@Test
	public void testArtifactSubstanceAdministrationPOSA_IN000001() throws Exception{
		
		Properties messageServiceConfig = new Properties();
		
		messageServiceConfig.setProperty("messageConfigLocation", "src/config/POSA_IN000001.xml");		
		//messageService.setMessageServiceConfig(messageServiceConfig);
		
		String message="", profileID="";
		HashMap<String,String> variable = new HashMap<String, String>();
		
		Document messageDoc = XMLHelper.getXMLDocument(new File("src/RecentMessageTypes/Substance Administration/VasunSubOrder.xml"));
		
		profileID = "//controlActProcess/subject/substanceAdministrationOrder/subject/patient/patientPerson/id/@root";
		profileID = (String) XMLHelper.read(messageDoc, profileID, XPathConstants.STRING);
		message = XMLHelper.getXMLDocumentAsString(messageDoc);
		
		System.out.println(profileID);
		
		String messageID = "//id[1]/@root";
		messageID = (String) XMLHelper.read(messageDoc, messageID, XPathConstants.STRING);
		
		variable.put("MESSAGE", message);
		variable.put("MESSAGEID", messageID);
		variable.put("PROFILE_ID", profileID);
		variable.put("ORGANIZATION_ID", "9999");
		
		try {
			messageService.archieveMessage(profileID, message, variable);
			System.out.println("Artifact");
	
		} catch (Exception e){
			e.printStackTrace();
		}
	}
	
	@Test
	public void testGetStatistics(){
		Map<String, Map<String, Map<String, String>>> resultMap = new HashMap<String, Map<String, Map<String, String>>>();
		
		List<String> artifactIdList = new ArrayList<String>();
		artifactIdList.add("PRPA_IN000001");
		artifactIdList.add("PRPA_IN410001");
		artifactIdList.add("PRPA_IN400000");
		
		try {
			
			resultMap = messageService.getStatistics("012012", artifactIdList);
			System.out.println("For Statistics" +resultMap);
	
		} catch (Exception e){
			e.printStackTrace();
		}
		
	}
		
	@Test
	public void testGetMessages(){
		Map<String, HashMap<String, String>> resultMap = new HashMap<String, HashMap<String,String>>();
		
		try {
			resultMap = messageService.getMessages("TOTAL", "PRPA_IN000001");
			System.out.println("For Messages" +resultMap);
	
		} catch (Exception e){
			e.printStackTrace();
		}
		
	}
		
	@Test
	public void calendarTest(){
		String profileID = "//identifiedPerson/id/@root";
		Document messageDoc = XMLHelper.getXMLDocument(new File("src/test/test-resources/EncounterEvent_PRPA_IN400000_withID.xml"));
		profileID = (String) XMLHelper.read(messageDoc, profileID, XPathConstants.STRING);
		
		try {			
			CalendarVO calendarVO = new CalendarVO("admindemo", "Admin","Appointment Event", new Date(), false);
			messageService.calenderEvents(profileID, calendarVO);
			
		} catch (Exception e){
			e.printStackTrace();
		}
	}

}
*/