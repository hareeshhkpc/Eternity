package com.hin.hl7messaging.web.service.api;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.HashMap;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.hin.hl7messaging.vo.HINRequest;
import com.hin.hl7messaging.vo.HINResponse;
import com.hin.hl7messaging.web.HINSession;

public interface IPresentationService {

	/*public boolean authenicate(HINRequest hinRequest, HINResponse hinResponse,
			ServletContext servletContext) throws Exception;

	public HashMap<String, Object> retrieveProfile(HINRequest hinRequest,
			HINResponse hinResponse, ServletContext servletContext);*/

	public void retrieveInboxMessages(HINRequest hinRequest,
			HINResponse hinResponse, ServletContext servletContext,HINSession hinSession);

	public void retrieveMessage(HINRequest hinRequest, HINResponse hinResponse,
			ServletContext servletContext);

	public void retrieveMap(HINRequest hinRequest, HINResponse hinResponse,
			ServletContext servletContext);

	public void laodMessage(HINRequest hinRequest, HINResponse hinResponse,
			ServletContext servletContext);

	public void assignNewTask(HINRequest hinRequest, HINResponse hinResponse);
	
	public void logout();
	
	public void assignSignalTask(HINRequest hinRequest);
	
	public void retrieveStatistics(HINRequest hinRequest, HINResponse hinResponse,
			ServletContext servletContext) throws Exception;
	
	public void retrieveStatisticsMessage(HINRequest hinRequest,
			HINResponse hinResponse, ServletContext servletContext);
	
	public void retrieveProfile(HINRequest hinRequest,
			HINResponse hinResponse, ServletContext servletContext, HINSession hinSession);
	
	public void retrieveCalendar(HINRequest hinRequest, HINResponse hinResponse,
			HINSession hinSession);
	
	public void retrieveSelectedProfile(HINRequest hinRequest,
			HINResponse hinResponse, ServletContext servletContext) throws Exception;

	public void requestToAddContact(HINRequest hinRequest,
			HINResponse hinResponse, HINSession hinSession) throws Exception;

	public void respondToAddContact(HINRequest hinRequest,
			HINResponse hinResponse, HINSession hinSession) throws Exception;

	public void retrieveLinkedProfileMessages(HINRequest hinRequest,HINResponse hinResponse, ServletContext servletContext,HINSession hinSession);
	
	public void retrieveProfileMedicalMessages(HINRequest hinRequest,
			HINResponse hinResponse, ServletContext servletContext,HINSession hinSession);
	public void retrieveSelectedProfileMedicalMessages(HINRequest hinRequest,
			HINResponse hinResponse, ServletContext servletContext,
			String id);
	public String retreiveLoggedInUserProfileMessage(HINResponse hinResponse, String profileId);
	public void retrieveHistoryMessages(HINRequest hinRequest,
			HINResponse hinResponse, ServletContext servletContext,HINSession hinSession);

	public void retrieveStatisticalMessages(HashMap<String, Object> map,
			HINResponse hinResponse, ServletContext servletContext);
	
	public void assignNewHinTask(HINRequest hinRequest, HINResponse hinResponse);
	
	public void retriveProfileImage(HINRequest hinRequest,HINResponse hinResponse, String profileId);
	

	public void retriveWorkFlowDiagram(HINRequest hinRequest,
			HINResponse hinResponse, HINSession hinSession) throws IOException;

	public void retrieveTimeLine(HINRequest hinRequest,HINResponse hinResponse);
	//public void retrieveSelectedTimeLine(HINRequest hinRequest,HINResponse hinResponse);
}
