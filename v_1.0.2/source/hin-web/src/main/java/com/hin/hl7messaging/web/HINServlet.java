/*package com.hin.hl7messaging.web;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.httpclient.DefaultHttpMethodRetryHandler;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.params.HttpMethodParams;
import org.apache.log4j.Logger;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.hin.hl7.messaging.api.IMessageRepository;
import com.hin.hl7messaging.HinUserProfile;
import com.hin.hl7messaging.IdentityEngine.IdentityProcessor;
import com.hin.hl7messaging.IdentityServices.IIdentityProcessor;
import com.hin.hl7messaging.config.HINConfigurationProperty;
import com.hin.hl7messaging.configuration.ConfigurationReader;
import com.hin.hl7messaging.context.HINApplicationContext;
import com.hin.hl7messaging.domain.MessageTypeDefinition;
import com.hin.hl7messaging.utils.Action;
import com.hin.hl7messaging.vo.HINRequest;
import com.hin.hl7messaging.vo.HINResponse;
import com.hin.hl7messaging.vo.MultipartHandler;
import com.hin.hl7messaging.web.service.PresentationService;
import com.hin.hl7messaging.web.service.api.IPresentationService;

public class HINServlet extends HttpServlet {

	private HINRequest hinRequest = null;
	private HINResponse hinResponse = null;
	private Action action = null;

	private IPresentationService presentationService = null;
	private IIdentityProcessor identityProcessor = null;
	private Logger logger = Logger.getLogger(HINServlet.class.getName());
	private HINSession hinSession = null;

	protected void processRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		response.addHeader("Cache-Control", "no-cache");
		response.addHeader("Pragma", "no-cache");
		response.addIntHeader("Expires", 0);
		hinSession = HINSession.getHINSession(request.getSession());
		response.setContentType("text/xml;charset=UTF-8");
		hinResponse = new HINResponse();
		hinRequestJson(request);
		process(request);
		hinResponseGson(response);
	}

	private void process(HttpServletRequest request) {

		if (hinRequest != null) {
			action = hinRequest.getAction();
			logger.info("Controller Action : " + action.name());
			
			 * logger.debug("Login debug======================="); logger.info(
			 * "info msg#####################################################");
			 * logger.debug("Sample debug message");
			 * logger.info("Sample info message");
			 * logger.warn("Sample warn message");
			 * logger.error("Sample error message");
			 
			try {
				switch (action ) {

				
				 * case LOGIN: presentationService.retrieveProfile(hinRequest,
				 * hinResponse, getServletContext(),hinSession); break;
				 
				
				 * case PROFILE: presentationService.retrieveProfile(hinRequest,
				 * hinResponse, getServletContext()); break;
				 

				case INBOX:
					presentationService.retrieveInboxMessages(hinRequest,
							hinResponse, getServletContext(), hinSession);
					break;
				case HISTORY:
					presentationService.retrieveHistoryMessages(hinRequest,
							hinResponse, getServletContext(), hinSession);
					break;
				
				 * case SAVE: // saveMessage(request, response); break; case
				 * STORE: // storeMessage(); break;
				 
				case RETRIEVE:
					presentationService.retrieveMessage(hinRequest,
							hinResponse, getServletContext());
					break;
				case LOAD:
					presentationService.laodMessage(hinRequest, hinResponse,
							getServletContext());
					break;
				case GMAP:
					presentationService.retrieveMap(hinRequest, hinResponse,
							getServletContext());
					break;
				case TEST:
					hinRequestJson(request);
					break;
				case SERVICES:
					viewServices(request);
					break;
				case STATISTICS:
					presentationService.retrieveStatistics(hinRequest,
							hinResponse, getServletContext());
					break;

				case STATISTICS_MESSAGES:
					presentationService.retrieveStatisticsMessage(hinRequest,
							hinResponse, getServletContext());
					break;

				case SELECTED_PROFILE:
					presentationService.retrieveSelectedProfile(hinRequest,
							hinResponse, getServletContext());
					break;
				case CALENDAR:
					presentationService.retrieveCalendar(hinRequest,
							hinResponse, hinSession);
					break;

				case CONTACT_REQUESTED:
					presentationService.requestToAddContact(hinRequest,
							hinResponse, hinSession);
					break;

				case CONTACT_REQUESTED_REPLY:
					presentationService.respondToAddContact(hinRequest,
							hinResponse, hinSession);
					break;
				case LOGOUT:
					presentationService.logout();
					break;
				case LINKED_PROFILE_MESSAGE:
					presentationService.retrieveLinkedProfileMessages(
							hinRequest, hinResponse, getServletContext(),
							hinSession);
					break;
				case RETRIEVEPROFILE:
					presentationService.retriveProfileImage(hinRequest,
							hinResponse, hinSession.getHinUserProfile()
									.getKey());
					break;
				case WORK_FLOW_DIAGRAM:
					presentationService.retriveWorkFlowDiagram(hinRequest,
							hinResponse,hinSession);
					break;
				case TIME_LINE:
					presentationService.retrieveTimeLine(hinRequest, hinResponse);
					
				case SELECTED_TIME_LINE:
					presentationService.retrieveSelectedTimeLine(hinRequest, hinResponse);	
					
				case SEARCH_PROFILE:
					presentationService.retreiveLoggedInUserProfileMessage(hinResponse,profileid);
					break;
				
				 * case LOADREGISTRATION:
				 * 
				 * presentationService.laodMessage(hinRequest, hinResponse,
				 * getServletContext()); break;
				 
				
				 * case GMAPLOCATIONSSAVE:
				 * identityProcessor.saveGmapLocation(handler
				 * ,hinSession.getHinUserProfile().getKey()); break;
				 
				default:

				}
			} catch (Exception e) {
				logger.error("process error: "+e.getMessage());
				hinResponse.setErrorDesc(e.getMessage());
				logger.error(" Process Failed : "+e.getMessage());
			}
		}
	}

	private void hinRequestJson(HttpServletRequest request) {
		Gson gson = new Gson();
		HINRequest hinReq = gson.fromJson(request.getParameter("data"),
				HINRequest.class);
		if (hinReq != null && hinReq.getAction() == Action.LOGIN) {
			hinRequest = new HINRequest();
			hinRequest = hinReq;
		} else {
			hinRequest = hinReq;
		}
	}

	private void hinResponseGson(HttpServletResponse response) throws Exception {
		response.addHeader("Cache-Control", "no-cache");
		response.addHeader("Pragma", "no-cache");
		response.addIntHeader("Expires", 0);
		MessageTypeDefinition definition = new MessageTypeDefinition();
		ConfigurationReader configurationReader = new ConfigurationReader();
		definition = configurationReader.setClientField();
		 hinResponse.setClientFieldsMap(definition.getClientFieldsMap()); 
		Gson gson = new Gson();
		String jsonFormat;
		jsonFormat = gson.toJson(hinResponse);
		 System.out.println("value of json format:" + jsonFormat); 
		response.getWriter().println(jsonFormat);

	}

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.addHeader("Cache-Control", "no-cache");
		response.addHeader("Pragma", "no-cache");
		response.addIntHeader("Expires", 0);
		try {
			processRequest(request, response);
		} catch (Exception e) {
			logger.error("process request failed: "+e.getMessage());
		}
	}

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.addHeader("Cache-Control", "no-cache");
		response.addHeader("Pragma", "no-cache");
		response.addIntHeader("Expires", 0);
		try {
			processRequest(request, response);
		} catch (Exception e) {
			logger.error("process request failed: "+e.getMessage());
		}
	}

	protected void viewServices(HttpServletRequest request) {
		List<Object[]> services = null;
		if (!(hinRequest.getLookupType().split("_").length > 1)) {
			String url = HINApplicationContext.getHINApplicationContext()
					.getConfigurationParameter(
							HINConfigurationProperty.HIS_LOOKUP_SERVICE)
					+ "lookupName="
					+ hinRequest.getLookupName()
					+ "&lookupType=" + hinRequest.getLookupType();
			try {
				HttpClient client = new HttpClient();
				GetMethod method = new GetMethod(url);
				method.getParams().setParameter(HttpMethodParams.RETRY_HANDLER,
						new DefaultHttpMethodRetryHandler(3, false));
				int statusCode = client.executeMethod(method);
				if (statusCode != HttpStatus.SC_OK) {
					System.err.println("Method failed: "
							+ method.getStatusLine());
					logger.warn(method.getStatusLine());
				}
				byte[] responseBody = method.getResponseBody();

				Type type = new TypeToken<List<Object[]>>() {
				}.getType();
				services = new Gson().fromJson(new String(responseBody), type);
			} catch (Exception e) {
				logger.error(e);
				hinResponse.setErrorDesc(e.toString());
				e.printStackTrace();
			}
		} else {
			try {
				if (hinRequest.getLookupType().equals("IN_GMAP_BY_ORG_NAME")) {

					services = identityProcessor.searchOrgLocation(hinRequest
							.getLookupName().toUpperCase(), hinRequest
							.getLookupType());
				} else if (hinRequest.getLookupType().equals(
						"IN_IDENTITY_REPO_BY_NAME")) {

					services = identityProcessor.searchContacts(hinRequest
							.getLookupName().toUpperCase(), hinRequest
							.getLookupType());
				}else if (hinRequest.getLookupType().equals(
						"IN_IDENTITY_REPO_BY_ORGID")) {

					services = identityProcessor.searchUsersByOrgId(hinRequest.getLookupName().toUpperCase(),hinRequest.getOrgId() );
				}
			} catch (Exception e) {
				logger.error(e);
				hinResponse.setErrorDesc(e.toString());
				e.getStackTrace();
			}
		}
		hinResponse.setServices(services);

	}

	@Override
	public void init(ServletConfig config) throws ServletException {
		// TODO Auto-generated method stub
		super.init(config);
		presentationService = new PresentationService();
		identityProcessor = new IdentityProcessor();
	}

	public IIdentityProcessor getIdentityProcessor() {
		return identityProcessor;
	}

	public void setIdentityProcessor(IIdentityProcessor identityProcessor) {
		this.identityProcessor = identityProcessor;
	}
}
*/