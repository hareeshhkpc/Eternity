package com.hin.hl7messaging.web.bulk;

import java.io.File;
import java.io.FileInputStream;
import java.io.FilenameFilter;
import java.util.HashMap;
import java.util.Properties;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.multipart.ByteArrayPartSource;
import org.apache.commons.httpclient.methods.multipart.FilePart;
import org.apache.commons.httpclient.methods.multipart.Part;
import org.apache.commons.httpclient.methods.multipart.StringPart;
import org.junit.Test;

import com.google.gson.Gson;
import com.hin.hl7messaging.vo.HINRequest;

public class RegistrationMessageTest extends TestCaseBase {
	
	/*@Test
	public void testLogin() throws Exception{
		HttpClient client = new HttpClient();
		client.getParams().setParameter("http.useragent", "Test Client");
		
		testLoginUser(client, "his4user1", "demo");
		System.out.println("User logged in.");
	}*/
	
	
	
	@Test
	public void testBulkImport() throws Exception{
		File folder = new File("src/main/webapp/transformers/test-case-input/bulk");
		File org = new  File(folder.getAbsolutePath() + "/ORGANIZATION.properties");
		if(!org.exists()){
			throw new Exception("Organization not found");
		}
		
		HttpClient client = new HttpClient();
		client.getParams().setParameter("http.useragent", "Test Client");

		testCreateOrg(client, org);		
		
		Properties properties = new Properties();
		properties.load(new FileInputStream(org));		
		
		File[] employeeProfiles = folder.listFiles(new FilenameFilter() {
			
			@Override
			public boolean accept(File file, String fileName) {
				return fileName.startsWith("EMPLOYEE");
			}
		});
		
		for (int i = 0; i < employeeProfiles.length; i++) {
			File profile = employeeProfiles[i];
			String userName = profile.getName().substring(profile.getName().indexOf("_") + 1);
			userName = userName.substring(0, userName.lastIndexOf("."));
			File user = new File(folder.getAbsolutePath() + "/USER_" + userName + ".properties");
			if(!user.exists()){
				continue;
			}
			
			client = new HttpClient();
			client.getParams().setParameter("http.useragent", "Test Client");
			
			testLoginUser(client, properties.getProperty("USERNAME"), properties.getProperty("PASSWORD"));
			testCreateEmployee(client, org, profile, user);
		}
	}
	
	private HttpClient testLoginUser(HttpClient client, String user, String pass) throws Exception{		
		
		HINRequest hinReq = new HINRequest();
		hinReq.setPassword(pass);
		hinReq.setUserName(user);
		hinReq.setRequestType("login");
				
		HashMap<String, String> params = new HashMap<String, String>();
		params.put("data", new Gson().toJson(hinReq));
		
		String response = postToHttpServiceAsURLEncoded(client, SERVER_URL + "/MessageServlet", params);		
		System.out.println("Org Register Response: " + response);
		return client;
	}
	
	private void testCreateOrg(HttpClient client, File orgProfile) throws Exception{
		Properties properties = new Properties();
		properties.load(new FileInputStream(orgProfile));
		
		String userXml = getFormattedMessage(XML_SKELETON_PATH + "/" + ORGANIZATION + ".xml", properties);
		ByteArrayPartSource baps = new ByteArrayPartSource("Registration.xml", userXml.getBytes());  
		
		Part[] parts = { 
				new StringPart("messageType", ORGANIZATION),
				new StringPart("requestType", "registerOrgUser"),
				new StringPart("userName", properties.getProperty("USERNAME")),
				new StringPart("password", properties.getProperty("PASSWORD")),

				new FilePart("message", baps) 
		};		
		String response = postToHttpServiceAsMultipart(client, SERVER_URL + "/MessageServlet", parts);		
		System.out.println("Org Register Response: " + response);		
	}
	
	private void testCreateEmployee(HttpClient client, File employerProfile, File employeeProfile, File userProfile) throws Exception{
		Properties propertiesEmployer = new Properties();
		propertiesEmployer.load(new FileInputStream(employerProfile));
		Properties propertiesEmployee = new Properties();
		propertiesEmployee.load(new FileInputStream(employeeProfile));
		Properties propertiesUser = new Properties();
		propertiesUser.load(new FileInputStream(userProfile));
		
		String userXml = getFormattedMessage(XML_SKELETON_PATH + "/" + REGISTRATION + ".xml", propertiesEmployee);
		ByteArrayPartSource baps = new ByteArrayPartSource("Registration.xml", userXml.getBytes());  
		
		String response = "";
		Part[] parts = new Part[]{ 
				new StringPart("orgUserId", propertiesEmployer.getProperty("USERNAME") + propertiesEmployer.getProperty("PASSWORD")),	
				new StringPart("messageType", REGISTRATION),
				new StringPart("requestType", "linkedProfileRegistration"),

				new FilePart("message", baps) 
		};
		
		response = postToHttpServiceAsMultipart(client, SERVER_URL + "/MessageServlet", parts);
		
		System.out.println("Linked Profile Register Response: " + response);
		
		if(response == null || response.length() < 1){
			System.out.println("Linked porfile registration failed.");
			throw new Exception("Linked profile creation failed for: " + propertiesEmployee.getProperty("USERNAME"));
		}
		
		response = postToHttpServiceAsURLEncoded(client, response, new HashMap<String, String>());
		System.out.println("Activation URL Response: " + response);
		
		client = new HttpClient();
		client.getParams().setParameter("http.useragent", "Test Client");
		
		// Create a new user and link his profile with org profile
		userXml = getFormattedMessage(XML_SKELETON_PATH + "/" + REGISTRATION + ".xml", propertiesUser);
		baps = new ByteArrayPartSource("Registration.xml", userXml.getBytes());
		parts = new Part[]{ 
				new StringPart("messageType", REGISTRATION),
				new StringPart("requestType", "register"),
				new StringPart("userName", propertiesUser.getProperty("USERNAME")),
				new StringPart("password", propertiesUser.getProperty("PASSWORD")),

				new FilePart("message", baps) 
		};
		response = postToHttpServiceAsMultipart(client, SERVER_URL + "/MessageServlet", parts);
		System.out.println("User Account creation response: " + response);
	}
}