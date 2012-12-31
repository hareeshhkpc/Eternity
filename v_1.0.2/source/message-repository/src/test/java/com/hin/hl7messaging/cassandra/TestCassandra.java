package com.hin.hl7messaging.cassandra;

import java.io.File;
import java.util.HashMap;

import javax.annotation.Resource;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.xpath.XPathConstants;

import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;
import org.w3c.dom.Document;

import com.hin.hl7.messaging.api.IMessageRepository;
import com.hin.hl7messaging.repository.MessageRepository;

@ContextConfiguration(locations = {
		"classpath:spring/applicationContext-core-test.xml", 
		"classpath:spring/mongodb-test.xml"})
public class TestCassandra extends  AbstractJUnit4SpringContextTests {
	
	@Resource(name="messageRepository")
	private IMessageRepository repository; 
	
	@Autowired
	private CassandraClient client;
  
	// Connect and select Keyspace	
	@Before
	public void testConnect(){
		assert(client.getConnected() == true);		
	}
	
	// Create Keyspace
	@Test
	public void testCreateKeyspace(){
		try {
			//repository.createKeyspace("MessageKS");
			
		} catch (Exception e) {			
			e.printStackTrace();
		}
	}
	
	// Create Column Families	
	@Test
	public void testCreateColumnFamilies(){
		File file = new File("../message-repository/src/main/resources/MessageConfiguration.xml");
		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
		try {
			DocumentBuilder db = dbf.newDocumentBuilder();		
			Document doc = db.parse(file);	
			repository.registerMessageTypes(doc);
			
		} catch (Exception e) {			
			e.printStackTrace();
		}
	}
	
	// Insert row in standard Column
	@Test
	public void testSaveProfileMessage(){
		try {
			String message="", userName="", profileID="";
			XPATHReader reader = new XPATHReader("../hin-web/src/main/webapp/UserProfile/html/Contact1.xml");
			message = reader.XMLmsg("../hin-web/src/main/webapp/UserProfile/html/Contact1.xml");
			
			userName = "//name/given";            
			userName = (String) reader.read(userName, XPathConstants.STRING);    
			profileID = "//identifiedPerson/id/@root";
			profileID = (String) reader.read(profileID, XPathConstants.STRING);
			HashMap<String, Object> columnMap = new HashMap<String, Object>();
			
			try {
				columnMap.put("ROWKEY", profileID);
				columnMap.put("USERNAME", userName);
				columnMap.put("MESSAGE", message);
				repository.saveMessage("PROFILE_MESSAGE", columnMap);
				
			} catch (Exception e) {
				e.printStackTrace();
			}		
			
		} catch (Exception e) {			
			e.printStackTrace();
		}
	}
	
	// Insert row in super column
	@Test
	public void testSaveMessageInbox(){
		String message="", rowKey;
		XPATHReader reader = new XPATHReader("../hin-web/src/main/webapp/UserProfile/html/Contact1.xml");
		message = reader.XMLmsg("../hin-web/src/main/webapp/UserProfile/html/Contact1.xml");
		Long t = System.currentTimeMillis();
		
		HashMap<Long, String> columnMap = new HashMap<Long, String>();
		HashMap<String, Object> mainMap = new HashMap<String, Object>();
		rowKey = "//identifiedPerson/id/@root";            
		rowKey = (String) reader.read(rowKey, XPathConstants.STRING);    
		
		try {
			columnMap.put(t, message);
			mainMap.put("ROWKEY", rowKey);
			mainMap.put("ACT", columnMap);
			repository.saveMessage("MESSAGE_INBOX", mainMap);
			
		} catch (Exception e) {
			e.printStackTrace();
		}	
	}
	
	// De-identify a message and insert into database
	@Test
	public void testDeidentification(){
		String message="", creationTime="";
		XPATHReader reader = new XPATHReader("../hin-web/src/main/webapp/UserProfile/html/Contact1.xml");
		message = reader.XMLmsg("../hin-web/src/main/webapp/UserProfile/html/Contact1.xml");
		
		creationTime = "//creationTime/@value";
		creationTime = (String) reader.read(creationTime, XPathConstants.STRING);
		
		try {
			repository.saveDeidentifiedMessage(message, creationTime);

		} catch (Exception e) {
			e.printStackTrace();
		}	
	}
	
	// Retrieve standard column
	@Test
	public void testRetrieveStandardColumn(){
		
		try {
			repository.retrieveStandardColumnFamily("PROFILE_MESSAGE","2.16.840.1.113883.8.6.6");

		} catch (Exception e) {
			e.printStackTrace();
		}	
	}
	
	// Retrieve super column with time stamp
	@Test
	public void testRetrieveSuperColumn1(){
		HashMap<String, Object> columnMap = new HashMap<String, Object>();
		Long startColumn = null; 
		Long endColumn = 1324029383548L;
		try {
			columnMap.put("ROWKEY", "");
			columnMap.put("ACT", "");
			repository.retrieveSuperColumnFamily("2.16.840.1.113883.8.4.5","2.16.840.1.113883.8.4.5","MESSAGE_INBOX", startColumn, endColumn, columnMap);
			
		} catch (Exception e) {
			e.printStackTrace();
		}	
	}
	
	@Test
	public void testRetrieveSuperColumn2(){
		HashMap<String, Object> columnMap = new HashMap<String, Object>();
		Long startColumn = null; 
		Long endColumn = null;
		try {
			columnMap.put("ROWKEY", "");
			columnMap.put("ACT", "");
			repository.retrieveSuperColumnFamily("","","MESSAGE_INBOX", startColumn, endColumn, columnMap);
			
		} catch (Exception e) {
			e.printStackTrace();
		}	
	}
	@Test
	public void testRetrieveSuperColumn3(){
		HashMap<String, Object> columnMap = new HashMap<String, Object>();
		Long startColumn = 1324040207331L; 
		Long endColumn = 1324040207331L;
		try {
			columnMap.put("ACT", "");
			repository.retrieveSuperColumnFamily("2.16.840.1.113883.8.4.5","2.16.840.1.113883.8.4.5","MESSAGE_INBOX", startColumn, endColumn, columnMap);
			repository.retrieveSuperColumnFamily("","","MESSAGE_INBOX", startColumn, endColumn, columnMap);
		} catch (Exception e) {
			e.printStackTrace();
		}	
	}
	@Test
	public void testRetrieveSuperColumn4(){
		HashMap<String, Object> columnMap = new HashMap<String, Object>();
		Long startColumn = 0L; 
		Long endColumn = 2L;
		try {
			columnMap.put("ACT", "");
			repository.retrieveSuperColumnFamily("","","MESSAGE_INBOX", startColumn, endColumn, columnMap);
		} catch (Exception e) {
			e.printStackTrace();
		}	
	}
	@Test
	public void testRetrieveSuperColumn5(){
		HashMap<String, Object> columnMap = new HashMap<String, Object>();
		Long startColumn = 1324029383548L; 
		Long endColumn = null;
		try {
			columnMap.put("ACT", "");
			repository.retrieveSuperColumnFamily("","","MESSAGE_INBOX", startColumn, endColumn, columnMap);
		} catch (Exception e) {
			e.printStackTrace();
		}	
	}
	@Test
	public void testRetrieveSuperColumn6(){
		HashMap<String, Object> columnMap = new HashMap<String, Object>();
		Long startColumn = 1324040207331L; 
		Long endColumn = 1324040207331L;
		try {
			columnMap.put("ACT", "");
			repository.retrieveSuperColumnFamily("2.16.840.1.113883.8.4.5","","MESSAGE_INBOX", startColumn, endColumn, columnMap);
			repository.retrieveSuperColumnFamily("","","MESSAGE_INBOX", startColumn, endColumn, columnMap);
		} catch (Exception e) {
			e.printStackTrace();
		}	
	}
}
