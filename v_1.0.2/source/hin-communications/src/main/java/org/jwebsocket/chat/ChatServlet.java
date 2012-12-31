package org.jwebsocket.chat;

import java.io.File;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.apache.log4j.Logger;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.google.gson.Gson;

public class ChatServlet extends HttpServlet{
	
	private Logger logger = Logger.getLogger(ChatServlet.class.getName());

	protected void processRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		response.setContentType("text/xml;charset=UTF-8");
		hinRequestJson(request,response);			
	}
	private void hinRequestJson(HttpServletRequest request,HttpServletResponse response){
		Gson gson = new Gson();
		MessageRequest msgReq = gson.fromJson(request.getParameter("data"),
				MessageRequest.class);
		if (msgReq != null && msgReq.getRequestType().equals("oldsession")) {
			 //String fileName =msgReq.getProfileId()+"-"+msgReq.getFileName();
		     String path = msgReq.getPath()+"/"+msgReq.getDirectory();
		     File dir = new File(path);
             File[] files = dir.listFiles();
             StringBuffer strb = new StringBuffer();
		     try {
		    	 for(File file : files)
	             {
	            	 if(msgReq.getProfileId().equals(file.getName().split("-")[0])){
	            		 DateFormat formatter ; 
	            		 Date date ; 
	            		 formatter = new SimpleDateFormat("yyyy-dd-mm");
	            		 date = (Date)formatter.parse(msgReq.getDirectory()); 
	            		 formatter = new SimpleDateFormat("E, dd MMM yyyy");
	            		 String dateFormat = formatter.format(date);
	            		strb.append("<h3>"+dateFormat+" "+file.getName().split("-")[1]+":"+file.getName().split("-")[2]+"</h3>");
						strb.append(readMessage(path+"/"+file.getName()));
						//strb.append("<hr>");
	            	 }
	             }
		    	msgReq.setMessages(strb.toString());
		 		String jsonFormat;
		 		jsonFormat = gson.toJson(msgReq);
		 		response.getWriter().println(jsonFormat);		 		
			} catch (Exception e) {				
				logger.error("Error in converting message from gson to json format: "+e.getMessage());
			}
		} else {
			
		}
	}
	public StringBuffer  readMessage(String filePath) throws Exception {
		StringBuffer  message = new StringBuffer();
	    try {
	    	 
	    	File fXmlFile = new File(filePath);
			DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
			DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
			Document doc = dBuilder.parse(fXmlFile);
			doc.getDocumentElement().normalize();
			
			//System.out.println("Root element :" + doc.getDocumentElement().getNodeName());
			NodeList nList = doc.getElementsByTagName("charting");
			//System.out.println("-----------------------"); 
		
			for (int temp = 0; temp < nList.getLength(); temp++) {
				
			   Node nNode = nList.item(temp);
			   if (nNode.getNodeType() == Node.ELEMENT_NODE) {
			      Element eElement = (Element) nNode;
			     // System.out.println(getTagValue("sender", eElement)+ " : " + getTagValue("message", eElement));
			      String username = getTagValue("sender", eElement);
			      String msg = getTagValue("message", eElement);
			      message.append("<div class=\"chatboxmessage\"><div class=\"chatimage\"></div><span class=\"chatboxmessagefrom\">"+username+":&nbsp;&nbsp;</span><br><span class=\"chatboxmessagecontent\">"+msg+"</span><hr style=\"margin-bottom: 8px;width: 97%;\"></div>");
			   }
			}
		  } catch (Exception e) {
			logger.error("An error occured while parsing the file: "+e.getMessage());
		  }
		  return message;
	  }
	 private static String getTagValue(String sTag, Element eElement) {
		NodeList nlList = eElement.getElementsByTagName(sTag).item(0).getChildNodes();
	 
	        Node nValue = (Node) nlList.item(0);
	 
		return nValue.getNodeValue();
	  }
	
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		try {
			processRequest(request, response);
		} catch (Exception e) {
			logger.error("Failure in process request:"+e.getMessage());
		}
	}

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		try {
			processRequest(request, response);
		} catch (Exception e) {
			logger.error("Failure in process request:"+e.getMessage());
		}
	}

}
