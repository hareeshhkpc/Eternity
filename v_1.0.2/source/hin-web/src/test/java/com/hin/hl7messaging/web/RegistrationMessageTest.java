package com.hin.hl7messaging.web;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Properties;

import javax.xml.xpath.XPathConstants;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.multipart.ByteArrayPartSource;
import org.apache.commons.httpclient.methods.multipart.FilePart;
import org.apache.commons.httpclient.methods.multipart.MultipartRequestEntity;
import org.apache.commons.httpclient.methods.multipart.Part;
import org.apache.commons.httpclient.methods.multipart.StringPart;
import org.junit.Test;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.hin.hl7messaging.utils.XMLHelper;

public class RegistrationMessageTest {
	
	public static final String SERVER_URL = "http://102.1.51:8080/hin-web";
	
	@Test
	public void testCreateOrg() throws Exception{
		HttpClient client = new HttpClient();
		client.getParams().setParameter("http.useragent", "Test Client");

		String userXml = getFormattedMessage("src/main/webapp/transformers/test-case-input/Organization.xml", 
				"src/main/webapp/transformers/test-case-input/Organization.properties");
		ByteArrayPartSource baps = new ByteArrayPartSource("Registration.xml", userXml.getBytes());  
		
		Part[] parts = { 
				new StringPart("messageType", "COCT_MT150000"),
				new StringPart("requestType", "register"),
				new StringPart("userName", "zonare"),
				new StringPart("password", "demo"),

				new FilePart("message", baps) 
		};		
		String response = postToHttpServiceAsMultipart(client, SERVER_URL + "/MessageServlet", parts);		
		System.out.println("Org Register Response: " + response);		
	}
	
	@Test
	public void testCreateEmployee() throws Exception{

		HttpClient client = new HttpClient();
		client.getParams().setParameter("http.useragent", "Test Client");
		
		String userXml = getFormattedMessage("src/main/webapp/transformers/test-case-input/User.xml", 
				"src/main/webapp/transformers/test-case-input/Employee.properties");
		ByteArrayPartSource baps = new ByteArrayPartSource("Registration.xml", userXml.getBytes());  
		
		String response = "";
		Part[] parts = new Part[]{ 
				new StringPart("orgUserId", "his4demo"),	
				new StringPart("messageType", "PRPA_IN000001"),
				new StringPart("requestType", "linkedProfileRegistration"),

				new FilePart("message", baps) 
		};
		
		response = postToHttpServiceAsMultipart(client, SERVER_URL + "/MessageServlet", parts);
		
		System.out.println("Linked Profile Register Response: " + response);
		
		if(response == null || response.length() < 1){
			System.out.println("Linked porfile registration failed.");
			return;
		}
		
		response = postToHttpServiceAsURLEncoded(client, response, new HashMap<String, String>());
		System.out.println("Activation URL Response: " + response);
		
		// Create a new user and link his profile with org profile
		userXml = getFormattedMessage("src/main/webapp/transformers/test-case-input/User.xml", 
				"src/main/webapp/transformers/test-case-input/User.properties");
		baps = new ByteArrayPartSource("Registration.xml", userXml.getBytes());
		parts = new Part[]{ 
				new StringPart("messageType", "PRPA_IN000001"),
				new StringPart("requestType", "registerOrgUser"),
				new StringPart("userName", "his4user3"),
				new StringPart("password", "demo"),

				new FilePart("message", baps) 
		};
		response = postToHttpServiceAsMultipart(client, SERVER_URL + "/MessageServlet", parts);
		System.out.println("User Account creation response: " + response);
	}
	
	@Test
	public void testCreateUser() throws Exception{
		HttpClient client = new HttpClient();
		client.getParams().setParameter("http.useragent", "Test Client");
		String userXml = getFormattedMessage("src/main/webapp/transformers/test-case-input/User.xml", 
				"src/main/webapp/transformers/test-case-input/User.properties");
		ByteArrayPartSource baps = new ByteArrayPartSource("Registration.xml", userXml.getBytes());
		Part[] parts = new Part[]{ 
				new StringPart("messageType", "PRPA_IN000001"),
				new StringPart("requestType", "registerOrgUser"),
				new StringPart("userName", "his4user4"),
				new StringPart("password", "demo"),

				new FilePart("message", baps) 
		};
		String response = postToHttpServiceAsMultipart(client, SERVER_URL + "/MessageServlet", parts);
		System.out.println("User Account creation response: " + response);
	}
	
	@Test
	public void testMessageCreate() throws Exception{
		String message = getFormattedMessage("src/main/webapp/transformers/test-case-input/Hospital.xml", "src/main/webapp/transformers/test-case-input/Organization.properties");
		System.out.println("Messsage: \n" + message);
	}
	
	@Test
	public void testGetFormattedMessage() throws Exception, IOException{
		Properties properties = new Properties();
		properties.setProperty("COCT_MT150000/user/@type", "HOSPITAL");
		properties.setProperty("COCT_MT150000/id/@extension", "HIN");
		properties.setProperty("COCT_MT150000/id/@root", "his2demo");
		properties.setProperty("COCT_MT150000/name/prefix", "Polyclinic");
		properties.setProperty("COCT_MT150000/name/given", "Diagnostic");
		properties.setProperty("COCT_MT150000/name/family", "Center");
		properties.setProperty("COCT_MT150000/telecom/@use", "admin.his2@imtacict.com");

		properties.store(new FileOutputStream("src/main/webapp/transformers/test-case-input/Organization.properties"), "Org");
		
		properties = new Properties();
		properties.load(new FileInputStream("src/main/webapp/transformers/test-case-input/Organization.properties"));
		System.out.println(properties);
	}
		
	private String getFormattedMessage(String messageFileName, String propsFile) throws Exception{
		Document document = XMLHelper.getXMLDocument(new File(messageFileName));
		if(document == null){
			return null;
		}
		
		Properties properties = new Properties();
		properties.load(new FileInputStream(propsFile));
		
		Enumeration<String> xpaths = (Enumeration<String>) properties.propertyNames();
		while(xpaths.hasMoreElements()){
			String xpath = xpaths.nextElement();
			String value = properties.getProperty(xpath);
			NodeList list = (NodeList) XMLHelper.read(document, xpath, XPathConstants.NODESET);
			if(list.item(0).getNodeType() == Node.ATTRIBUTE_NODE){
				//System.out.println(list.item(0).getNodeName() + "=" + list.item(0).getNodeValue());
				list.item(0).setNodeValue(value);
				//System.out.println(list.item(0).getNodeName() + "=" + list.item(0).getNodeValue());
			} else {
				Node firstChild = list.item(0).getFirstChild();
				if(firstChild == null){
					firstChild = document.createTextNode(value);
					list.item(0).appendChild(firstChild);
				} else {
					list.item(0).getFirstChild().setNodeValue(value);
				}
				//System.out.println(list.item(0).getNodeName() + "=" + list.item(0).getFirstChild().getNodeValue());
			}
		}
		
		return XMLHelper.getXMLDocumentAsString(document);
	}
	
	private String getMessage(String messageFileName) throws Exception{
		
		String line = null;
		
		StringBuffer buffer = new StringBuffer();
		
		BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(messageFileName)));
		while((line = br.readLine()) != null){
			buffer.append(line);
		}
		
		br.close();
		
		return buffer.toString();
	}

	private String postToHttpServiceAsURLEncoded(HttpClient client, String url, HashMap<String, String> params) {
		
		BufferedReader br = null;
		
		PostMethod method = new PostMethod(url);
		
		NameValuePair[] parametersBody = new NameValuePair[params.size()];
		int count = 0;
		for(String param : params.keySet()){
			parametersBody[count++] = new NameValuePair(param, params.get(param));
		}
		method.setRequestBody(parametersBody);

		try {
			int returnCode = client.executeMethod(method);

			if (returnCode == HttpStatus.SC_NOT_IMPLEMENTED) {
				System.err
						.println("The Post method is not implemented by this URI");
				// still consume the response body
				return method.getResponseBodyAsString();
			} else if(method.getResponseHeader("location") != null 
					&& method.getResponseHeader("location").getValue() != null
					&& !method.getResponseHeader("location").getValue().equals("")){
				return method.getResponseHeader("location").getValue();
			} else {
				StringBuffer buf = new StringBuffer();
				br = new BufferedReader(new InputStreamReader(
						method.getResponseBodyAsStream()));
				String readLine;
				while (((readLine = br.readLine()) != null)) {
					System.err.println(readLine);
					buf.append(readLine);
				}
				return buf.toString();
			}
		} catch (Exception e) {
			System.err.println(e);
		} finally {
			method.releaseConnection();
			if (br != null)
				try {
					br.close();
				} catch (Exception fe) {
				}
		}
		return null;
	}
	
	private String postToHttpServiceAsMultipart(HttpClient client, String url, Part[] parts) {
		
		BufferedReader br = null;
		
		PostMethod method = new PostMethod(url);
		
		method.setRequestEntity(new MultipartRequestEntity(parts, method.getParams()));

		try {
			int returnCode = client.executeMethod(method);

			if (returnCode == HttpStatus.SC_NOT_IMPLEMENTED) {
				System.err
						.println("The Post method is not implemented by this URI");
				// still consume the response body
				return method.getResponseBodyAsString();
			} else if(method.getResponseHeader("location") != null 
					&& method.getResponseHeader("location").getValue() != null
					&& !method.getResponseHeader("location").getValue().equals("")){
				return method.getResponseHeader("location").getValue();
			} else {
				StringBuffer buf = new StringBuffer();
				br = new BufferedReader(new InputStreamReader(
						method.getResponseBodyAsStream()));
				String readLine;
				while (((readLine = br.readLine()) != null)) {
					System.err.println(readLine);
					buf.append(readLine);
				}
				return buf.toString();
			}
		} catch (Exception e) {
			System.err.println(e);
		} finally {
			method.releaseConnection();
			if (br != null)
				try {
					br.close();
				} catch (Exception fe) {
				}
		}
		return null;
	}
}