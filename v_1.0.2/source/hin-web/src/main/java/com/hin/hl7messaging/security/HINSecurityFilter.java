/**
 * 
 *//*
package com.hin.hl7messaging.security;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.xml.xpath.XPathConstants;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.log4j.Logger;
import org.w3c.dom.Attr;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

import com.google.gson.Gson;
import com.hin.hl7messaging.HinOrgUserProfile;
import com.hin.hl7messaging.HinUserProfile;
import com.hin.hl7messaging.IdentityEngine.IdentityProcessor;
import com.hin.hl7messaging.configuration.ConfigurationReader;
import com.hin.hl7messaging.configuration.generator.XMLHelper;
import com.hin.hl7messaging.domain.MessageTypeDefinition;
import com.hin.hl7messaging.utils.Action;
import com.hin.hl7messaging.utils.BinaryUtils;
import com.hin.hl7messaging.utils.GMap;
import com.hin.hl7messaging.vo.HINRequest;
import com.hin.hl7messaging.vo.HINResponse;
import com.hin.hl7messaging.vo.MultipartHandler;
import com.hin.hl7messaging.web.HINSession;
import com.hin.hl7messaging.web.service.PresentationService;
import com.hin.hl7messaging.web.service.api.IPresentationService;

*//**
 * @author Administrator
 * 
 *//*
public class HINSecurityFilter implements Filter {

	protected FilterConfig filterConfig;
	private MultipartHandler handler;
	private IdentityProcessor identityProcessor = null;
	private Map<String, Map<String, Map<String, String>>> mainMap = new HashMap<String, Map<String, Map<String, String>>>();
	private HashMap<String, Object> valueMap = new HashMap<String, Object>();
	private String key = "", value = "", orgUserProfileKey = "";
	private Logger logger = Logger.getLogger(HINSecurityFilter.class.getName());
	private HINSession hinSession = null;
	private IPresentationService presentationService = null;

	@Override
	public void destroy() {
		this.filterConfig = null;
	}

	@SuppressWarnings({ "deprecation", "unused" })
	@Override
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		HttpServletRequest req = (HttpServletRequest) request;
		HttpServletResponse res = (HttpServletResponse) response;
		res.addHeader("Cache-Control", "no-cache");
		res.addHeader("Pragma", "no-cache");
		res.addIntHeader("Expires", 0);
		hinSession = HINSession.getHINSession(req.getSession());
		if (req.getParameter("orgUserProfileKey") != null) {
			orgUserProfileKey = req.getParameter("orgUserProfileKey").trim();
			if (orgUserProfileKey.length() > 0) {
				hinSession.setAttribute(HINSession.ORG_USER_PROFILE_SESSION,
						orgUserProfileKey);
			}

			res.sendRedirect("/hin-web/main-screen/html/index.html");
			return;
		}

		boolean multipart = isMultipart(req);
		if (multipart) {
			String requestType = handler.getParameter("requestType");
			if (requestType != null && requestType.equals("register")) {
				try {
					saveHinUser(req, res, false);
					
					 * HINRequest hinRequest = new HINRequest();
					 * //hinRequest.setUserName
					 * (handler.getParameter("userName"));
					 * //hinRequest.setPassword
					 * (handler.getParameter("password"));
					 * hinRequest.setUserName("vin");
					 * hinRequest.setPassword("vin"); login(hinRequest, req,
					 * res); orgUserRegistration(req, res);
					 
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
					logger.error("Orgaization Registraton Failed", e);
				}

			} else if (requestType != null
					&& requestType.equals("registerOrgUser")) {
				try {

					saveHinUser(req, res, true);

					
					 * HINRequest hinRequest = new HINRequest();
					 * hinRequest.setUserName(handler.getParameter("userName"));
					 * hinRequest.setPassword(handler.getParameter("password"));
					 * 
					 * login(hinRequest, req, res);
					 

					// orgUserRegistration(req, res);

				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
					logger.error("User Registration Failed", e);
				}
			} else if (requestType != null
					&& requestType.equals("linkedProfileRegistration")) {
				try {
					String activationKey = orgUserRegistration(req, res);
					res.getWriter().println(activationKey);
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
					logger.error("Linked Profile Registration Failed", e);
				}

			} else if (requestType != null && requestType.equals("profile")) {

				HinUserProfile hinUserProfile = hinSession.getHinUserProfile();
				HINResponse hinResponse = new HINResponse();
				if (handler.getParameter("message") != null) {
					hinUserProfile.setMessage(handler.getParameter("message"));
				}
				if (handler.getParameter("imageChange") != null) {
					updateImage(handler, hinUserProfile);
				} else if (handler.getParameter("AddNewContact") != null) {
					updateNewContact(handler, hinUserProfile);
				}
				identityProcessor.updateMessageInColumnfamily(
						hinUserProfile.getKey(), hinUserProfile.getMessage());
				presentationService.retreiveLoggedInUserProfileMessage(
						hinResponse, hinUserProfile.getKey());
			} else if (requestType != null
					&& requestType.equals("gmapLocation")) {

				try {

					BinaryUtils convertToBase64 = new BinaryUtils();
					String lat = handler.getParameter("Latitude");
					String lng = handler.getParameter("Longitude");
					String title = handler.getParameter("title");
					String content = handler.getParameter("content");
					FileItem logoFileItem = handler.getFileParameter("logo");
					FileItem iconFileItem = handler.getFileParameter("icon");
					String icon = BinaryUtils.convertInputStreamToBase64(
							iconFileItem.get(), (int) iconFileItem.getSize());
					String logo = BinaryUtils.convertInputStreamToBase64(
							logoFileItem.get(), (int) logoFileItem.getSize());
					GMap map = new GMap(lat, lng, title, content, icon, logo,
							null, hinSession.getHinUserProfile().getKey());

					identityProcessor.saveGmapLocation(
							hinSession.getHinUserProfile(), map);
				} catch (Exception e) {
					e.printStackTrace();
					logger.error("Saving GMap Failed: "+e.getMessage());
				}
			} else {
				chain.doFilter(request, response);
			}

		} else {

			Gson gson = new Gson();
			HINRequest hinReq = gson.fromJson(request.getParameter("data"),
					HINRequest.class);
			HINResponse hinResponse = new HINResponse();
			
			 * if (hinReq == null) { if
			 * (HINSession.getHINSession(session).getHinUserProfile() != null) {
			 * chain.doFilter(request, response); } else { //
			 * res.sendRedirect("/hin-web/main-screen/html/index.html"); }
			 * return; }
			 
			Action action = hinReq.getAction();
			try {
				switch (action) {
				case LOGIN:
					HinUserProfile hinUserProfile = login(hinReq, req, res);
					if (hinUserProfile != null) {
						HashMap<String, Object> map = new HashMap<String, Object>();
						HttpServletResponse httpServletResponse = null;
						Document xmlDocument = XMLHelper
								.getXMLDocument(hinUserProfile.getMessage());
						String messageID = (String) XMLHelper.read(xmlDocument,
								"//id[1]/@root", XPathConstants.STRING);
						String artifactID = (String) XMLHelper.read(
								xmlDocument, "name(/*)", XPathConstants.STRING);

						map.put(messageID, hinUserProfile.getMessage());
						hinResponse.setMessageID(messageID);
						hinResponse.setMessageXML(hinUserProfile.getMessage());
						hinResponse.setMessageMap(map);

						String profileIDXpath = "//controlActProcess/subject/registrationEvent/subject/identifiedEntity/identifiedPerson/id[1]/@root";// "//identifiedPerson[1]/id/@root";//
																																						// /personalRelationship/relationshipHolder/id/@root";
						String profileID = (String) XMLHelper.read(xmlDocument,
								profileIDXpath, XPathConstants.STRING);
						if (profileID != null && profileID.equals("???")) {
							profileID = "";
						}
						hinResponse.setProfileID(profileID);
						hinResponse.setKey(hinUserProfile.getKey());
						hinResponse.setUserName(hinUserProfile.getUserName());
						hinResponse.setArtifactID(artifactID);
						// System.out.println("\nAUTHENTICATED\n");
						
						 * HashMap<String, String> filterCritreria = new
						 * HashMap<String, String>();
						 * filterCritreria.put("UserName",
						 * hinUserProfile.getUserName());
						 * 
						 * identityProcessor.getUserList(hinUserProfile.getKey(),
						 * filterCritreria);
						 
						// chain.doFilter(request, response);
						presentationService.retrieveProfile(hinReq,
								hinResponse, filterConfig.getServletContext(),
								hinSession);
						hinResponseGson(res, hinResponse);

					} else {
						// System.out.println("\nDENIED\n");
						hinResponse.setErrorDesc("Not a valid user");
					}

					break;
				case ORGUSERREGISTRATION:
					// orgUserRegistration(req,res);
					break;
				case SEARCH_PROFILE:
					presentationService.retreiveLoggedInUserProfileMessage(
							hinResponse, hinReq.getProfileID());
					hinResponseGson(res, hinResponse);
					break;

				
				 * case SELECTED_PROFILE:
				 * identityProcessor.getProfile(hinReq.getSelectedProfileID());
				 

				case LOGOUT:
					// viewServices(request);
					chain.doFilter(request, response);
					// req.getSession().invalidate();
					break;
				default:
					chain.doFilter(request, response);
					break;
				}
			} catch (Exception e) {

			}
		}
	}

 * Used to update the profile picture
 * and the hence the profile.

	private void updateImage(MultipartHandler handler,
			HinUserProfile hinUserProfile) {
		try {
			String tagName = handler.getParameter("tagName");
			String xpath = handler.getParameter("imageXpath");
			String message = hinUserProfile.getMessage();
			FileItem profilePictureFileItem = handler
					.getFileParameter("profilePicture");
			Document messageDocument = XMLHelper.getXMLDocument(message);
			Node node = messageDocument.createElement(tagName);
			Attr mediaTypeAttr = messageDocument.createAttribute("mediaType");
			mediaTypeAttr.setNodeValue(profilePictureFileItem.getContentType());
			node.getAttributes().setNamedItem(mediaTypeAttr);
			Node imageNode = messageDocument.createTextNode(BinaryUtils
					.convertInputStreamToBase64(
							profilePictureFileItem.getInputStream(),
							(int) profilePictureFileItem.getSize()));
			// node.setNodeValue(
			// BinaryUtils.convertInputStreamToBase64(profilePictureFileItem.getInputStream(),
			// (int) profilePictureFileItem.getSize()));
			node.appendChild(imageNode);
			boolean insert = true;
			message = identityProcessor.updateProfile(xpath, node,
					messageDocument, insert, tagName);
			hinUserProfile.setMessage(message);
		} catch (Exception ex) {
			System.out.println(ex.getMessage());
			logger.error("UPdating profile failed: "+ex.getMessage());
		}

	}

	private void updateNewContact(MultipartHandler handler,
			HinUserProfile hinUserProfile) {
		
		 * try{ String xpath=handler.getParameter("NewContactXpath"); Node
		 * node=null ; String message=handler.getParameter("message"); boolean
		 * insert=true; message =
		 * identityProcessor.updateProfile(xpath,node,message,insert);
		 * hinUserProfile.setMessage(message); }catch(Exception ex){
		 * System.out.println(ex.getMessage()); }
		 
	}

 * METHOD TO WRITE HINRESPONSE AS JSON STRING TO THE RESPONSE.
	private void hinResponseGson(HttpServletResponse response,
			HINResponse hinResponse) throws Exception {
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
		response.getWriter().println(jsonFormat);

	}

	
	 * private boolean userRegistration(HttpServletRequest httpServletRequest,
	 * HttpServletResponse httpServletResponse) { // boolean multipart =
	 * isMultipart(httpServletRequest); if (multipart) { try { MultipartHandler
	 * handler = new MultipartHandler( httpServletRequest); try {
	 * handler.parse(); } catch (Exception e) {
	 * System.out.println("Error in parsing multipart request: ");
	 * e.printStackTrace(System.out); return true; } String requestType =
	 * handler.getParameter("requestType"); if (requestType != null &&
	 * requestType.equals("register")) { saveHinUser(httpServletRequest,
	 * httpServletResponse, handler); HINRequest hinRequest = new HINRequest();
	 * hinRequest.setUserName(handler.getParameter("userName"));
	 * hinRequest.setPassword(handler.getParameter("password"));
	 * login(hinRequest, httpServletRequest, httpServletResponse);
	 * orgUserRegistration(httpServletRequest, httpServletResponse, handler);
	 * return true; }
	 * 
	 * } catch (Exception e) { e.printStackTrace(); } } return false; }
	 

	*//**
	 * @param httpServletRequest
	 * @param multipart
	 * @return
	 *//*

 * METHOD TO CHECK WETHER THE MESSAGE IS MULTIMART MESSAGE OR NOT
	private boolean isMultipart(HttpServletRequest httpServletRequest) {
		if (httpServletRequest.getContentType() != null
				&& httpServletRequest.getContentType().toLowerCase()
						.indexOf("multipart/form-data") > -1) {
			handler = new MultipartHandler(httpServletRequest);
			httpServletRequest.setAttribute("handler", handler);
			try {
				handler.parse();
			} catch (Exception e) {
				System.out.println("Error in parsing multipart request: ");
				e.printStackTrace(System.out);
				logger.error("Error in parsing multipart request: "+e.getMessage());
				return true;
			}

			return true;
		}
		return false;
	}

 * Combine multipart message to single message.
	private String getMultiPartMessage(HttpServletRequest req,
			HttpServletResponse res) throws ServletException, IOException {
		res.addHeader("Cache-Control", "no-cache");
		res.addHeader("Pragma", "no-cache");
		res.addIntHeader("Expires", 0);
		res.setContentType("text/xml;charset=UTF-8");
		PrintWriter out = res.getWriter();
		MultipartHandler handler = new MultipartHandler(req);
		String message = null, userName = null, password = null;
		if (!ServletFileUpload.isMultipartContent(req)) {
			out.println("Only multipart content is supported.");
		}
		try {
			handler.parse();
		} catch (Exception e) {
			System.out.println("Error in parsing multipart request: ");
			e.printStackTrace(System.out);
			logger.error("Error in parsing multipart request: "+e.getMessage());
			return null;
		}
		message = handler.getParameter("message");
		if (message == null || message.length() < 1) {
			res.setStatus(HttpServletResponse.SC_NO_CONTENT);
			// System.out.println("Required parameters are missing.");
			return null;
		}
		// System.out.println("Received Message: ");
		// System.out.println(message);
		return message;
	}

 * Save subject details to the hinUserProfile from the multipart message.
	private void saveHinUser(HttpServletRequest httpServletRequest,
			HttpServletResponse httpServletResponse, boolean isOrganizationUser)
			throws Exception {
		httpServletResponse.addHeader("Cache-Control", "no-cache");
		httpServletResponse.addHeader("Pragma", "no-cache");
		httpServletResponse.addIntHeader("Expires", 0);

		try {
			HinUserProfile hinUserProfile = new HinUserProfile();
			hinUserProfile.setMessage(handler.getParameter("message"));
			hinUserProfile.setMessageId("messageid");
			hinUserProfile.setUserName(handler.getParameter("userName"));
			hinUserProfile.setPassword(handler.getParameter("password"));
			hinUserProfile.setKey(handler.getParameter("userName")
					+ handler.getParameter("password"));
			hinUserProfile.setOrganistaion(isOrganizationUser);
			String emailXpath = (isOrganizationUser) ? "//COCT_MT150000/telecom[1]/@use"
					: "//PRPA_IN000001/controlActProcess/subject/registrationEvent/subject/identifiedEntity/identifiedPerson/telecom[1]/@use";
			String toEmailID = (String) XMLHelper.read(
					XMLHelper.getXMLDocument(hinUserProfile.getMessage()),
					emailXpath, XPathConstants.STRING);
			hinUserProfile.setEmailId(toEmailID);
			try {
				identityProcessor.saveHinUserProfile(hinUserProfile);
				HINSession.getHINSession(httpServletRequest.getSession())
						.setHinUserProfile(hinUserProfile);
			} catch (Exception e) {
				e.printStackTrace();
				logger.error("Error in saving User Profile:"+e.getMessage());
				throw e;
			}

			HINSession hinSession = HINSession.getHINSession(httpServletRequest
					.getSession());
			String orgUserProfileKey = null;
			if (hinSession.getAttribute(HINSession.ORG_USER_PROFILE_SESSION) != null)
				orgUserProfileKey = hinSession.getAttribute(
						HINSession.ORG_USER_PROFILE_SESSION).toString();
			if (orgUserProfileKey != null && !isOrganizationUser) {
				mapUserAndOrganization(httpServletRequest);
			}

			httpServletResponse.getWriter().println(hinUserProfile.getKey());

		} catch (Exception e) {
			httpServletResponse
					.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			System.out.println("An error occured while saving the message: "
					+ e.getMessage());
			logger.error("An error occured while saving the message: "+e.getMessage());
			e.printStackTrace();
			throw e;
		}

	}

 * Login method to authenticate the user and load user profile.
	private HinUserProfile login(HINRequest hinReq, HttpServletRequest request,
			HttpServletResponse response) throws IOException {

		response.addHeader("Cache-Control", "no-cache");
		response.addHeader("Pragma", "no-cache");
		response.addIntHeader("Expires", 0);

		HttpSession session = request.getSession();
		HinUserProfile hinUserProfile = null;

		try {
			hinUserProfile = identityProcessor.identifyUser(
					hinReq.getUserName(), hinReq.getPassword());
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("An error occurred while identifying Users:"+e.getMessage());
		}
		if (hinUserProfile != null) {
			HINSession.getHINSession(session).setHinUserProfile(hinUserProfile);
		} else {// show error message not a valid user
			request.setAttribute("error", "Invalid user");
			response.sendRedirect("/hin-web/main-screen/html/index.html");
			return null;
		}
		if (HINSession.getHINSession(session).getAttribute(
				HINSession.ORG_USER_PROFILE_SESSION) != null) {
			String orgUserProfileKey = HINSession.getHINSession(session)
					.getAttribute(HINSession.ORG_USER_PROFILE_SESSION)
					.toString();
			if (!hinUserProfile.isOrganistaion()) {
				mapUserAndOrganization(request);
			}
		}
		return hinUserProfile;
	}

 * Method to register an organisation user from the activation url.
	private String orgUserRegistration(HttpServletRequest httpServletRequest,
			HttpServletResponse httpServletResponse) throws IOException {

		httpServletResponse.addHeader("Cache-Control", "no-cache");
		httpServletResponse.addHeader("Pragma", "no-cache");
		httpServletResponse.addIntHeader("Expires", 0);

		// HttpSession session = httpServletRequest.getSession(true);
		HinUserProfile hinUserProfile = null;
		String orgUserId = handler.getParameter("orgUserId");// to be
																// removed
		orgUserId = identityProcessor.generateRandomNumber();
		hinUserProfile = HINSession.getHINSession(
				httpServletRequest.getSession()).getHinUserProfile();
		try {
			String message = handler.getParameter("message");// getMultiPartMessage(httpServletRequest,
																// httpServletResponse);
			// message="multipartmessage";//to be removed
			HinOrgUserProfile hinOrgUserProfile = new HinOrgUserProfile();
			hinOrgUserProfile.setKey(orgUserId);
			hinOrgUserProfile.setMessage(message);
			String activationKey = identityProcessor
					.saveOrganizationUserProfile(hinUserProfile,
							hinOrgUserProfile);
			return activationKey;
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("An error occurred in saving Organisation User Profile: "+e.getMessage());
		}
		return null;
	}

 * Save the user details in the organisation profile(Linked profile column). 
	private void mapUserAndOrganization(HttpServletRequest httpServletRequest) {
		HinUserProfile hinUserProfile = null;
		String orgUserProfileKey = HINSession
				.getHINSession(httpServletRequest.getSession())
				.getAttribute(HINSession.ORG_USER_PROFILE_SESSION).toString();
		String[] temp;
		String delimiter = ":orgUserProfileId:";
		// System.out.println("");
		temp = orgUserProfileKey.split(delimiter);
		String orgKey = temp[0];
		String linkId = temp[1];
		hinUserProfile = HINSession.getHINSession(
				httpServletRequest.getSession()).getHinUserProfile();
		try {
			identityProcessor.mapUserAndOrganization(orgKey, linkId,
					hinUserProfile);
			HINSession.getHINSession(httpServletRequest.getSession())
					.removeAttribute(HINSession.ORG_USER_PROFILE_SESSION);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("An error occured in mapping User with Organisatio:"+e.getMessage());
		}
	}

 * Initialisation method for the security filter.
	
	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		try {
			identityProcessor = new IdentityProcessor();
			presentationService = new PresentationService();
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("An error occured in calling init method: "+e.getMessage());
		}
		this.filterConfig = filterConfig;
		// System.out.println(">>>>>>> HIN Security Filter initialized <<<<<<<");

		readConfig();
	}

	private void readConfig() {
		if (filterConfig != null) {

		}
	}
}
*/