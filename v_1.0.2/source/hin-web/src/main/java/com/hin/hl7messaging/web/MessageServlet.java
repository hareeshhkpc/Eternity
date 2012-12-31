/*package com.hin.hl7messaging.web;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.xpath.XPathConstants;

import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.log4j.Logger;
import org.w3c.dom.DOMException;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;

import com.hin.hl7messaging.HinUserProfile;
import com.hin.hl7messaging.MessageService;
import com.hin.hl7messaging.api.IMessageService;
import com.hin.hl7messaging.config.HINConfigurationProperty;
import com.hin.hl7messaging.context.HINApplicationContext;
import com.hin.hl7messaging.utils.CalendarVO;
import com.hin.hl7messaging.utils.MessageType;
import com.hin.hl7messaging.utils.XMLHelper;
import com.hin.hl7messaging.vo.HINRequest;
import com.hin.hl7messaging.vo.HINResponse;
import com.hin.hl7messaging.vo.MultipartHandler;
import com.hin.hl7messaging.web.service.PresentationService;

public class MessageServlet extends HttpServlet {
	*//**
	 * serialVersionUID
	 *//*
	private static final long serialVersionUID = 2931570456504570473L;
	private IMessageService messageService = new MessageService();
	private PresentationService presentationService = new PresentationService();
	private Logger logger = Logger.getLogger(MessageServlet.class.getName());

	protected void processRequest(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.addHeader("Cache-Control", "no-cache");
		response.addHeader("Pragma", "no-cache");
		response.addIntHeader("Expires", 0);
		String profileID = null, messageID = null, message = null;
		MessageType messageType = MessageType.ENTITY;

		response.setContentType("text/xml;charset=UTF-8");
		PrintWriter out = response.getWriter();
		MultipartHandler handler = null;
		if (request.getAttribute("handler") != null) {
			handler = (MultipartHandler) request.getAttribute("handler");

		} else if (handler == null) {
			handler = new MultipartHandler(request);
			if (!ServletFileUpload.isMultipartContent(request)) {
				out.println("Only multipart content is supported.");
			}

			try {
				handler.parse();
			} catch (Exception e) {
				System.out.println("Error in parsing multipart request: ");
				logger.error("Error in parsing multipart request: "+e.getMessage());
				return;
			}

		}
		HinUserProfile hinUserProfile = HINSession.getHINSession(
				request.getSession()).getHinUserProfile();
		HINRequest hinRequest = new HINRequest();

		String requestType = handler.getParameter("requestType");
		if (requestType != null && requestType.equals("newTask")) {
			// hinRequest.setAssignedToWhom(handler.getParameter("assignedToWhom"));
			if(hinUserProfile.getKey() ==null|| hinUserProfile.getKey().length()==0){
				out.println("Session Expired.Please login again.");
				return;
			}
			hinRequest.setAssignedToWhom(handler.getParameter("assignedToWhom"));
			hinRequest.setAssignedToOrg(handler.getParameter("assignedToOrg"));
			hinRequest.setProfileID(handler.getParameter("assignedToWhom"));
			hinRequest.setMessage(handler.getParameter("message"));
			hinRequest.setMessageType(handler.getParameter("artifactID"));
			HINResponse hinResponse = new HINResponse();

			if (hinRequest.getMessage() == null
					|| hinRequest.getMessage().length() < 1) {
				response.setStatus(HttpServletResponse.SC_NO_CONTENT);
				out.println("Required parameters are missing.");
				return;
			}

			//System.out.println("Received Message: ");
			//System.out.println(hinRequest.getMessage());

			try {
				presentationService.assignNewTask(hinRequest, hinResponse);
			} catch (Exception e) {
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				out.println("An error occured while saving the message: "
						+ e.getMessage());
				logger.error("Fail to save Message: "+e.getMessage());
			}
			 Document xmlDocument = XMLHelper.getXMLDocument(handler.getParameter("message"));
			 String submittingMessageType = (String) XMLHelper.read(xmlDocument,
						"name(/*)", XPathConstants.STRING);
			 
	  	    String eventArtifact = HINApplicationContext.getHINApplicationContext().getConfigurationParameter(HINConfigurationProperty.CALENDAR_EVENT_ARTIFACT);
			if(submittingMessageType.equals(eventArtifact)){
				String str=hinUserProfile.getHinOrgUserProfileList().get(0).getOrgId();
				saveAppointmentEvent(hinUserProfile.getKey(),handler.getParameter("message"));
			}
			
		}else if (requestType != null && requestType.equals("hinNewTask")) {
						hinRequest.setAssignedToWhom(handler.getParameter("assignedToWhom"));
						//hinRequest.setAssignedToWhom(hinUserProfile.getKey());
						hinRequest.setAssignedToOrg(handler.getParameter("assignedToOrg"));
						hinRequest.setProfileID(hinUserProfile.getKey());
						hinRequest.setMessage(handler.getParameter("message"));
						hinRequest.setMessageType(handler.getParameter("artifactID"));
						HINResponse hinResponse = new HINResponse();

						if (hinRequest.getMessage() == null
								|| hinRequest.getMessage().length() < 1) {
							response.setStatus(HttpServletResponse.SC_NO_CONTENT);
							out.println("Required parameters are missing.");
							return;
						}

						System.out.println("Received Message: ");
						System.out.println(hinRequest.getMessage());

						try {
							presentationService.assignNewHinTask(hinRequest, hinResponse);
						} catch (Exception e) {
							response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
							out.println("An error occured while saving the message: "
									+ e.getMessage());
							logger.error("Fail to save Message: "+e.getMessage());
						}
						 Document xmlDocument = XMLHelper.getXMLDocument(handler.getParameter("message"));
						 String submittingMessageType = (String) XMLHelper.read(xmlDocument,
									"name(/*)", XPathConstants.STRING);
						 
				  	    String eventArtifact = HINApplicationContext.getHINApplicationContext().getConfigurationParameter(HINConfigurationProperty.CALENDAR_EVENT_ARTIFACT);
						if(submittingMessageType.equals("PRPA_IN410001") || submittingMessageType.equals("PRPA_IN400000")){
							saveAppointmentEvent(hinUserProfile.getKey(),handler.getParameter("message"));
						}
		}else if (requestType != null && requestType.equals("assignedTask")){
			//TODO
			 hinRequest.setProfileID(handler.getParameter("profileID"));
			 hinRequest.setUserName(hinUserProfile.getKey());
			 hinRequest.setMessageID(handler.getParameter("messageID"));
			 hinRequest.setMessage(handler.getParameter("message"));
			 hinRequest.setTaskId(handler.getParameter("taskID"));
			 hinRequest.setOutCome(handler.getParameter("outcome"));
			 hinRequest.setAssigneType(handler.getParameter("assigneType"));
			 hinRequest.setAssignedToWhom(handler.getParameter("assignedToWhom"));
			 hinRequest.setAssignedToOrg(handler.getParameter("assignedToOrg"));
			 System.out.println("Test");
			 try{
			presentationService.assignSignalTask(hinRequest);
			 }catch(Exception ex){
				System.out.println("Error in completing task :"+ex.getMessage());
				logger.error("Fail to Complete Task: "+ex.getMessage());
			 }
			 
			 Document xmlDocument = XMLHelper.getXMLDocument(handler.getParameter("message"));
			 String submittingMessageType = (String) XMLHelper.read(xmlDocument,
						"name(/*)", XPathConstants.STRING);
			 
	  	    String eventArtifact = HINApplicationContext.getHINApplicationContext().getConfigurationParameter(HINConfigurationProperty.CALENDAR_EVENT_ARTIFACT);
			if(submittingMessageType.equals("PRPA_IN410001")){
				saveAppointmentEvent(handler.getParameter("assignedToWhom"),handler.getParameter("message"));
			}
		}
	}
    
	public void saveAppointmentEvent(String profileId,String message){
		//System.out.println("Error in completing task :"+profileId);
		String eventXpath = HINApplicationContext.getHINApplicationContext().getConfigurationParameter(HINConfigurationProperty.CALENDAR_EVENT_READ_XPATH);
		//String xPath="//controlActProcess/subject/encounterEvent/effectiveTime/@value";
		 Document xmlDocument = XMLHelper.getXMLDocument(message);
		 String submittingMessageType = (String) XMLHelper.read(xmlDocument,
					"name(/*)", XPathConstants.STRING);
		if(submittingMessageType.equals("PRPA_IN410001")){
		eventXpath ="//controlActProcess/subject/encounterAppointment/effectiveTime/@value";
		}
		Document messageDocument = XMLHelper.getXMLDocument(message);
		NodeList  appointmentDate= (NodeList) XMLHelper.read(messageDocument,eventXpath, XPathConstants.NODESET);
		if(appointmentDate.getLength()>0){
		SimpleDateFormat objDate=new SimpleDateFormat("yyyyMMddHHmm");
		
		String patientID="";
		if(submittingMessageType.equals("PRPA_IN410001")){//Patient Profile ID
			patientID = (String) XMLHelper.read(xmlDocument, "//controlActProcess/subject/encounterAppointment/subject/patient/id/@root",
				XPathConstants.STRING);
		}
		if(profileId!=null && profileId.length()>0 && !profileId.equals("0")){
		CalendarVO calendarVO=null;
		try {
			if(objDate.parse(appointmentDate.item(0).getNodeValue())!=null && !objDate.parse(appointmentDate.item(0).getNodeValue()).equals("") ){
			calendarVO = new CalendarVO(profileId,patientID,"APPOINTMENT", objDate.parse(appointmentDate.item(0).getNodeValue()), false);
			}
		} catch (DOMException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ParseException e) {
			logger.error("An error occur while parsing: "+e.getMessage());
		}
		//messageService.calenderEvents(profileId, calendarVO);
		}
		}
	}
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.addHeader("Cache-Control", "no-cache");
		response.addHeader("Pragma", "no-cache");
		response.addIntHeader("Expires", 0);
		processRequest(request, response);
	}

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.addHeader("Cache-Control", "no-cache");
		response.addHeader("Pragma", "no-cache");
		response.addIntHeader("Expires", 0);
		processRequest(request, response);
	}

	 To whom decide by user or workflow 
	// TODO
	public String getProfileId(String profileId) {
		if (profileId.equals("2.16.840.1.113883.2.4.6.3")) {
			return "2.16.840.1.113883.8.6.6";
		} else if (profileId.equals("2.16.840.1.113883.8.6.6")) {
			return "2.16.840.1.113883.2.4.6.3";
		} else if (profileId.equals("2.16.840.1.113883.8.4.5")) {
			return "2.16.840.1.113883.8.6.6";
		}
		return "2.16.840.1.113883.8.4.5";
	}
}
*/