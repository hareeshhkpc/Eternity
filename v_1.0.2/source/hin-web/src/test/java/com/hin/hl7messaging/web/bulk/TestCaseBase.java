/**
 * 
 */
package com.hin.hl7messaging.web.bulk;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Properties;

import javax.xml.xpath.XPathConstants;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.httpclient.methods.ByteArrayRequestEntity;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.RequestEntity;
import org.apache.commons.httpclient.methods.multipart.MultipartRequestEntity;
import org.apache.commons.httpclient.methods.multipart.Part;
import org.apache.http.client.ClientProtocolException;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.hin.hl7messaging.utils.XMLHelper;

/**
 * @author Administrator
 *
 */
public class TestCaseBase {

	public static final String SERVER_URL = "http://localhost:8088/hin-web/";
	public static final String XML_SKELETON_PATH = "src/main/webapp/transformers";
	
	public static final String REGISTRATION = "PRPA_IN000001";
	public static final String ENCOUNTER = "PRPA_IN400000";
	public static final String APPOINTMENT = "PRPA_IN410001";
	public static final String ORGANIZATION = "COCT_MT150000";
	
	protected String getFormattedMessage(String messageFileName, Properties properties) throws Exception{
		Document document = XMLHelper.getXMLDocument(new File(messageFileName));
		if(document == null){
			return null;
		}
		
		Enumeration<String> xpaths = (Enumeration<String>) properties.propertyNames();
		while(xpaths.hasMoreElements()){
			String xpath = xpaths.nextElement();
			
			if(xpath.equals("USERNAME") || xpath.equals("PASSWORD")){
				continue;
			}
			
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
	
	protected String postToHttpServiceAsURLEncoded(HttpClient client, String url, HashMap<String, String> params) {
		
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
	
	protected String postToHttpServiceAsMultipart(HttpClient client, String url, Part[] parts) {
		
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
	
	protected String postToHttpServiceAsMultipartOnlyBody(String url, String content) throws ClientProtocolException,
			IOException {

		PostMethod post = new PostMethod(url);
		RequestEntity entity = new ByteArrayRequestEntity(content.getBytes(), "text/xml; charset=ISO-8859-1");
		post.setRequestEntity(entity);
		// Get HTTP client
		HttpClient httpclient = new HttpClient();
		// Execute request
		try {
			int result = httpclient.executeMethod(post);
			// Display status code
			System.out.println("Response status code: " + result);
			// Display response
			System.out.println("Response body: ");
			String response = post.getResponseBodyAsString();
			System.out.println(response);
		} finally {
			// Release current connection to the connection pool once you are
			// done
			post.releaseConnection();
		}
		return null;
	}
	
}
