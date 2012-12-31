package com.hin.hl7messaging.web;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;

import org.apache.cassandra.thrift.Cassandra.system_add_column_family_args;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.multipart.ByteArrayPartSource;
import org.apache.commons.httpclient.methods.multipart.FilePart;
import org.apache.commons.httpclient.methods.multipart.MultipartRequestEntity;
import org.apache.commons.httpclient.methods.multipart.Part;
import org.apache.commons.httpclient.methods.multipart.StringPart;
import org.junit.Test;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.hin.hl7messaging.cassandra.XPATHReader;

public class ProfileUpdateTest {

	@Test
	public void updateImageTest(){
		
		HttpClient client = new HttpClient();
		client.getParams().setParameter("http.useragent", "Test Client");
		HashMap< String, String> obj=new HashMap<String, String>();
		obj.put("userName","user1");
		obj.put("password", "demo");
		obj.put("requestType", "LOGIN");
		
		//TypeToken<HashMap<String, String>> token = new TypeToken<HashMap<String, String>>(){}.getType();
		String data = new Gson().toJson(obj, new TypeToken<HashMap<String, String>>(){}.getType());
		
		//client.getParams().setParameter("data", data);
		BufferedReader br = null;
     	PostMethod method = new PostMethod("http://localhost:8080/hin-web/MessageServlet");
     	
     	method.setParameter("data", data);
		
     	Part[] parts = { 
				new StringPart("userName", "user1"),	
				new StringPart("password", "demo"),
				new StringPart("requestType", "LOGIN")
		};
		String response = postToHttpService1(client, method, parts);
		client.getParams().clear();
		System.out.println(response);
		 String image="";
		try{
		 image=getImage();
		}catch(Exception ex){
			System.out.println(ex.getMessage());
		}
		 
		 ByteArrayPartSource baps = new ByteArrayPartSource("Registration.xml", image.getBytes());
		
		parts = new Part[]{ 
				new StringPart("requestType", "profile"),
				new StringPart("imageChange","true"),	
				new StringPart("tagName", "desc"),
				new StringPart("imageXpath", "//PRPA_IN000001/controlActProcess/subject/registrationEvent/subject/identifiedEntity/identifiedPerson/desc"),
				new FilePart("profilePicture",baps) 
		};
		
		//method = new PostMethod("http://localhost:8080/hin-web/MessageServlet");
		response = postToHttpService(client, method, parts);
		System.out.println(response);
	}
	
	private String getImage()throws IOException {
		File imageFile = new File("E:/HIN/source/hin-web/src/test/java/com/hin/hl7messaging/web/IMG_4317.jpg");
		System.out.println(imageFile.getAbsolutePath());
		
		FileInputStream fis = new FileInputStream(imageFile);
		byte[] imageData = new byte[(int) imageFile.length()];
		
		fis.read(imageData);
		
		byte[] encoded = Base64.encodeBase64(imageData);
		System.out.println(new String(encoded));
		
		File imageFileTarget = new File("E:/HIN/source/hin-web/src/test/java/com/hin/hl7messaging/web/IMG_4317.jpg");
		if(imageFileTarget.exists()){
			imageFileTarget.delete();
		}
		
		FileOutputStream fos = new FileOutputStream(imageFileTarget);
		fos.write(Base64.decodeBase64(encoded));
		fos.close();
		return Base64.decodeBase64(encoded).toString();
	}
private String postToHttpService(HttpClient client, PostMethod method, Part[] parts) {
		
		BufferedReader br = null;
		
		method.setRequestEntity(new MultipartRequestEntity(parts, method.getParams()));

		try {
			int returnCode = client.executeMethod(method);

			if (returnCode == HttpStatus.SC_NOT_IMPLEMENTED) {
				System.err
						.println("The Post method is not implemented by this URI");
				// still consume the response body
				return method.getResponseBodyAsString();
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
			//method.releaseConnection();
			if (br != null)
				try {
					br.close();
				} catch (Exception fe) {
				}
		}
		return null;
	}
private String postToHttpService1(HttpClient client, PostMethod method, Part[] parts) {
	
	BufferedReader br = null;
	try {
		int returnCode = client.executeMethod(method);

		if (returnCode == HttpStatus.SC_NOT_IMPLEMENTED) {
			System.err
					.println("The Post method is not implemented by this URI");
			// still consume the response body
			return method.getResponseBodyAsString();
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
		//method.releaseConnection();
		if (br != null)
			try {
				br.close();
			} catch (Exception fe) {
			}
	}
	return null;
}
	
}
