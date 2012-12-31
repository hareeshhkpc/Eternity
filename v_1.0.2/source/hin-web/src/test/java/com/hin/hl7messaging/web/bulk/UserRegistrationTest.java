package com.hin.hl7messaging.web.bulk;

import java.io.File;
import java.io.FileInputStream;
import java.util.Properties;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.multipart.ByteArrayPartSource;
import org.apache.commons.httpclient.methods.multipart.FilePart;
import org.apache.commons.httpclient.methods.multipart.Part;
import org.apache.commons.httpclient.methods.multipart.StringPart;

public class UserRegistrationTest extends TestCaseBase {
	
	public void testCreateUser() throws Exception{
		File folder = new File("src/main/webapp/transformers/test-case-input/appollo_201201190353");
		File userProfile = new File(folder.getAbsolutePath() + "/USER_sarah.properties");
		if(!userProfile.exists()){
			throw new Exception("User not found");
		}
		
		HttpClient client = new HttpClient();
		client.getParams().setParameter("http.useragent", "Test Client");
		
		createUser(client, userProfile);
	}
	
	private void createUser(HttpClient client, File userProfile) throws Exception{
		Properties properties = new Properties();
		properties.load(new FileInputStream(userProfile));
		
		String userXml = getFormattedMessage(XML_SKELETON_PATH + "/" + REGISTRATION + ".xml", properties);
		ByteArrayPartSource baps = new ByteArrayPartSource("Registration.xml", userXml.getBytes());  
		
		Part[] parts = { 
				new StringPart("messageType", REGISTRATION),
				new StringPart("requestType", "register"),
				new StringPart("userName", properties.getProperty("USERNAME")),
				new StringPart("password", properties.getProperty("PASSWORD")),

				new FilePart("message", baps) 
		};		
		String response = postToHttpServiceAsMultipart(client, SERVER_URL + "/MessageServlet", parts);		
		System.out.println("User Register Response: " + response);		
	}
}