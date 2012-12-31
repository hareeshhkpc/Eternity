/*package com.hin.hl7messaging;

import java.io.File;
import java.util.HashMap;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.xpath.XPathConstants;

import junit.framework.TestCase;

import org.junit.Test;
import org.w3c.dom.Document;

import com.hin.hl7messaging.MessageService;
import com.hin.hl7messaging.cassandra.XPATHReader;
import com.hin.hl7messaging.repository.MessageRepositoryStandard;

public class TestDatabaseRepository extends TestCase{
	MessageRepositoryStandard repositoryStandard = new MessageRepositoryStandard();
	MessageService messageService = new MessageService();
	
	// Create keyspace and column families
	@Test
	public void testCreateDatabase(){
		File file = new File("../message-repository/src/main/resources/MessageConfiguration.xml");
		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
		try{
			DocumentBuilder db = dbf.newDocumentBuilder();		
			Document doc = db.parse(file);			
						
			repositoryStandard.registerMessageTypes(doc);				
			
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	// Insert row in standard column family
	@Test
	public void testSaveStandardMessage() {
		String message="", userName;
		XPATHReader reader = new XPATHReader("../hin-web/src/main/webapp/UserProfile/html/PRPA_EX101001UV01_01.xml");
		message = reader.XMLmsg("../hin-web/src/main/webapp/UserProfile/html/PRPA_EX101001UV01_01.xml");
		userName = "//name/given";            
		userName = (String) reader.read(userName, XPathConstants.STRING);   
		
		try {		
			messageService.saveProfileMessage(userName, message);
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	// Insert row in super column family
	@Test
	public void testSaveSuperMessage(){
		String message="", profileID="", messageID="";
		XPATHReader reader = new XPATHReader("../hin-web/src/main/webapp/UserProfile/html/PRPA_EX101001UV01_01.xml");
		message = reader.XMLmsg("../hin-web/src/main/webapp/UserProfile/html/PRPA_EX101001UV01_01.xml");
		profileID = "//identifiedPerson/id/@root";
		profileID = (String) reader.read(profileID, XPathConstants.STRING);
		messageID = "//id[1]/@root";
		messageID = (String) reader.read(messageID, XPathConstants.STRING);
		
		com.hin.hl7messaging.utils.MessageType messageType = com.hin.hl7messaging.utils.MessageType.ENTITY;
		
		try {		
			
			messageService.saveInboxMessage(profileID,messageID,message,messageType);
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	// De-identify a message and insert into database
	@Test
	public void testDeidentifyMessage(){
		File file = new File("../hin-web/src/main/webapp/UserProfile/html/PRPA_EX101001UV01_01.xml");
		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
		
		try {
			DocumentBuilder db = dbf.newDocumentBuilder();		
			Document doc = db.parse(file);	
			messageService.deidentification(doc);
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	// Retrieve standard column message
	@Test
	public void testRetrieveStandardMessage(){
		String profileID="";
		XPATHReader reader = new XPATHReader("../hin-web/src/main/webapp/UserProfile/html/PRPA_EX101001UV01_01.xml");
		profileID = "//identifiedPerson/id/@root";
		profileID = (String) reader.read(profileID, XPathConstants.STRING);
		
		try {
			messageService.retrieveProfile(profileID);
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	// Retrieve super column message
	@Test
	public void testRetrieveSuperMessage(){
		String profileID="";
		XPATHReader reader = new XPATHReader("../hin-web/src/main/webapp/UserProfile/html/PRPA_EX101001UV01_01.xml");
		profileID = "//identifiedPerson/id/@root";
		profileID = (String) reader.read(profileID, XPathConstants.STRING);
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		try {
			resultMap = messageService.retrieveInbox(profileID);
			System.out.println(resultMap);
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	// Retrieve message from CF_INDEX_INBOX
	@Test
	public void testRetrieveIndexInbox(){
		String profileID="", messageID="";
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		XPATHReader reader = new XPATHReader("../hin-web/src/main/webapp/UserProfile/html/PRPA_EX101001UV01_01.xml");
		profileID = "//identifiedPerson/id/@root";
		profileID = (String) reader.read(profileID, XPathConstants.STRING);
		messageID = "//id[1]/@root";
		messageID = (String) reader.read(messageID, XPathConstants.STRING);
		try {
			resultMap = messageService.retrieveIndexInbox(profileID, messageID);
			System.out.println(resultMap);
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
*/