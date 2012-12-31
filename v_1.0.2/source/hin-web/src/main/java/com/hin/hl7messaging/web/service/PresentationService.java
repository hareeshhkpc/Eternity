/*package com.hin.hl7messaging.web.service;

import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

import javax.imageio.ImageIO;
import javax.servlet.ServletContext;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathConstants;

import org.apache.commons.codec.binary.Base64;
import org.apache.log4j.Logger;
import org.w3c.dom.Document;
import org.xml.sax.SAXException;

import com.google.gson.Gson;
import com.hin.hl7messaging.MessageService;
import com.hin.hl7messaging.IdentityEngine.IdentityProcessor;
import com.hin.hl7messaging.api.IMessageService;
import com.hin.hl7messaging.config.HINConfigurationProperty;
import com.hin.hl7messaging.configuration.generator.MessageWithConfigAttrsManager;
import com.hin.hl7messaging.configuration.generator.XMLHelper;
import com.hin.hl7messaging.context.HINApplicationContext;
import com.hin.hl7messaging.service.IWorkFlowTask;
import com.hin.hl7messaging.utils.CalendarVO;
import com.hin.hl7messaging.utils.TaskVO;
import com.hin.hl7messaging.utils.TimeLineVO;
import com.hin.hl7messaging.vo.HINRequest;
import com.hin.hl7messaging.vo.HINResponse;
import com.hin.hl7messaging.vo.Statistics;
import com.hin.hl7messaging.vo.StatisticsMessages;
import com.hin.hl7messaging.web.HINSession;
import com.hin.hl7messaging.web.service.api.IPresentationService;
import com.hin.hl7messaging.web.service.api.ITransformationService;
import com.hin.hl7messaging.web.service.api.IWorkFlowManagerService;

public class PresentationService implements IPresentationService {

	private IMessageService messageService = new MessageService();
	private ITransformationService transformationService = new TransformationService();
	private IdentityProcessor identityProcessor;
	private Logger logger = Logger.getLogger(PresentationService.class
			.getName());

	
	 * private IWorkFlowManagerService workFlowManager = new WorkFlowManager(
	 * "jbpm.cfg.xml");
	 
	private IWorkFlowManagerService workFlowManager = (WorkFlowManager) HINApplicationContext
			.getHINApplicationContext().getContextAttribute(
					HINConfigurationProperty.WORKFLOW_MANAGER_BEAN.toString());

	public PresentationService() {
		try {
			identityProcessor = new IdentityProcessor();
		} catch (Exception e) {
			logger.error("An error occured in initialisation: "
					+ e.getMessage());
		}
	}

	
	 * @Override public boolean authenicate(HINRequest hinRequest, HINResponse
	 * hinResponse, ServletContext servletContext) throws Exception { String
	 * profileID = ""; HashMap<String, Object> map = new HashMap<String,
	 * Object>(); try { if (hinRequest.getRequestType().equals("login")) {
	 * profileID = getProfileID(hinRequest); hinRequest.setProfileID(profileID);
	 * hinResponse.setProfileID(profileID); }
	 * 
	 * identityProcessor = new IdentityProcessor();
	 * 
	 * HinUserProfile hinUserProfile = identityProcessor.identifyUser( "Shilpa",
	 * "Sunanda"); String messageXML = hinUserProfile.getMessage();
	 * 
	 * if (messageXML != null && messageXML.length() > 0) { Action action =
	 * hinRequest.getAction(); if (action.equals(Action.PROFILE) &&
	 * servletContext != null) { // doTransformation(hinResponse,
	 * servletContext, // messageXML); generateResponseBody(hinResponse,
	 * servletContext, messageXML); } else { Document xmlDocument =
	 * XMLHelper.getXMLDocument(messageXML); String messageID = (String)
	 * XMLHelper.read(xmlDocument, "//id[1]/@root", XPathConstants.STRING);
	 * String artifactID = (String) XMLHelper.read(xmlDocument, "name(/*)",
	 * XPathConstants.STRING); map.put(messageID, messageXML);
	 * hinResponse.setArtifactID(artifactID);
	 * hinResponse.setMessageID(messageID);
	 * hinResponse.setMessageXML(messageXML); hinResponse.setMessageMap(map);
	 * hinResponse.setProfileID(hinRequest.getProfileID());
	 * hinResponse.setUserName(hinRequest.getUserName()); }
	 * 
	 * }
	 * 
	 * map = retrieveProfile(hinRequest, hinResponse, null); if (!map.isEmpty())
	 * { System.out.println("\nAUTHENTICATED\n"); return true; } else {
	 * System.out.println("\nDENIED\n");
	 * hinResponse.setErrorDesc("Not a valid user"); return false; } } catch
	 * (Exception e) { e.printStackTrace(); throw e; } }
	 

	
	 * @Override public HashMap<String, Object> retrieveProfile(HINRequest
	 * hinRequest, HINResponse hinResponse, ServletContext servletContext) {
	 * 
	 * HashMap<String, Object> map = new HashMap<String, Object>(); String
	 * messageXML = "", key = ""; // map = //
	 * messageService.retrieveProfileDetails(hinRequest.getProfileID());
	 * 
	 * HinUserProfile hinUserProfile; try { if (identityProcessor == null) {
	 * identityProcessor = new IdentityProcessor(); } hinUserProfile =
	 * identityProcessor .identifyUser("Shilpa", "Sunanda");
	 * 
	 * messageXML = hinUserProfile.getMessage();
	 * 
	 * Set<Entry<String, Object>> set = map.entrySet(); Iterator<Entry<String,
	 * Object>> iterator = set.iterator(); while (iterator.hasNext()) {
	 * Map.Entry entry = (Map.Entry) iterator.next(); key = (String)
	 * entry.getKey(); if (key.equals("MESSAGE")) { messageXML = (String)
	 * entry.getValue(); } } if (messageXML != null && messageXML.length() > 0)
	 * { Action action = hinRequest.getAction(); if
	 * (action.equals(Action.PROFILE) && servletContext != null) { //
	 * doTransformation(hinResponse, servletContext, // messageXML);
	 * generateResponseBody(hinResponse, servletContext, messageXML); } else {
	 * Document xmlDocument = XMLHelper.getXMLDocument(messageXML); String
	 * messageID = (String) XMLHelper.read(xmlDocument, "//id[1]/@root",
	 * XPathConstants.STRING); String artifactID = (String)
	 * XMLHelper.read(xmlDocument, "name(/*)", XPathConstants.STRING);
	 * map.put(messageID, messageXML); hinResponse.setArtifactID(artifactID);
	 * hinResponse.setMessageID(messageID);
	 * hinResponse.setMessageXML(messageXML); hinResponse.setMessageMap(map);
	 * hinResponse.setProfileID(hinRequest.getProfileID());
	 * hinResponse.setUserName(hinRequest.getUserName()); } }
	 * 
	 * if (!map.isEmpty()) { extractMessageId(value); // organizationDetails();
	 * 
	 * }
	 * 
	 * } catch (Exception e) { // TODO Auto-generated catch block
	 * e.printStackTrace(); } return map; }
	 

	
	 * private void doTransformation(HINResponse hinResponse, ServletContext
	 * servletContext, String messageXML) { File xsl = new File(
	 * servletContext.getRealPath("/transformers/MessageView.xsl")); Document
	 * xmlDocument = XMLHelper.getXMLDocument(messageXML); String messageType =
	 * (String) XMLHelper.read(xmlDocument, "name(/*)", XPathConstants.STRING);
	 * File configXml = new File(servletContext.getRealPath("/transformers/" +
	 * messageType + ".xml")); MessageWithConfigAttrsManager manager = new
	 * MessageWithConfigAttrsManager(); manager.setConfigAttrs("id", "type",
	 * "category", "use", "minOccurs", "maxOccurs");
	 * 
	 * StringBuffer config = new StringBuffer(); readFile(configXml, config);
	 * try { String messageXMLwithID = manager.generateConfigAttrsForMessage(
	 * messageXML, config.toString()); String htmlForm =
	 * transformationService.doMessageTransformation( messageXMLwithID,
	 * configXml, xsl); hinResponse.setHtmlForm(htmlForm);
	 * hinResponse.setMessageXML(messageXMLwithID); } catch
	 * (ParserConfigurationException e) { // TODO Auto-generated catch block
	 * e.printStackTrace(); } catch (SAXException e) { // TODO Auto-generated
	 * catch block e.printStackTrace(); } catch (IOException e) { // TODO
	 * Auto-generated catch block e.printStackTrace(); } }
	 

	
	 * private String getProfileID(HINRequest hinRequest) { HashMap<String,
	 * String> userNameMap = new HashMap<String, String>();
	 * userNameMap.put("Anmisha", "2.16.840.1.113883.2.4.6.3");
	 * userNameMap.put("Shilpa", "ShilpaSunanda");// 2.16.840.1.113883.8.6.6");
	 * userNameMap.put("Shweta", "2.16.840.1.113883.8.4.5");
	 * userNameMap.put("Sunanda", "2.16.840.1.113883.8.6.7");
	 * 
	 * if (userNameMap.containsKey(hinRequest.getUserName())) { return
	 * userNameMap.get(hinRequest.getUserName()); }
	 * 
	 * return null; }
	 

	@Override
	public void retrieveInboxMessages(HINRequest hinRequest,
			HINResponse hinResponse, ServletContext servletContext,
			HINSession hinSession) {

		HashMap<String, Object> map = new HashMap<String, Object>();
		File xsl = new File(
				servletContext
						.getRealPath("/transformers/MessageInboxView.xsl"));
		try {
			String id = hinSession.getHinUserProfile().getKey();
			map = getUserMessagesFromWorkFlow(id);
			if (map != null && !map.isEmpty()) {
				// map = messageService.retrieveInbox(id);
				StringBuffer htmlForm = transformationService
						.doInboxTransformation(map, xsl, servletContext, false);
				hinResponse.setHtmlForm(htmlForm.toString());
			}

		} catch (Exception e) {
			logger.error("Fail to convert htmlForm to String:" + e.getMessage());
		}
	}

	@Override
	public void retrieveMessage(HINRequest hinRequest, HINResponse hinResponse,
			ServletContext servletContext) {
		String profileID = hinRequest.getProfileID();
		String messageID = hinRequest.getMessageID();
		HashMap<String, Object> map = new HashMap<String, Object>();
		String messageXML = "", key = "";
		map = messageService.retrieveIndexInbox(profileID, messageID);
		Set set = map.entrySet();
		Iterator iterator = set.iterator();
		while (iterator.hasNext()) {
			Map.Entry entry = (Map.Entry) iterator.next();
			key = (String) entry.getKey();
			if (key.equals("MESSAGE")) {
				messageXML = (String) entry.getValue();
			}
		}
		if (messageXML == null || messageXML.trim().length() == 0) {
			messageXML = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
			messageXML = messageXML.concat("<" + hinRequest.getArtifactID()
					+ " id=\"id1_1\" />");
		}
		hinResponse.setMessageXML(messageXML);
		// generateResponseBody(hinResponse, servletContext, messageXML);

	}

	private void generateResponseBody(HINResponse hinResponse,
			ServletContext servletContext, String messageXML) {
		if (messageXML != null && messageXML.length() > 0) {

			Document xmlDocument = XMLHelper.getXMLDocument(messageXML);
			String messageType = (String) XMLHelper.read(xmlDocument,
					"name(/*)", XPathConstants.STRING);

			File configXml = new File(
					servletContext.getRealPath("/transformers/" + messageType
							+ ".xml"));
			MessageWithConfigAttrsManager manager = new MessageWithConfigAttrsManager();
			manager.setConfigAttrs("id", "type", "category", "use",
					"minOccurs", "maxOccurs");

			StringBuffer configBuffer = new StringBuffer();
			readFile(configXml, configBuffer);

			try {
				String messageXMLwithID = manager
						.generateConfigAttrsForMessage(messageXML,
								configBuffer.toString());

				makeMessageTypeJS(hinResponse, servletContext, messageType,
						messageXMLwithID);
				hinResponse.setMessageXML(messageXMLwithID);
			} catch (ParserConfigurationException e) {
				logger.error("ParserConfiguration error:" + e.getMessage());
			} catch (SAXException e) {
				logger.error("SaxParser not Found: " + e.getMessage());
			} catch (IOException e) {
				logger.error("Error Reading MessageXML: " + e.getMessage());
			}
			// doTransformation(hinResponse, servletContext, messageXML);
		}
	}

	private void makeMessageTypeJS(HINResponse hinResponse,
			ServletContext servletContext, String messageType,
			String messageXMLwithID) {
		// It should be available in context path /transformers
		
		 * File messageTypeJS = new File(
		 * servletContext.getRealPath("/transformers/" + messageType + ".js"));
		 * StringBuffer messageTypeJSBuffer = new StringBuffer();
		 * readFile(messageTypeJS, messageTypeJSBuffer);
		 * hinResponse.setHtmlForm(messageTypeJSBuffer.toString());
		 

	}

	private void readFile(File configXml, StringBuffer config) {
		try {
			BufferedReader br = new BufferedReader(new InputStreamReader(
					new FileInputStream(configXml)));
			String line = "";
			while ((line = br.readLine()) != null) {
				config.append(line);
			}
			br.close();
		} catch (IOException e2) {
			System.out.println("Error reading message file: " + e2);
			logger.error("Failed reading message File: " + e2.getMessage());
		}
	}

	@Override
	public void laodMessage(HINRequest hinRequest, HINResponse hinResponse,
			ServletContext servletContext) {
		String messageType = hinRequest.getMessageType();
		
		 * File configXml = new File(servletContext.getRealPath("/transformers/"
		 * + messageType + ".xml")); File xsl = new File( servletContext
		 * .getRealPath("/transformers/empty-message-gen.xsl"));
		 

		
		 * String messageXMLwithID = transformationService
		 * .doNewMessageTransformation("", configXml, xsl);
		 

		String messageXMLwithID = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
		messageXMLwithID = messageXMLwithID.concat("<" + messageType
				+ " id=\"id1_1\" />");

		makeMessageTypeJS(hinResponse, servletContext, messageType,
				messageXMLwithID);
		hinResponse.setMessageXML(messageXMLwithID);
		hinResponse.setArtifactID(messageType);

		
		 * xsl = new File(
		 * servletContext.getRealPath("/transformers/MessageView.xsl")); String
		 * htmlForm = transformationService.doMessageTransformation(
		 * messageXMLwithID, configXml, xsl);
		 * 
		 * hinResponse.setHtmlForm(htmlForm);
		 * hinResponse.setMessageXML(messageXMLwithID);
		 

	}

	@Override
	public void retrieveMap(HINRequest hinRequest, HINResponse hinResponse,
			ServletContext servletContext) {
		String orgId = "";
		
		 * List<GMap> markers = new ArrayList<GMap>();
		 * 
		 * markers.add(new GMap("12.971599", "77.594563", "Bangalore",
		 * "Bangalore",
		 * "http://google-maps-icons.googlecode.com/files/home.png", ""));
		 * markers.add(new GMap("12.988061", "77.708834", "Imtac ICT(BLR)",
		 * "Imtac ICT-Bangalore",
		 * "http://google-maps-icons.googlecode.com/files/home.png", ""));
		 * markers.add(new GMap("12.808893", "77.695039", "NH-Bangalore",
		 * "Narayana Hrudayalaya,Bangalore",
		 * "http://google-maps-icons.googlecode.com/files/home.png", ""));
		 
		hinResponse.setMarkers(identityProcessor.fetchGmapLocation(orgId));// call
																			// my
																			// method
																			// for
																			// retrival
																			// inthe
																			// identity
																			// as
																			// the
																			// argument
																			// for
																			// the
																			// setMarker
	}

	
	 * private HashMap<String, Object> getUserMessagesFromWorkFlow(){ String
	 * userId="sanalp";//HINSession.getHINSession(session)
	 * hinUserProfile.getKey(); HashMap<String, Object> map = new
	 * HashMap<String, Object>(); List<IWorkFlowTask> workFlowTasks=
	 * workFlowManager.getUserTask(userId); for(IWorkFlowTask
	 * workFlowTask:workFlowTasks){ map.put(workFlowTask.getUserProcessKey()
	 * ,workFlowTask.getMessage());
	 * signalTask(workFlowTask.getOrgId(),userId,workFlowTask
	 * .getUserProcessKey(),
	 * workFlowTask.getMessage(),workFlowTask.getTaskId(),"true","",""); }
	 * return map; } private void assignNewTask(String userId,String message){
	 * // userId=HINSession.hinUserProfile.getKey();
	 * workFlowManager.createNewTask(userId, message,"abc",""); }
	 

	private HashMap<String, Object> getUserMessagesFromWorkFlow(String userId)
			throws Exception {
		// String userId="";//HINSession.getHINSession(session)
		// hinUserProfile.getKey();
		HashMap<String, Object> map = new HashMap<String, Object>();
		List<IWorkFlowTask> workFlowTasks = workFlowManager
				.getAllUserMessages(userId);// workFlowManager.getUserTask(userId);
		for (IWorkFlowTask workFlowTask : workFlowTasks) {
			TaskVO taskVO = new TaskVO();
			taskVO.setMessageID(workFlowTask.getUserProcessKey());
			taskVO.setMessage(workFlowTask.getMessage());
			taskVO.setOrgId(workFlowTask.getOrgId());
			taskVO.setTaskId(workFlowTask.getTaskId());
			taskVO.setTaskOutComes(workFlowTask.getTaskOutComes());
			taskVO.setCompleted(workFlowTask.isCompleted());
			taskVO.setAssignablePeople(workFlowTask.getAssignablePeople());
			taskVO.setMessageType(workFlowTask.getMessageType());
			if (!workFlowTask.getParameterList().isEmpty()
					&& workFlowTask.getParameterList().containsKey(
							"friendRequestKey")) {
				taskVO.setFriendRequestKey(workFlowTask.getParameterList().get(
						"friendRequestKey"));
			}
			if (!workFlowTask.getParameterList().isEmpty()
					&& workFlowTask.getParameterList().containsKey(
							"friendRequestBy")) {
				taskVO.setFriendId(workFlowTask.getParameterList().get(
						"friendRequestBy"));
			}
			if (!workFlowTask.getParameterList().isEmpty()
					&& workFlowTask.getParameterList().containsKey(
							"relationship")) {
				taskVO.setContactType(workFlowTask.getParameterList().get(
						"relationship"));
			}

			// System.out.println(workFlowTask.getUserProcessKey());
			map.put(workFlowTask.getTaskId(), taskVO);
			// signalTask(workFlowTask.getOrgId(),userId,workFlowTask.getUserProcessKey(),
			// workFlowTask.getMessage(),workFlowTask.getTaskId(),"true","","");
		}
		return map;
	}

	public void assignSignalTask(HINRequest hinRequest) {
		// workFlowManager.taskDone(taskId,outCome,assigneType,assigneName);
		String orgId = hinRequest.getAssignedToOrg();
		String userId = hinRequest.getUserName();
		String messageId = hinRequest.getMessageID();
		String message = hinRequest.getMessage();
		String taskId = hinRequest.getTaskId();// task
		String outCome = hinRequest.getOutCome();// outcome
		String assigneType = hinRequest.getAssigneType();//
		String assigneName = hinRequest.getAssignedToWhom();
		Document xmlDocument = XMLHelper.getXMLDocument(message);
		String messageType = (String) XMLHelper.read(xmlDocument, "name(/*)",
				XPathConstants.STRING);
		if (taskId != null) {
			workFlowManager.taskDone(orgId, userId, messageId, message, taskId,
					outCome, assigneType, assigneName);
			workFlowManager.createNewTask(identityProcessor.getUserId(message),
					message, orgId, "USERCOPY_" + messageType);
		}
	}

	
	 * private void testWorkFlow(){
	 * assignNewTask("sanalp","Iam message to be saved.");
	 * getUserMessagesFromWorkFlow(); //
	 * workFlowManager.getAllUserMessages(HINSession.hinUserProfile.getKey()); }
	 

	public void assignNewTask(HINRequest hinRequest, HINResponse hinResponse) {
		String userId = hinRequest.getAssignedToWhom();
		String message = hinRequest.getMessage();
		String messageType = hinRequest.getMessageType();
		String orgId = hinRequest.getAssignedToOrg();
		workFlowManager.createNewTask(userId, message, orgId, messageType);
	}

	public void assignNewHinTask(HINRequest hinRequest, HINResponse hinResponse) {
		String userId = hinRequest.getAssignedToWhom();
		String message = hinRequest.getMessage();
		String messageType = hinRequest.getMessageType();
		String orgId = hinRequest.getAssignedToOrg();
		if (!messageType.equals("PRPA_IN410001")) {
			workFlowManager.createNewTask(userId, message, orgId, messageType);
		}
		workFlowManager.createNewTask(identityProcessor.getUserId(message),
				message, orgId, "USERCOPY_" + messageType);
		if (orgId != null && orgId.length() > 0) {
			workFlowManager.createNewTask(orgId, message, orgId, messageType);// "USERCOPY_"+messageType);
		}
	}

	public void logout() {
		HINSession.removeHINSession();
	}

	public void retrieveStatisticsMessage(HINRequest hinRequest,
			HINResponse hinResponse, ServletContext servletContext) {

		String date = hinRequest.getStatisticsKey(), artifactID = hinRequest
				.getStatisticsArtifactID();
		String message = "", creationTime = "", dateStatistics = "";
		List<StatisticsMessages> statisticsMessages = new ArrayList<StatisticsMessages>();

		Document messageDoc = null;
		Calendar c = Calendar.getInstance();
		SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmss");
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

		Map<String, HashMap<String, String>> resultMap = new HashMap<String, HashMap<String, String>>();
		HashMap<String, String> messageMap = new HashMap<String, String>();
		HashMap<String, Object> map = new HashMap<String, Object>();
		try {
			resultMap = messageService.getMessages(date, artifactID);
			// System.out.println(resultMap);
			int key = 0;
			Iterator iterator = resultMap.entrySet().iterator();
			while (iterator.hasNext()) {
				Map.Entry mEntry = (Map.Entry) iterator.next();
				messageMap = (HashMap<String, String>) mEntry.getValue();
				message = messageMap.get("MESSAGE");
				messageDoc = XMLHelper.getXMLDocument(message);
				creationTime = (String) XMLHelper.read(messageDoc,
						"//creationTime[1]/@value", XPathConstants.STRING);
				c.setTime(format.parse(creationTime));

				Date creationDate = c.getTime();
				dateStatistics = dateFormat.format(creationDate);
				message = message.replaceAll("--del--", "\n");
				message = message.replaceAll("\\\\", "'");
				StatisticsMessages stat = new StatisticsMessages(
						dateStatistics, message);
				statisticsMessages.add(stat);

				TaskVO taskVo = new TaskVO();
				taskVo.setMessage(message);
				taskVo.setOutCome(dateStatistics);
				taskVo.setCompleted(true);
				map.put("" + (key++), taskVo);

			}
			retrieveStatisticalMessages(map, hinResponse, servletContext);
			// hinResponse.setStatisticsMessages(statisticsMessages);

		} catch (Exception e) {
			logger.error("Failure in retrieving StatisticsMessage: "
					+ e.getMessage());
		}
	}

	@Override
	public void retrieveStatistics(HINRequest hinRequest,
			HINResponse hinResponse, ServletContext servletContext) {

		List<Statistics> statistics = new ArrayList<Statistics>();

		String key = "", descriptiveName = "", value = "", artifactID = "";

		artifactID = hinRequest.getStatisticsArtifactID();
		key = hinRequest.getStatisticsKey();// Format expecting mmyyyy or yyyy

		Map<String, Statistics> statisticsMap = new HashMap<String, Statistics>();

		// RowKey->MessageType->COUNT->23
		Map<String, Map<String, Map<String, String>>> resultMap = new HashMap<String, Map<String, Map<String, String>>>();
		Map<String, Map<String, String>> descriptionMap = new HashMap<String, Map<String, String>>();
		Map<String, String> columnValueMap = new HashMap<String, String>();
		List<String> artifactIdList = new ArrayList<String>();

		if (artifactID != null && artifactID.length() > 0) {
			String[] artifacts = artifactID.split(",");
			for (String artifact : artifacts) {
				artifactIdList.add(artifact);
			}
		}

		try {
			resultMap = messageService.getStatistics(key, artifactIdList);

		} catch (Exception e) {
			logger.error("Failed getting Statistics: " + e.getMessage());
		}
		// System.out.println(resultMap);

		// Sorting the ResultMap
		Map<String, Map<String, Map<String, String>>> sortedMap = new TreeMap<String, Map<String, Map<String, String>>>(
				resultMap);

		Iterator iterator = sortedMap.entrySet().iterator();
		while (iterator.hasNext()) {
			Map.Entry mEntry = (Map.Entry) iterator.next();
			descriptionMap = (Map<String, Map<String, String>>) mEntry
					.getValue();
			Iterator descriptionIterator = descriptionMap.entrySet().iterator();
			while (descriptionIterator.hasNext()) {
				Map.Entry descriptionEntry = (Map.Entry) descriptionIterator
						.next();
				descriptiveName = (String) descriptionEntry.getKey();

				// Check statistics object existing or not
				if (!statisticsMap.containsKey(descriptiveName)) {
					Statistics stat = new Statistics(descriptiveName,
							new ArrayList<Integer>());
					statisticsMap.put(descriptiveName, stat);
					statistics.add(stat);
				}

				columnValueMap = (Map<String, String>) descriptionEntry
						.getValue();
				Iterator columnValueIterator = columnValueMap.entrySet()
						.iterator();
				while (columnValueIterator.hasNext()) {
					Map.Entry columnValueEntry = (Map.Entry) columnValueIterator
							.next();
					if (columnValueEntry.getKey().equals("COUNT")) {
						List<Integer> values = new ArrayList<Integer>();
						value = (String) columnValueEntry.getValue();
						// get the current Statistics object from statisticsMap
						Statistics stat = statisticsMap.get(descriptiveName);
						stat.getData().add(Integer.parseInt(value));

					}
				}
			}
		}
		hinResponse.setStatistics(statistics);
	}

	@Override
	public void retrieveSelectedProfile(HINRequest hinRequest,
			HINResponse hinResponse, ServletContext servletContext)
			throws Exception {
		File xsl = new File(
				servletContext.getRealPath("/transformers/ProfileView.xsl"));
		String messageXML = identityProcessor.getProfile(hinRequest
				.getSelectedProfileID());

		hinResponse.setMessageXML(messageXML);

		Document xmlDocument = XMLHelper.getXMLDocument(messageXML);
		String messageType = (String) XMLHelper.read(xmlDocument, "name(/*)",
				XPathConstants.STRING);
		hinResponse.setSelectedProfileArtifactID(messageType);
		if (messageType.equals("COCT_MT150000")) {
			xsl = new File(
					servletContext
							.getRealPath("/transformers/OrganizationProfileView.xsl"));
			String profileViewForm = transformationService
					.doMessageFormTransformation(messageXML, xsl, null);
			hinResponse.setSelectedProfileViewForm(profileViewForm);

			xsl = new File(
					servletContext
							.getRealPath("/transformers/OrganizationMessagesView.xsl"));
			String messagesViewForm = transformationService
					.doMessageFormTransformation(messageXML, xsl, null);
			hinResponse.setSelectedMessagesViewForm(messagesViewForm);

		} else {
			xsl = new File(
					servletContext.getRealPath("/transformers/ProfileView.xsl"));
			String profileViewForm = transformationService
					.doMessageFormTransformation(messageXML, xsl, null);
			hinResponse.setSelectedProfileViewForm(profileViewForm);
			xsl = new File(
					servletContext
							.getRealPath("/transformers/EndorsementsView.xsl"));
			String endorsementsViewForm = transformationService
					.doMessageFormTransformation(messageXML, xsl, null);
			hinResponse.setSelectedEndorsementsViewForm(endorsementsViewForm);

			xsl = new File(
					servletContext
							.getRealPath("/transformers/MessagesView.xsl"));
			String messagesViewForm = transformationService
					.doMessageFormTransformation(messageXML, xsl, null);
			hinResponse.setSelectedMessagesViewForm(messagesViewForm);

			retrieveSelectedProfileMedicalMessages(hinRequest, hinResponse,
					servletContext, hinRequest.getSelectedProfileID());
			;
		}

		
		 * String profileViewForm = transformationService
		 * .doMessageFormTransformation(messageXML, xsl);
		 * hinResponse.setSelectedProfileViewForm(profileViewForm);
		 * 
		 * xsl = new File( servletContext
		 * .getRealPath("/transformers/EndorsementsView.xsl")); String
		 * endorsementsViewForm = transformationService
		 * .doMessageFormTransformation(messageXML, xsl);
		 * hinResponse.setSelectedEndorsementsViewForm(endorsementsViewForm);
		 * 
		 * xsl = new File(
		 * servletContext.getRealPath("/transformers/MedicalView.xsl")); String
		 * medicalViewForm = transformationService
		 * .doMessageFormTransformation(messageXML, xsl);
		 * hinResponse.setSelectedMedicalViewForm(medicalViewForm);
		 

	}

	@Override
	public void retrieveProfile(HINRequest hinRequest, HINResponse hinResponse,
			ServletContext servletContext, HINSession hinSession) {
		File xsl = null;
		String messageXML = hinSession.getHinUserProfile().getMessage();

		Document xmlDocument = XMLHelper.getXMLDocument(messageXML);
		String messageType = (String) XMLHelper.read(xmlDocument, "name(/*)",
				XPathConstants.STRING);
		hinResponse.setSelectedProfileArtifactID(messageType);
		if (messageType.equals("COCT_MT150000")) {
			xsl = new File(
					servletContext
							.getRealPath("/transformers/OrganizationProfileView.xsl"));
			String profileViewForm = transformationService
					.doMessageFormTransformation(messageXML, xsl, null);
			hinResponse.setProfileViewForm(profileViewForm);

			xsl = new File(
					servletContext
							.getRealPath("/transformers/OrganizationMessagesView.xsl"));
			String messagesViewForm = transformationService
					.doMessageFormTransformation(messageXML, xsl, null);
			hinResponse.setMessagesViewForm(messagesViewForm);
		} else {
			xsl = new File(
					servletContext.getRealPath("/transformers/ProfileView.xsl"));
			String profileViewForm = transformationService
					.doMessageFormTransformation(messageXML, xsl, null);
			hinResponse.setProfileViewForm(profileViewForm);
			xsl = new File(
					servletContext
							.getRealPath("/transformers/EndorsementsView.xsl"));
			String endorsementsViewForm = transformationService
					.doMessageFormTransformation(messageXML, xsl, null);
			hinResponse.setEndorsementsViewForm(endorsementsViewForm);

			xsl = new File(
					servletContext
							.getRealPath("/transformers/MessagesView.xsl"));
			String messagesViewForm = transformationService
					.doMessageFormTransformation(messageXML, xsl, null);
			hinResponse.setMessagesViewForm(messagesViewForm);

			retrieveProfileMedicalMessages(hinRequest, hinResponse,
					servletContext, hinSession);

		}

	}

	@Override
	public void retrieveCalendar(HINRequest hinRequest,
			HINResponse hinResponse, HINSession hinSession) {
		Map<String, HashMap<String, String>> resultMap = new HashMap<String, HashMap<String, String>>();
		List<CalendarVO> calendars = new ArrayList<CalendarVO>();
		HashMap<String, String> columnValueMap = new HashMap<String, String>();
		String profileID = hinSession.getHinUserProfile().getKey(), column = "", event = "";
		Gson gson = new Gson();

		resultMap = messageService.retrieveStandardColumnFamily("CF_EVENTS",
				profileID);
		if (!resultMap.isEmpty()) {
			// Retrieval of calendar events
			columnValueMap = resultMap.get(profileID);
			Iterator iterator = columnValueMap.entrySet().iterator();
			while (iterator.hasNext()) {
				Map.Entry columnValueMapEntry = (Map.Entry) iterator.next();
				column = (String) columnValueMapEntry.getKey();
				if (!(column.equals("KEY"))) {
					event = (String) columnValueMapEntry.getValue();
					CalendarVO json = gson.fromJson(event, CalendarVO.class);
					calendars.add(json);
					
					 * System.out.println((String) columnValueMapEntry.getKey()
					 * + ": " + json);
					 
				}
			}

			
			 * calendars.add(new CalendarVO("admindemo", "Appinment Event", new
			 * Date(), false)); calendars.add(new CalendarVO("swethademo",
			 * "Encounter Event", new Date(), false)); calendars.add(new
			 * CalendarVO("girldemo", "Observation Event", new Date(), false));
			 
			hinResponse.setCalendars(calendars);
		}
	}

	
	 * private void testFriendRequest() throws Exception {
	 * workFlowManager.createFriendRequestTask("madhumadhu", "reghureghu",
	 * "Add me as friend"); List<IWorkFlowTask> workFlowTaskList =
	 * workFlowManager .getUserTask("reghureghu"); for (IWorkFlowTask task :
	 * workFlowTaskList) { try { if
	 * (task.getMessageType().equals("AddRelation")) { String friendRequestKey =
	 * task.getParameterList().get( "friendRequestKey"); String friendId =
	 * task.getParameterList().get( "friendRequestBy");
	 * workFlowManager.handleFriendRequestTask("reghureghu", friendId,
	 * friendRequestKey, task.getTaskId(), task.getMessage(), "Accept"); } }
	 * catch (Exception ex) {
	 * System.out.println("Error while accepting friend request" +
	 * ex.getMessage()); } } }
	 

	@Override
	public void requestToAddContact(HINRequest hinRequest,
			HINResponse hinResponse, HINSession hinSession) throws Exception {
		String requestFrom = hinSession.getHinUserProfile().getKey();
		String requestTo = hinRequest.getSelectedProfileID();
		String contactType = hinRequest.getContactType();
		workFlowManager.createFriendRequestTask(requestFrom, requestTo,
				"Add me as friend", contactType);

	}

	@Override
	public void retrieveLinkedProfileMessages(HINRequest hinRequest,
			HINResponse hinResponse, ServletContext servletContext,
			HINSession hinSession) {

		HashMap<String, Object> map = new HashMap<String, Object>();
		File xsl = new File(
				servletContext
						.getRealPath("/transformers/LinkedProfileMessageView.xsl"));
		try {
			String id = hinSession.getHinUserProfile().getKey();
			List<String> messageList = identityProcessor
					.fetchLinkedProfileMessage(id);// get the message from the
													// linked profile column
			if (messageList != null && !messageList.isEmpty()) {
				StringBuffer htmlForm = transformationService
						.doLinkedProfileMessageTransformation(messageList, xsl);
				hinResponse.setHtmlForm(htmlForm.toString());
			}

		} catch (Exception e) {
			logger.error("Fail to convert htmlForm to String: "
					+ e.getMessage());
		}
	}

	@Override
	public void respondToAddContact(HINRequest hinRequest,
			HINResponse hinResponse, HINSession hinSession) throws Exception {
		String friendRequestBy = hinRequest.getFriendRequestBy();
		String friendRequestKey = hinRequest.getFriendRequestKey();
		String taskID = hinRequest.getTaskId();
		String loginUserId = hinSession.getHinUserProfile().getKey();
		String input = hinRequest.getOutCome();
		String message = input;
		String contactType = hinRequest.getContactType();
		workFlowManager.handleFriendRequestTask(loginUserId, friendRequestBy,
				friendRequestKey, taskID, message, input, contactType);
		retreiveLoggedInUserProfileMessage(hinResponse, loginUserId);

	}

	@Override
	public void retrieveProfileMedicalMessages(HINRequest hinRequest,
			HINResponse hinResponse, ServletContext servletContext,
			HINSession hinSession) {
		HashMap<String, Object> map = new HashMap<String, Object>();
		File xsl = new File(
				servletContext.getRealPath("/transformers/MedicalView.xsl"));
		try {
			String id = hinSession.getHinUserProfile().getKey();
			map = getEMRMessagesFromWorkFlow(id);
			if (map != null && !map.isEmpty()) {
				// map = messageService.retrieveInbox(id);
				StringBuffer medicalViewForm = transformationService
						.doMedicalTransformation(map, xsl, servletContext);
				hinResponse.setMedicalViewForm(medicalViewForm.toString());
			}

		} catch (Exception e) {
			logger.error("Fail to convert medicalViewForm to String: "
					+ e.getMessage());
		}

	}

	@Override
	public void retrieveSelectedProfileMedicalMessages(HINRequest hinRequest,
			HINResponse hinResponse, ServletContext servletContext, String id) {
		HashMap<String, Object> map = new HashMap<String, Object>();
		File xsl = new File(
				servletContext.getRealPath("/transformers/MedicalView.xsl"));
		try {
			map = getEMRMessagesFromWorkFlow(id);
			if (map != null && !map.isEmpty()) {
				// map = messageService.retrieveInbox(id);
				StringBuffer medicalViewForm = transformationService
						.doMedicalTransformation(map, xsl, servletContext);
				hinResponse.setSelectedMedicalViewForm(medicalViewForm
						.toString());
			}

		} catch (Exception e) {
			logger.error("Failure retrieving SelectedProfileMedicalMessages: "
					+ e.getMessage());
		}

	}

	private HashMap<String, Object> getEMRMessagesFromWorkFlow(String userId)
			throws Exception {
		// String userId="";//HINSession.getHINSession(session)
		// hinUserProfile.getKey();
		HashMap<String, Object> map = new HashMap<String, Object>();
		List<IWorkFlowTask> workFlowTasks = workFlowManager
				.getOrganisationUserMessages(userId);// workFlowManager.getUserTask(userId);
		for (IWorkFlowTask workFlowTask : workFlowTasks) {
			TaskVO taskVO = new TaskVO();
			taskVO.setMessage(workFlowTask.getMessage());
			map.put(workFlowTask.getTaskId(), taskVO);
		}
		return map;
	}

	@Override
	public String retreiveLoggedInUserProfileMessage(HINResponse hinResponse,
			String profileId) {
		String key = "", messageXML = "";
		HashMap<String, Object> valueMap = new HashMap<String, Object>();
		Map<String, Map<String, Map<String, String>>> resultMap = new HashMap<String, Map<String, Map<String, String>>>();
		resultMap = messageService.retrieveProfileDetails(profileId);
		if (resultMap.isEmpty()) {
			return null;
		}
		Set rowKeySet = resultMap.entrySet();
		Iterator iterator = rowKeySet.iterator();
		while (iterator.hasNext()) {
			Map.Entry entry = (Map.Entry) iterator.next();
			key = (String) entry.getKey();
			// System.out.println("RowKey: " + key);
			valueMap = (HashMap<String, Object>) entry.getValue();
			Set superColumnSet = valueMap.entrySet();
			Iterator iter = superColumnSet.iterator();
			while (iter.hasNext()) {
				Map.Entry subEntry = (Map.Entry) iter.next();
				key = (String) subEntry.getKey();
				if (key.equals("REG_MESSAGE")) {
					valueMap = (HashMap<String, Object>) subEntry.getValue();
					Set columnSet = valueMap.entrySet();
					Iterator itr = columnSet.iterator();
					while (itr.hasNext()) {
						Map.Entry valueEntry = (Map.Entry) itr.next();
						messageXML = (String) valueEntry.getValue();
						break;
					}
				}
			}
		}
		hinResponse.setMessageXML(messageXML);
		return messageXML;

	}

	@Override
	public void retrieveHistoryMessages(HINRequest hinRequest,
			HINResponse hinResponse, ServletContext servletContext,
			HINSession hinSession) {
		// TODO Auto-generated method stub
		HashMap<String, Object> map = new HashMap<String, Object>();
		File xsl = new File(
				servletContext
						.getRealPath("/transformers/MessageHistoryView.xsl"));
		try {
			String id = hinSession.getHinUserProfile().getKey();
			map = getUserMessagesFromWorkFlow(id);
			if (map != null && !map.isEmpty()) {
				// map = messageService.retrieveInbox(id);
				StringBuffer htmlForm = transformationService
						.doInboxTransformation(map, xsl, servletContext, true);
				hinResponse.setHtmlForm(htmlForm.toString());
			}

		} catch (Exception e) {
			logger.error("Fail to convert htmlForm to String: "
					+ e.getMessage());
		}

	}

	@Override
	public void retrieveStatisticalMessages(HashMap<String, Object> map,
			HINResponse hinResponse, ServletContext servletContext) {

		File xsl = new File(
				servletContext
						.getRealPath("/transformers/StatisticalMessageView.xsl"));
		try {
			if (map != null && !map.isEmpty()) {
				StringBuffer htmlForm = transformationService
						.doInboxTransformation(map, xsl, servletContext, true);
				hinResponse.setHtmlForm(htmlForm.toString());
			}

		} catch (Exception e) {
			logger.error("Fail to convert htmlForm to String: "
					+ e.getMessage());
		}

	}

	public void retriveProfileImage(HINRequest hinRequest,
			HINResponse hinResponse, String profileId) {
		String messageXML = retreiveLoggedInUserProfileMessage(hinResponse,
				profileId);
		Document xmlDocument = XMLHelper.getXMLDocument(messageXML);

		// String profileIDXpath
		// ="//controlActProcess/subject/registrationEvent/subject/identifiedEntity/identifiedPerson/id[1]/@root";//
		// "//identifiedPerson[1]/id/@root";//
		// /personalRelationship/relationshipHolder/id/@root";
		String profilePicture = (String) XMLHelper.read(xmlDocument,
				hinRequest.getXPath(), XPathConstants.STRING);
		hinResponse.setProfilePicture(profilePicture);
		hinResponse.setMessageXML(messageXML);
	}

	@Override
	public void retriveWorkFlowDiagram(HINRequest hinRequest,
			HINResponse hinResponse, HINSession hinSession) {
		String workFlowProcess = hinRequest.getMessageType();

		ByteArrayInputStream bais = workFlowManager
				.getWorkFlowProcessImage(hinSession.getHinUserProfile().getKey(),workFlowProcess);
		BufferedImage image = null;
		try {
			int length = bais.available();
			byte[] buff = new byte[length];
			bais.read(buff);
			InputStream inputStream = new ByteArrayInputStream(buff);
			BufferedImage workflowimage = ImageIO.read(inputStream);
			image = workflowimage;
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			ImageIO.write(image, "png", baos);
			String encodedImage = Base64.encodeBase64String(baos.toByteArray());
			hinResponse.setProfilePicture(encodedImage);
			 image = ImageIO.read(new File("e:/PRPA_IN000001.png")); 
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}


	// Convert byte[] to Base64 String

	
	 * byte[] buff = new byte[2048]; while (bais.read(buff) != -1) {
	 * response.getOutputStream().write(buff); }
	 

	
	 * if (bais != null) { try { int length = bais.available(); byte[] buff =
	 * new byte[length]; bais.read(buff);
	 * 
	 * try { FileOutputStream outputStream = new FileOutputStream("e:/" +
	 * workFlowProcess + ".png"); outputStream.write(buff);
	 * outputStream.flush(); outputStream.close(); } catch
	 * (FileNotFoundException e1) { // TODO Auto-generated catch block
	 * e1.printStackTrace(); }
	 * 
	 * 
	 * byte image[] = BinaryUtils .decodeInputStreamToBase64(new String(buff));
	 * 
	 * hinResponse.setProfilePicture(new String(buff)); } catch (IOException e)
	 * { // TODO Auto-generated catch block e.printStackTrace(); } }
	 



	@Override
	public void retrieveTimeLine(HINRequest hinRequest, HINResponse hinResponse) {
		List<TimeLineVO> timelines = new ArrayList<TimeLineVO>();

		TimeLineVO timelineVo = new TimeLineVO();

		Calendar calendar = new GregorianCalendar();
		Date trialTime = new Date();
		calendar.setTime(trialTime);
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		timelineVo.setStart_date(format.format(calendar.getTime()));
		calendar.add(Calendar.DATE, 1);
		timelineVo.setEnd_date(format.format(calendar.getTime()));
		timelineVo.setText("Observation");
		timelineVo.setSection_id("1");
		timelines.add(timelineVo);
		hinResponse.setTimeLines(timelines);

	}

	
	 * @Override public void retrieveSelectedTimeLine(HINRequest
	 * hinRequest,HINResponse hinResponse) { List<TimeLineVO> selectedTimelines
	 * = new ArrayList<TimeLineVO>();
	 * 
	 * TimeLineVO timelineVo = new TimeLineVO(); timelineVo.setStartDate(new
	 * Date()); timelineVo.setEndDate(new Date());
	 * timelineVo.setText("Observation"); timelineVo.setSectionID("1");
	 * selectedTimelines.add(timelineVo);
	 * hinResponse.setTimeLines(selectedTimelines);
	 * 
	 * }
	 

}
*/