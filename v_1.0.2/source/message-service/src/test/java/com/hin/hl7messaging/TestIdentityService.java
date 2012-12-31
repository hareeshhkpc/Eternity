package com.hin.hl7messaging;

import java.util.HashMap;
import java.util.Map;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;

import com.hin.hl7messaging.cassandra.XPATHReader;
import com.hin.hl7messaging.identitymanagement.IdentityMessageService;

@ContextConfiguration(locations = {
		"classpath:spring/applicationContext-core-test.xml", 
		"classpath:spring/mongodb-test.xml"})
public class TestIdentityService  extends  AbstractJUnit4SpringContextTests{
	
	//@Autowired
	//private IdentityMessageService messageService;
	
	@Test
	public void testSaveRole() {	
		
		XPATHReader reader = new XPATHReader("../message-service/src/msgtype/PRPA_IN000001.xml");
		String message = reader.XMLmsg("../message-service/src/msgtype/PRPA_IN000001.xml");
		//messageService.saveRoleMessage(message);
	}
	
	@Test
	public void testSaveSubscriber() {
		
		XPATHReader reader = new XPATHReader("../message-service/src/msgtype/PRPA_IN000001.xml");
		String message = reader.XMLmsg("../message-service/src/msgtype/PRPA_IN000001.xml");
		//messageService.saveSubscriberProfileMessage(message, "userName", "fullName", "password", "securityQuestion", "securityAnswer", "subscriberType", "email", "address", "telecom");//(message);
	}
	
	@Test
	public void testSaveInbox() {
		
		XPATHReader reader = new XPATHReader("../message-service/src/msgtype/PRPA_IN000001.xml");
		String message = reader.XMLmsg("../message-service/src/msgtype/PRPA_IN000001.xml");
	}
	
	@Test
	public void testLogin() {

		
		//Map<String, HashMap<String, String>> resultMap = messageService.login("userName", "password");
	}

	@Test
	public void test(){
		String fullName="adcb";
		
		System.out.println(fullName.substring(0, 1));
	}
	
	
}
