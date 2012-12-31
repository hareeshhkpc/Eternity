/*package com.hin.hl7messaging;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.xpath.XPathConstants;

import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.hector.api.Serializer;

import org.w3c.dom.NodeList;

import com.hin.hl7messaging.MessageService;
import com.hin.hl7messaging.cassandra.XPATHReader;
import junit.framework.TestCase;

public class TestMessageService extends TestCase {
	MessageService messageService = new MessageService();
	Serializer<String> stringSerializer = StringSerializer.get();
	

	// For inserting values in cassandra
	public void testsaveProfileMessage(){
		String message="", userName;
		XPATHReader reader = new XPATHReader("../hin-web/src/main/webapp/UserProfile/html/Contact3.xml");
		message = reader.XMLmsg("../hin-web/src/main/webapp/UserProfile/html/Contact3.xml");
		com.hin.hl7messaging.utils.MessageType m = com.hin.hl7messaging.utils.MessageType.ENTITY;
		userName = "//name/given";            
		userName = (String) reader.read(userName, XPathConstants.STRING);    
		
		try {			
			messageService.saveProfileMessage(userName, message);
			messageService.saveInboxMessage("2.16.840.1.113883.8.6.7","2.16.528.1.1007.3.2.700363.2288.4",message,m);
			messageService.saveInboxMessage("2.16.840.1.113883.8.6.6","2.16.528.1.1007.3.2.700363.2288.2",message,m);
		} catch (Exception e) {
			e.printStackTrace();
		}				
	}

	public void test(){
		String message="", userName;
		XPATHReader reader = new XPATHReader("../hin-web/src/main/webapp/UserProfile/html/Contact2.xml");
		message = reader.XMLmsg("../hin-web/src/main/webapp/UserProfile/html/Contact2.xml");
		System.out.println(message);
		com.hin.hl7messaging.utils.MessageType m = com.hin.hl7messaging.utils.MessageType.ENTITY;
		userName = "//name/given";            
		userName = (String) reader.read(userName, XPathConstants.STRING);
		
		try {			
			messageService.saveProfileMessage(userName, message);
			messageService.saveInboxMessage("2.16.840.1.113883.8.4.5","2.16.528.1.1007.3.2.700363.2288.3",message,m);
			messageService.saveInboxMessage("2.16.840.1.113883.8.6.6","2.16.528.1.1007.3.2.700363.2288.2",message,m);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}	
	
	public void testRetrieveMessage(){
		long start = 1319190131409L;
		long end = System.currentTimeMillis();	
		try{
		//	messageService.retrieveInbox("2.16.840.1.113883.2.4.6.3");
			messageService.retrieveMessageByTime("2.16.840.1.113883.2.4.6.3", start, end);
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	public void testOrg(){
		String message="", expression="";
		NodeList rootNode;
		XPATHReader reader = new XPATHReader("../hin-web/src/main/webapp/UserProfile/html/Organization.xml");
		message = reader.XMLmsg("../hin-web/src/main/webapp/UserProfile/html/Organization.xml");
		InputStream stream;
		try {
			stream = new ByteArrayInputStream(message.getBytes("UTF-8"));		
			DocumentBuilder builder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
			builder.parse(stream);
			
			expression = "/organization";
			rootNode = (NodeList)reader.read(expression, XPathConstants.NODESET);
	
			reader.traverseNodes(rootNode);
		
		} catch (Exception e) {		
			e.printStackTrace();
		}
	}
	
	public void testsave(){
		String message="", profileID="", messageID="";
		XPATHReader reader = new XPATHReader("../hin-web/src/main/webapp/UserProfile/html/Contact3.xml");
		message = reader.XMLmsg("../hin-web/src/main/webapp/UserProfile/html/Contact3.xml");
		profileID = "//identifiedPerson/id/@root";
		profileID = (String) reader.read(profileID, XPathConstants.STRING);
//		profileID = "2.16.840.1.113883.8.6.6";
		messageID = "//id[1]/@root";
		messageID = (String) reader.read(messageID, XPathConstants.STRING);
		try {						
				messageService.saveMessage(profileID, messageID, message);
				
			} catch (Exception e) {
				e.printStackTrace();
			}
	}
	

}
*/