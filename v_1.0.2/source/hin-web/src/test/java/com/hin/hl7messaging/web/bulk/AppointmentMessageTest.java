package com.hin.hl7messaging.web.bulk;

import java.io.File;
import java.io.FileInputStream;
import java.util.Properties;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.multipart.ByteArrayPartSource;
import org.apache.commons.httpclient.methods.multipart.FilePart;
import org.apache.commons.httpclient.methods.multipart.Part;
import org.apache.commons.httpclient.methods.multipart.StringPart;
import org.junit.Test;

public class AppointmentMessageTest extends TestCaseBase {

	@Test
	public void testCompleteEncounterToHIS() throws Exception{
		HttpClient client = new HttpClient();
		client.getParams().setParameter("http.useragent", "Test Client");
		
		File folder = new File("src/main/webapp/transformers/test-case-input/appollo_201201190353");
		File appointment = new File(folder.getAbsolutePath() + "/ENCOUNTER_kavitha.properties");
		if(!appointment.exists()){
			throw new Exception("Encounter not found");
		}
		
		Properties properties = new Properties();
		properties.load(new FileInputStream(appointment));
		
		String assignedTo = properties.getProperty("assignedToWhom");
		properties.remove("assignedToWhom");
		//assignedTo = properties.getProperty("assignedToWhom");
		//properties.remove("assignedToWhom");
		
		String userXml = getFormattedMessage(XML_SKELETON_PATH + "/" + ENCOUNTER + ".xml", properties);

		ByteArrayPartSource baps = new ByteArrayPartSource("Encounter.xml", userXml.getBytes());
		Part[] parts = new Part[]{ 
				new StringPart("assignedToWhom", assignedTo),	
				new StringPart("messageID", "MSG_000001"),
				new StringPart("messageType", "PRPA_IN400000"),
				new StringPart("requestType", "newTask"),
				new StringPart("artifactID", "PRPA_IN400000"),
				new FilePart("message", baps)
		};
		String response = postToHttpServiceAsMultipartOnlyBody("http://172.25.250.211:8080/hin/", userXml);
		System.out.println("Encounter creation response: " + response);
	}
	
	@Test
	public void testCreateEncounter() throws Exception{
		HttpClient client = new HttpClient();
		client.getParams().setParameter("http.useragent", "Test Client");
		
		File folder = new File("src/main/webapp/transformers/test-case-input/appollo_201201190353");
		File appointment = new File(folder.getAbsolutePath() + "/ENCOUNTER_kavitha.properties");
		if(!appointment.exists()){
			throw new Exception("Encounter not found");
		}
		
		Properties properties = new Properties();
		properties.load(new FileInputStream(appointment));
		
		String assignedTo = properties.getProperty("assignedToWhom");
		properties.remove("assignedToWhom");
		//assignedTo = properties.getProperty("assignedToWhom");
		//properties.remove("assignedToWhom");
		
		String userXml = getFormattedMessage(XML_SKELETON_PATH + "/" + ENCOUNTER + ".xml", properties);

		ByteArrayPartSource baps = new ByteArrayPartSource("Encounter.xml", userXml.getBytes());
		Part[] parts = new Part[]{ 
				new StringPart("assignedToWhom", assignedTo),
				new StringPart("assignedToOrg", "healthdemo"),
				new StringPart("messageID", "MSG_000001"),
				new StringPart("messageType", "PRPA_IN400000"),
				new StringPart("requestType", "newTask"),
				new StringPart("artifactID", "PRPA_IN400000"),
				
				new FilePart("message", baps)
		};
		String response = postToHttpServiceAsMultipart(client, SERVER_URL + "/MessageServlet", parts);
		System.out.println("Encounter creation response: " + response);
	}
	
	@Test
	public void testCreateAppointment() throws Exception{
		HttpClient client = new HttpClient();
		client.getParams().setParameter("http.useragent", "Test Client");
		
		File folder = new File("src/main/webapp/transformers/test-case-input/appollo_201201190353");
		File appointment = new File(folder.getAbsolutePath() + "/APPOINTMENT_kavitha.properties");
		if(!appointment.exists()){
			throw new Exception("Appointment not found");
		}
		
		Properties properties = new Properties();
		properties.load(new FileInputStream(appointment));
		
		String assignedTo = properties.getProperty("assignedToWhom");
		properties.remove("assignedToWhom");
		
		String userXml = getFormattedMessage(XML_SKELETON_PATH + "/" + APPOINTMENT + ".xml", properties);

		ByteArrayPartSource baps = new ByteArrayPartSource("Registration.xml", userXml.getBytes());
		Part[] parts = new Part[]{ 
				new StringPart("assignedToWhom", assignedTo),	
				new StringPart("messageID", "PRPA_IN410001"),
				new StringPart("messageType", "PRPA_IN410001"),
				new StringPart("requestType", "newTask"),
				new StringPart("artifactID", "PRPA_IN410001"),
				new FilePart("message", baps)
		};
		String response = postToHttpServiceAsMultipart(client, SERVER_URL + "/MessageServlet", parts);
		System.out.println("Appointment creation response: " + response);
	}
}