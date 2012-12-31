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

public class EncounterMessageTest {
	
	public static final String SERVER_URL = "http://localhost:8080/hin-web";

	@Test
	public void testCreateEncounter() throws Exception{
		HttpClient client = new HttpClient();
		client.getParams().setParameter("http.useragent", "Test Client");
		String userXml = getFormattedMessage("src/main/webapp/transformers/test-case-input/PRPA_IN400000.xml", 
				"src/main/webapp/transformers/test-case-input/PRPA_IN400000.properties");
		ByteArrayPartSource baps = new ByteArrayPartSource("Registration.xml", userXml.getBytes());
		
		Part[] parts = { 
				new StringPart("assignedToWhom", "his4user1demo"),	
				new StringPart("messageID", "PRPA_IN400000"),
				new StringPart("messageType", "PRPA_IN400000"),
				new StringPart("requestType", "newTask"),
				new StringPart("artifactID", "PRPA_IN400000"),
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