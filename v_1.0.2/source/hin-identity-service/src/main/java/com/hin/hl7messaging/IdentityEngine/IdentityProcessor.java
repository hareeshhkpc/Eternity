package com.hin.hl7messaging.IdentityEngine;

import java.lang.reflect.Type;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import javax.annotation.Resource;
import javax.xml.xpath.XPathConstants;

import org.apache.log4j.Logger;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.stereotype.Service;
import org.w3c.dom.Attr;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.reflect.TypeToken;
import com.hin.hl7.messaging.api.IMessageRepository;
import com.hin.hl7messaging.GmailFetch;
import com.hin.hl7messaging.HinOrgUserProfile;
import com.hin.hl7messaging.HinUserProfile;
import com.hin.hl7messaging.UserProfileMessage;
import com.hin.hl7messaging.IdentityServices.IIdentityProcessor;
import com.hin.hl7messaging.config.HINConfigurationProperty;
import com.hin.hl7messaging.context.HINApplicationContext;
import com.hin.hl7messaging.utils.GMap;
import com.hin.hl7messaging.utils.XMLHelper;

@Service(value="identityProcessor")
public class IdentityProcessor implements IIdentityProcessor {
	private Logger logger = Logger.getLogger(IdentityProcessor.class.getName());
	
	@Resource(name="messageRepository")
	private IMessageRepository messageRepository = null;

	public IdentityProcessor() {

	}
	
/*
 * Used to validate the user at the time of login.
 * Input is username and password.
 * Output is corresponding profile if exists in the database.
*/
	@SuppressWarnings("unchecked")
	public HinUserProfile identifyUser(String userName, String password)
			throws Exception {
		Map<String, Map<String, Map<String, String>>> mainMap = new HashMap<String, Map<String, Map<String, String>>>();
		HinUserProfile hinUserProfile = null;
		HashMap<String, Object> valueMap = new HashMap<String, Object>();
		String key = "", value = "", message = "", messageID = "";
		boolean isOrganistaion = false, isOrg = false;
		/*
		 * List<String> list = new ArrayList<String>(); list.add("USER_NAME");
		 * list.add("PASSWORD");
		 */
		try {
			String usernameDb = "";
			String passwordDb = "";
			HashMap<String, Object> columnValueMap = new HashMap<String, Object>();
			columnValueMap.put("ROWKEY", userName + password);
			columnValueMap.put("USER_NAME", null);
			columnValueMap.put("PASSWORD", null);
			columnValueMap.put("REG_MESSAGE", null);
			// mainMap=thriftClient.querySuperColumnFamily(userName+password,
			// userName+password, list, "IDENTITY_INDEX", "", "", 5, 5);
			// messageRepository.connect("172.25.250.165", 9160, true);
			// messageRepository.selectKeyspace("MessageKS", true);
			mainMap = messageRepository.retrieveSuperColumnFamily(userName
					+ password, userName + password, "IDENTITY_REPO", null,
					null, columnValueMap);
			if (mainMap.isEmpty()) {
				return null;
			}
			Set rowKeySet = mainMap.entrySet();
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
					if (key.equals("USER_NAME") || key.equals("PASSWORD")
							|| key.equals("REG_MESSAGE")
							|| key.equals("IS_ORG")) {
						// Super Column is key
						if (key.equals("REG_MESSAGE")) {
							valueMap = (HashMap<String, Object>) subEntry
									.getValue();
							Set columnSet = valueMap.entrySet();
							Iterator itr = columnSet.iterator();
							while (itr.hasNext()) {
								Map.Entry valueEntry = (Map.Entry) itr.next();
								key = (String) valueEntry.getKey();
								// Column is key
								value = (String) valueEntry.getValue();
								messageID = (String) valueEntry.getKey();
								message = (String) valueEntry.getValue();
							}

						}
						if (key.equals("IS_ORG")) {
							isOrganistaion = true;
						} else {
							isOrganistaion = false;
						}
						valueMap = (HashMap<String, Object>) subEntry
								.getValue();
						Set columnSet = valueMap.entrySet();
						Iterator itr = columnSet.iterator();
						while (itr.hasNext()) {
							Map.Entry valueEntry = (Map.Entry) itr.next();
							key = (String) valueEntry.getKey();
							// Column is key
							if (isOrganistaion) {
								isOrg = ((String) valueEntry.getValue())
										.equals("true") ? true : false;
							}
							value = (String) valueEntry.getValue();
							if (value.equals(userName)) {
								usernameDb = value;
							}
							if (value.equals(password)) {
								passwordDb = value;
							}

						}
					}
				}
			}
			if (userName.equals(usernameDb) && password.equals(passwordDb)) {
				// HttpSession session= req.getSession();
				// loggedinUser.setUserName(username);
				// loggedinUser.setKey(username+"_"+password);
				// session.putValue("Key", loggedinUser);
				// return Boolean.TRUE;
				hinUserProfile = new HinUserProfile();
				hinUserProfile.setUserName(userName);
				hinUserProfile.setKey(userName + passwordDb);
				hinUserProfile.setMessage(message);
				hinUserProfile.setMessageId(messageID);
				hinUserProfile.setOrganistaion(isOrganistaion);
				return hinUserProfile;
			}
		} catch (Exception e) {
			logger.error("An error occured in idenifying User:"+e.getMessage());
		}
		return null;
	}

/*
 * Used to save the user details at the time of registering a subject.
 * Input is HinUserProfile.
 * It will write user details to the column family  "IDENTITY_REPO".
 * And the Index column family is also updated for the search lookup.
*/
	public void saveHinUserProfile(HinUserProfile hinUserProfile)
			throws Exception {
		hinUserProfile.setMessage(updateUserProfileIdInMessage(
				hinUserProfile.getKey(), hinUserProfile.getMessage()));
		HashMap<String, Object> columnValueMap = new HashMap<String, Object>();
		HashMap<String, String> userNameMap = new HashMap<String, String>();
		HashMap<String, String> passwordMap = new HashMap<String, String>();
		HashMap<String, String> isOrgMap = new HashMap<String, String>();
		HashMap<String, String> regMessageMap = new HashMap<String, String>();
		columnValueMap.put("ROWKEY", hinUserProfile.getKey());
		userNameMap.put("value", hinUserProfile.getUserName());
		passwordMap.put("value", hinUserProfile.getPassword());
		isOrgMap.put("value", hinUserProfile.isOrganistaion() == true ? "true"
				: "false");
		regMessageMap.put("PROFILE", hinUserProfile.getMessage());
		columnValueMap.put("USER_NAME", userNameMap);
		columnValueMap.put("PASSWORD", passwordMap);
		columnValueMap.put("REG_MESSAGE", regMessageMap);
		columnValueMap.put("IS_ORG", isOrgMap);
		messageRepository.saveMessage("IDENTITY_REPO", columnValueMap);
		updateIndexIdentity(hinUserProfile);
	}
/*
 * Write the orgUserProfile data to the database when a user login using the activation url.
 * The Organisation's Linked_Profile column is updated with the organisationUser's details.
 *  
*/	public String saveOrganizationUserProfile(HinUserProfile hinUserProfile,
			HinOrgUserProfile hinOrgUserProfile) throws Exception {
		// send mail
		GmailFetch gmailFetch = new GmailFetch();
		HashMap<String, Object> columnValueMap = new HashMap<String, Object>();
		HashMap<String, String> userNameMap = new HashMap<String, String>();
		HashMap<String, String> passwordMap = new HashMap<String, String>();
		HashMap<String, String> isOrgMap = new HashMap<String, String>();
		HashMap<String, String> linkedProfileMap = new HashMap<String, String>();
		HashMap<String, String> regMessageMap = new HashMap<String, String>();
		HashMap<String, Object> workflowMap = new HashMap<String, Object>();

		columnValueMap.put("ROWKEY", hinUserProfile.getKey());
		linkedProfileMap.put("LINKED_PROFILE", hinOrgUserProfile.getMessage());
		HashMap<String, String> hashMap = new HashMap<String, String>();
		hashMap.put("HinOrgUserProfile", hinOrgUserProfile.getKey());// unique
																		// id
																		// with
																		// uuid
																		// We
																		// can
																		// add
																		// more
																		// details
																		// in
																		// this
																		// map
																		// HinUserProfile
		workflowMap.put("value",
				addUserDetailsForOrgInJson(hinOrgUserProfile, hinUserProfile));

		columnValueMap.put(hinOrgUserProfile.getKey(), linkedProfileMap);
		columnValueMap.put("WORKFLOW", workflowMap);
		messageRepository.saveMessage("IDENTITY_REPO", columnValueMap);

		String emailXpath = "/COCT_MT150000/telecom[1]/@use";
		String fromEmailID = (String) XMLHelper.read(
				XMLHelper.getXMLDocument(hinUserProfile.getMessage()),
				emailXpath, XPathConstants.STRING);

		emailXpath = "//controlActProcess/subject/registrationEvent/subject/identifiedEntity/identifiedPerson/telecom[1]/@use";
		String toEmailID = (String) XMLHelper.read(
				XMLHelper.getXMLDocument(hinOrgUserProfile.getMessage()),
				emailXpath, XPathConstants.STRING);

		String activationKey = hinUserProfile.getKey() + ":orgUserProfileId:"
				+ hinOrgUserProfile.getKey();
		String activationURL = (String) HINApplicationContext
				.getHINApplicationContext().getConfigurationParameter(
						HINConfigurationProperty.ACCOUNT_ACTIVATION_URL);
		activationURL = activationURL + activationKey;

		// System.out.println("Activation Link: " + activationURL);

		 URL url = new URL(activationURL);
		 gmailFetch.sendmail(url, fromEmailID, toEmailID);

		return activationURL;
	}
/*
 * Map the user and the organisation.
 * Each user's profile message is stored in the organisations profile.
 * 
*/	public void mapUserAndOrganization(String orgId, String linkedId,
			HinUserProfile hinUserProfile) throws Exception {
		Map<String, Map<String, Map<String, String>>> mainMap = new HashMap<String, Map<String, Map<String, String>>>();
		HashMap<String, Object> valueMap = new HashMap<String, Object>();
		String key = "", message = "";
		HashMap<String, Object> columnValueMap = new HashMap<String, Object>();
		columnValueMap.put("ROWKEY", orgId);
		columnValueMap.put(linkedId, "");
		mainMap = messageRepository.retrieveSuperColumnFamily(orgId, orgId,
				"IDENTITY_REPO", null, null, columnValueMap);
		HinOrgUserProfile hinOrgUserProfile = new HinOrgUserProfile();
		hinOrgUserProfile.setKey(linkedId);
		hinOrgUserProfile.setOrgId(orgId);
		if (mainMap != null) {
			Set rowKeySet = mainMap.entrySet();
			Iterator iterator = rowKeySet.iterator();
			while (iterator.hasNext()) {
				Map.Entry entry = (Map.Entry) iterator.next();
				key = (String) entry.getKey();
				// System.out.println("RowKey: " + key);
				valueMap = (HashMap<String, Object>) entry.getValue();
				// hinOrgUserProfile.setKey(key);
				Set superColumnSet = valueMap.entrySet();
				Iterator iter = superColumnSet.iterator();
				while (iter.hasNext()) {
					Map.Entry subEntry = (Map.Entry) iter.next();
					key = (String) subEntry.getKey();
					if (key.equals(linkedId)) {
						// Super Column is key
						valueMap = (HashMap<String, Object>) subEntry
								.getValue();
						Set columnSet = valueMap.entrySet();
						Iterator itr = columnSet.iterator();
						while (itr.hasNext()) {
							Map.Entry valueEntry = (Map.Entry) itr.next();
							key = (String) valueEntry.getKey();
							// Column is key
							if (key.equals("LINKED_PROFILE")) {
								message = (String) valueEntry.getValue();
								hinOrgUserProfile.setMessage(message);
								break;
							}

						}
					}
				}
			}
		}
		hinUserProfile.setMessage(updateUserProfileMessageWithEmployerDetails(
				hinOrgUserProfile, hinUserProfile));
		saveOrganizationUserProfileInUserProfile(hinUserProfile,
				hinOrgUserProfile);
		updateUserProfileIdInOrgUserProfile(hinUserProfile, hinOrgUserProfile,
				linkedId);
		updateUserDetailsInOrgJsonList(hinOrgUserProfile, hinUserProfile);
		addOrgDetailsForUserInJson(hinOrgUserProfile, hinUserProfile);
	}
/*
 * Save the Organisation profile message in the user's profile.
 *  
*/	public void saveOrganizationUserProfileInUserProfile(
			HinUserProfile hinUserProfile, HinOrgUserProfile hinOrgUserProfile)
			throws Exception {

		HashMap<String, Object> columnValueMap = new HashMap<String, Object>();
		HashMap<String, String> linkedProfileMap = new HashMap<String, String>();
		columnValueMap.put("ROWKEY", hinUserProfile.getKey());
		linkedProfileMap.put("LINKED_PROFILE", hinOrgUserProfile.getMessage());
		linkedProfileMap.put("OrgId", hinOrgUserProfile.getOrgId());
		columnValueMap.put(hinOrgUserProfile.getKey(), linkedProfileMap);
		messageRepository.saveMessage("IDENTITY_REPO", columnValueMap);
	}
/*
 * Update the user details in the Organisation's profile.
 * 
*/	public void updateUserProfileIdInOrgUserProfile(
			HinUserProfile hinUserProfile, HinOrgUserProfile hinOrgUserProfile,
			String linkId) throws Exception {

		HashMap<String, Object> columnValueMap = new HashMap<String, Object>();
		HashMap<String, String> linkedProfileMap = new HashMap<String, String>();
		columnValueMap.put("ROWKEY", hinOrgUserProfile.getOrgId());
		linkedProfileMap.put("USER", hinUserProfile.getKey());
		linkedProfileMap.put(
				"LINKED_PROFILE",
				updateUserProfileIdInMessage(hinUserProfile.getKey(),
						hinOrgUserProfile.getMessage()));
		columnValueMap.put(linkId, linkedProfileMap);
		// messageRepository.connect();
		// messageRepository.selectKeyspace("MessageKS");
		messageRepository.saveMessage("IDENTITY_REPO", columnValueMap);
	}
/*
 * This method is not used.
 * It can be removed.
 * 
*/	public void updateWorkFlowCriteria(HinUserProfile hinUserProfile)
			throws Exception {
		HashMap<String, Object> columnValueMap = new HashMap<String, Object>();
		HashMap<String, String> workflowMap = new HashMap<String, String>();
		columnValueMap.put("ROWKEY", hinUserProfile.getKey());
		workflowMap.put("WORKFLOW_CRITERIA",
				hinUserProfile.getWorkFlowCriteria());
		messageRepository.saveMessage("IDENTITY_REPO", columnValueMap);
	}

	@SuppressWarnings("unchecked")
	public String getOrganisationUserDetails(
			HashMap<String, String> orgUserDetails) {
		JSONObject jsonObject = new JSONObject();
		Set subSet = orgUserDetails.entrySet();
		Iterator iter = subSet.iterator();
		while (iter.hasNext()) {
			Map.Entry subMapEntry = (Map.Entry) iter.next();
			jsonObject.put(subMapEntry.getKey(), subMapEntry.getValue());
		}
		JSONArray jsonArray = new JSONArray();
		jsonArray.add(jsonObject);
		// String jasonString = jsonArray.toString();
		// System.out.println(jsonArray);
		return jsonArray.toString();
	}
/*
 * Method the generate the profileId.
 * 
*/	public String generateRandomNumber() {
		UUID uuid = UUID.randomUUID();
		return uuid.toString();
	}

	/*
	 * private void updateUserDetailsInOrgJsonList(HinOrgUserProfile
	 * hinOrgUserProfile,HinUserProfile hinUserProfile) throws Exception{
	 * JsonArray orgUserDetailJson =
	 * getJsonArrayForOrg(hinOrgUserProfile.getOrgId()); for(JsonElement
	 * jsonUser:orgUserDetailJson){
	 * if(jsonUser.getAsJsonObject().get("HinOrgUserProfile"
	 * ).getAsString().equals(hinOrgUserProfile.getKey())){
	 * jsonUser.getAsJsonObject
	 * ().addProperty("UserName",hinUserProfile.getUserName() );
	 * jsonUser.getAsJsonObject().addProperty("UserId",hinUserProfile.getKey());
	 * } } updateOrganizationUserJson(hinOrgUserProfile.getOrgId(),
	 * orgUserDetailJson.toString()); }
	 */
/*
 * This method is not used.
 * It can be removed.
 * 
*/	public void updateOrganizationUserJson(String orgId, String jsonArrayObject)
			throws Exception {

		HashMap<String, Object> columnValueMap = new HashMap<String, Object>();
		HashMap<String, Object> workflowMap = new HashMap<String, Object>();
		columnValueMap.put("ROWKEY", orgId);
		workflowMap.put("value", jsonArrayObject);
		columnValueMap.put("WORKFLOW", workflowMap);
		// messageRepository.connect();
		// messageRepository.selectKeyspace("MessageKS");
		messageRepository.saveMessage("IDENTITY_REPO", columnValueMap);

	}

	/*
	 * private JsonArray getJsonArrayForOrg(String OrgId){ Map<String,
	 * Map<String, Map<String, String>>> mainMap = new HashMap<String,
	 * Map<String, Map<String, String>>>(); HashMap<String, Object>
	 * columnValueMap = new HashMap<String, Object>(); JsonArray jsonArray=null;
	 * columnValueMap.put("WORKFLOW", null); String key = "", message = "";
	 * JSONArray jasonArray = new JSONArray(); HashMap<String, Object> valueMap
	 * = new HashMap<String, Object>(); mainMap =
	 * messageRepository.retrieveSuperColumnFamily(OrgId, OrgId,
	 * "IDENTITY_REPO",null, null, columnValueMap); if (mainMap == null) {
	 * return null; } Set rowKeySet = mainMap.entrySet(); Iterator iterator =
	 * rowKeySet.iterator(); while (iterator.hasNext()) { Map.Entry entry =
	 * (Map.Entry) iterator.next(); key = (String) entry.getKey();
	 * System.out.println("RowKey: " + key); valueMap = (HashMap<String,
	 * Object>) entry.getValue();
	 * 
	 * Set superColumnSet = valueMap.entrySet(); Iterator iter =
	 * superColumnSet.iterator(); while (iter.hasNext()) { Map.Entry subEntry =
	 * (Map.Entry) iter.next(); key = (String) subEntry.getKey(); if
	 * (key.equals("WORKFLOW")) { valueMap = (HashMap<String, Object>)
	 * subEntry.getValue(); Set columnSet = valueMap.entrySet(); Iterator itr =
	 * columnSet.iterator();
	 * 
	 * while (itr.hasNext()) { Map.Entry valueEntry = (Map.Entry) itr.next();
	 * String jasonArrayString = (String) valueEntry.getValue();
	 * com.google.gson.JsonParser parser = new com.google.gson.JsonParser();
	 * JsonElement elem = parser.parse(jasonArrayString); jsonArray =
	 * elem.getAsJsonArray();
	 * 
	 * } } } } return jsonArray; } public HashMap<String,String>
	 * getUserList(String OrgId,HashMap<String, Object> filterCritreria){
	 * JsonArray orgUserDetailJson = getJsonArrayForOrg(OrgId); boolean
	 * flag=true; HashMap<String,String> users=new HashMap<String,String>();
	 * for(JsonElement jsonUser:orgUserDetailJson){ flag=true; Set set =
	 * filterCritreria.entrySet(); Iterator iterator = set.iterator(); while
	 * (iterator.hasNext()) { Map.Entry subMapEntry = (Map.Entry)
	 * iterator.next(); Set jsonUserSet = jsonUser.getAsJsonObject().entrySet();
	 * Iterator jsonUserIterator = set.iterator(); while
	 * (jsonUserIterator.hasNext()) { Map.Entry jsonUserProperty = (Map.Entry)
	 * iterator.next();
	 * if(((String)jsonUserProperty.getKey()).equals(subMapEntry
	 * .getKey().toString()) ){
	 * if(!((String)jsonUserProperty.getValue()).equals(
	 * subMapEntry.getValue().toString())){ flag=false; break; } } } if(!flag)
	 * break;
	 * 
	 * } if(flag) users.put(jsonUser.getAsJsonObject().get("UserId").toString(),
	 * jsonUser.getAsJsonObject().get("UserName").toString());
	 * 
	 * } return users; }
	 */
/*
 * Update the profile changes to the column family.
 * 
*/	public void updateMessageInColumnfamily(String rowKey, String message) {
		HashMap<String, Object> columnValueMap = new HashMap<String, Object>();
		HashMap<String, String> regMessageMap = new HashMap<String, String>();
		columnValueMap.put("ROWKEY", rowKey);
		regMessageMap.put("PROFILE", message);
		columnValueMap.put("REG_MESSAGE", regMessageMap);
		messageRepository.saveMessage("IDENTITY_REPO", columnValueMap);
	}

	/*
	 * public void getUserList(String rowKey,HashMap<String, String>
	 * filterCritreria) { Map<String, Map<String, Map<String, String>>> mainMap
	 * = new HashMap<String, Map<String, Map<String, String>>>();
	 * HashMap<String, Object> columnValueMap = new HashMap<String, Object>();
	 * columnValueMap.put("WORKFLOW", null); String key = "", message = "";
	 * JSONArray jasonArray = new JSONArray(); HashMap<String, Object> valueMap
	 * = new HashMap<String, Object>(); mainMap =
	 * messageRepository.retrieveSuperColumnFamily(rowKey, rowKey,
	 * "IDENTITY_REPO",null, null, columnValueMap); if (mainMap == null) {
	 * return; } Set rowKeySet = mainMap.entrySet(); Iterator iterator =
	 * rowKeySet.iterator(); while (iterator.hasNext()) { Map.Entry entry =
	 * (Map.Entry) iterator.next(); key = (String) entry.getKey();
	 * System.out.println("RowKey: " + key); valueMap = (HashMap<String,
	 * Object>) entry.getValue();
	 * 
	 * Set superColumnSet = valueMap.entrySet(); Iterator iter =
	 * superColumnSet.iterator(); while (iter.hasNext()) { Map.Entry subEntry =
	 * (Map.Entry) iter.next(); key = (String) subEntry.getKey(); if
	 * (key.equals("WORKFLOW")) { valueMap = (HashMap<String, Object>)
	 * subEntry.getValue(); Set columnSet = valueMap.entrySet(); Iterator itr =
	 * columnSet.iterator(); JsonArray jsonArray; while (itr.hasNext()) {
	 * Map.Entry valueEntry = (Map.Entry) itr.next(); String jasonArrayString =
	 * (String) valueEntry.getValue(); com.google.gson.JsonParser parser = new
	 * com.google.gson.JsonParser(); JsonElement elem =
	 * parser.parse(jasonArrayString); jsonArray = elem.getAsJsonArray();
	 * 
	 * } } } } Set set = filterCritreria.entrySet(); iterator = set.iterator();
	 * HashMap<String, String> users = null; for (Object o : jasonArray) {
	 * JSONObject jsonLineItem = (JSONObject) o; while (iterator.hasNext()) {
	 * Map.Entry subMapEntry = (Map.Entry) iterator.next();
	 * subMapEntry.getKey(); if (subMapEntry.getValue() ==
	 * jsonLineItem.get(subMapEntry .getKey())) { users.put("UserName", (String)
	 * jsonLineItem.get("UserName")); } } } }
	 */

/*
 * Update the user details in the organisation profile.
 * 
*/	private void updateUserDetailsInOrgJsonList(
			HinOrgUserProfile hinOrgUserProfile, HinUserProfile hinUserProfile)
			throws Exception {
		List<Map<String, String>> mapList = getJsonArrayForOrg(hinOrgUserProfile
				.getOrgId());

		for (Map<String, String> map : mapList) {
			if (map.get("HinOrgUserProfile") != null
					&& map.get("HinOrgUserProfile").equals(
							hinOrgUserProfile.getKey())) {
				map.put("UserName", hinUserProfile.getUserName());
				map.put("UserId", hinUserProfile.getKey());
				map.put("UserFullName",
						getUserFullNameFromMessage(hinUserProfile));
			}
		}
		String mapListToJson = convertHashMaptoJsonString(mapList);
		updateJsonInIdentityRepo(hinOrgUserProfile.getOrgId(), mapListToJson);
	}
/*
 * Convert user list in the organisation to json string.
 * 
*/	public String convertHashMaptoJsonString(List<Map<String, String>> mapList) {

		Gson gson = new Gson();
		Type tt = new TypeToken<List<Map<String, String>>>() {
		}.getType();
		String jsonString = gson.toJson(mapList, tt);

		/*
		 * JSONArray jsonArray = new JSONArray();
		 * 
		 * JSONObject jsonObject = new JSONObject(); for(Map<String, String> map
		 * : mapList){ jsonObject.put(((HinOrgUserProfile) map).getKey(),
		 * ((Entry) map).getValue());
		 * 
		 * 
		 * } Set subSet = map.entrySet();
		 * 
		 * Iterator iter = subSet.iterator(); while (iter.hasNext()) { Map.Entry
		 * subMapEntry = (Map.Entry) iter.next();
		 * jsonObject.put(subMapEntry.getKey(), subMapEntry.getValue()); }
		 * 
		 * jsonArray.add(jsonObject);
		 */

		return jsonString;
	}
/*
 * Update the new user details (JSON STRING) of the organisation to the column family.
 *  
*/	public void updateJsonInIdentityRepo(String orgId, String jsonArrayObject)
			throws Exception {

		HashMap<String, Object> columnValueMap = new HashMap<String, Object>();
		HashMap<String, Object> workflowMap = new HashMap<String, Object>();
		columnValueMap.put("ROWKEY", orgId);
		workflowMap.put("value", jsonArrayObject);
		columnValueMap.put("WORKFLOW", workflowMap);
		messageRepository.saveMessage("IDENTITY_REPO", columnValueMap);

	}
/*
 * Add the new user details to the organisation json string.
 * 
*/	private String addUserDetailsForOrgInJson(
			HinOrgUserProfile hinOrgUserProfile, HinUserProfile hinUserProfile)
			throws Exception {
		HashMap<String, String> organisationDetails = new HashMap<String, String>();
		organisationDetails
				.put("HinOrgUserProfile", hinOrgUserProfile.getKey());
		organisationDetails.put("userType", getUserType(hinOrgUserProfile));
		return getJsonStringForInIdentityRepo(hinUserProfile.getKey(),
				organisationDetails);
	}
/*
 * Add the user details in the organisation.
 * 
*/	private String addOrgDetailsForUserInJson(
			HinOrgUserProfile hinOrgUserProfile, HinUserProfile hinUserProfile)
			throws Exception {
		HashMap<String, String> organisationDetails = new HashMap<String, String>();
		organisationDetails.put("orgId", hinOrgUserProfile.getOrgId());
		organisationDetails.put("orgName", hinOrgUserProfile.getOrgId());
		String orgDetailsJson = getJsonStringForInIdentityRepo(
				hinUserProfile.getKey(), organisationDetails);
		updateJsonInIdentityRepo(hinUserProfile.getKey(), orgDetailsJson);
		return orgDetailsJson;
	}
/*
 * Return user list in the organisation as json string.
*/	@SuppressWarnings("unchecked")
	public String getJsonStringForInIdentityRepo(String RowKey,
			HashMap<String, String> jsonInput) throws Exception {
		List<Map<String, String>> mapList = getJsonArrayForOrg(RowKey);
		JSONObject jsonObject = new JSONObject();
		Set subSet = jsonInput.entrySet();
		Iterator iter = subSet.iterator();
		while (iter.hasNext()) {
			Map.Entry subMapEntry = (Map.Entry) iter.next();
			jsonObject.put(subMapEntry.getKey(), subMapEntry.getValue());
		}
		if (mapList == null) {
			mapList = new ArrayList<Map<String, String>>();
		}
		mapList.add(jsonObject);

		String mapListToJson = convertHashMaptoJsonString(mapList);
		return mapListToJson;
	}
/*
 * Retrieve the list of organisation users for the organisation
 * 
*/	private List<Map<String, String>> getJsonArrayForOrg(String OrgId)
			throws Exception {
		Map<String, Map<String, Map<String, String>>> mainMap = new HashMap<String, Map<String, Map<String, String>>>();
		HashMap<String, Object> columnValueMap = new HashMap<String, Object>();
		List<Map<String, String>> mapList = null;
		JsonArray jsonArray = null;
		columnValueMap.put("WORKFLOW", null);
		String key = "", message = "";
		JSONArray jasonArray = new JSONArray();
		HashMap<String, Object> valueMap = new HashMap<String, Object>();
		mainMap = messageRepository.retrieveSuperColumnFamily(OrgId, OrgId,
				"IDENTITY_REPO", null, null, columnValueMap);
		if (mainMap == null) {
			return null;
		}
		Set rowKeySet = mainMap.entrySet();
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
				if (key.equals("WORKFLOW")) {
					valueMap = (HashMap<String, Object>) subEntry.getValue();
					Set columnSet = valueMap.entrySet();
					Iterator itr = columnSet.iterator();

					while (itr.hasNext()) {
						Map.Entry valueEntry = (Map.Entry) itr.next();
						String jasonArrayString = (String) valueEntry
								.getValue();
						Gson gson = new Gson();
						ArrayList<HashMap<String, String>> hashMapObj = new ArrayList<HashMap<String, String>>();
						Type tt = new TypeToken<List<Map<String, String>>>() {
						}.getType();
						mapList = gson.fromJson(jasonArrayString, tt);
						/*
						 * com.google.gson.JsonParser parser = new
						 * com.google.gson.JsonParser(); JsonElement elem =
						 * parser.parse(jasonArrayString); jsonArray =
						 * elem.getAsJsonArray();
						 */

					}
				}
			}
		}
		return mapList;
	}
/*
 * Get the users list of the organisation.
 *  
*/	public HashMap<String, String> getUserListForOrg(String OrgId,
			HashMap<String, Object> filterCritreria) throws Exception {
		HashMap<String, String> users = new HashMap<String, String>();
		boolean flag = true;
		String userId = "", userName = "";
		List<Map<String, String>> mapList = getJsonArrayForOrg(OrgId);
		for (Map<String, String> map : mapList) {
			userId = "";
			userName = "";
			flag = true;
			Set set = filterCritreria.entrySet();
			Iterator iterator = set.iterator();
			while (iterator.hasNext()) {
				Map.Entry filterCritreriaEntry = (Map.Entry) iterator.next();
				if (!map.keySet().contains("HinOrgUserProfile")) {
					continue;
				}
				for (String key : map.keySet()) {
					if (key.equals("UserId")) {
						userId = map.get(key);
					} else if (key.equals("UserFullName")) {
						userName = map.get(key);
					}
					if (filterCritreriaEntry.getKey().toString().equals(key)) {
						if (!filterCritreriaEntry.getValue().toString()
								.equals(map.get(key))) {
							flag = false;
							break;
						}

					}
				}
				if (!flag)
					break;
			}
			if (flag) {
				if (userId == "") {
					for (String key : map.keySet()) {
						if (!map.keySet().contains("HinOrgUserProfile")) {
							continue;
						}
						if (key.equals("UserId")) {
							userId = map.get(key);
						} else if (key.equals("UserFullName")) {
							userName = map.get(key);
						}
					}
				}
				if (userId != "" && userName != "") {
					users.put(userId, userName);
				}
			}
		}
		return users;
	}
/*
 * Get organisation list of a user based on filter criteria
 * 
*/	public HashMap<String, String> getOrgListForUser(String useId,
			HashMap<String, Object> filterCritreria) throws Exception {
		HashMap<String, String> users = new HashMap<String, String>();
		boolean flag = true;
		String userId = "", userName = "";
		List<Map<String, String>> mapList = getJsonArrayForOrg(useId);
		if (mapList == null)
			return users;
		for (Map<String, String> map : mapList) {
			userId = "";
			userName = "";
			flag = true;
			Set set = filterCritreria.entrySet();
			Iterator iterator = set.iterator();
			while (iterator.hasNext()) {
				Map.Entry filterCritreriaEntry = (Map.Entry) iterator.next();
				for (String key : map.keySet()) {
					if (key.equals("orgId")) {
						userId = map.get(key);
					} else if (key.equals("orgName")) {
						userName = map.get(key);
					}
					if (filterCritreriaEntry.getKey().toString().equals(key)) {
						if (!filterCritreriaEntry.getValue().toString()
								.equals(map.get(key))) {
							flag = false;
							break;
						}

					}
				}
				if (!flag)
					break;
			}
			if (flag) {
				if (userId == "") {
					for (String key : map.keySet()) {
						if (key.equals("orgId")) {
							userId = map.get(key);
						} else if (key.equals("orgName")) {
							userName = map.get(key);
						}
					}
				}
				users.put(userId, userName);
			}
		}
		return users;
	}

	public HashMap<String, String> getRelatedUsers(String userId)
			throws Exception {
		HashMap<String, String> objRelatedUserList = new HashMap<String, String>();
		HashMap<String, String> objOrgList = new HashMap<String, String>();
		objOrgList = getOrgListForUser(userId, new HashMap<String, Object>());
		for (String orgId : objOrgList.keySet()) {
			if (orgId != "") {
				objRelatedUserList.putAll(getUserListForOrg(orgId,
						new HashMap<String, Object>()));
			}
		}
		return objRelatedUserList;
	}

	public void mapUsers(HinUserProfile hinUserProfile,
			HashMap<String, String> userDetails) throws Exception {
		Map<String, Map<String, Map<String, String>>> mainMap = new HashMap<String, Map<String, Map<String, String>>>();
		HashMap<String, Object> valueMap = new HashMap<String, Object>();
		if (!userDetails.containsKey("userID")) {
			return;
		}
		String userID = userDetails.get("userID");
		/*
		 * String key="", message=""; HashMap<String, Object> columnValueMap =
		 * new HashMap<String, Object>(); columnValueMap.put("ROWKEY", userID);
		 * mainMap=messageRepository.retrieveSuperColumnFamily(userID, userID,
		 * "IDENTITY_REPO", null, null, columnValueMap); if(mainMap!=null){ Set
		 * rowKeySet = mainMap.entrySet(); Iterator iterator =
		 * rowKeySet.iterator(); while (iterator.hasNext()) { Map.Entry entry =
		 * (Map.Entry) iterator.next(); key = (String) entry.getKey();
		 * System.out.println("RowKey: " + key); valueMap = (HashMap<String,
		 * Object>) entry.getValue(); //hinOrgUserProfile.setKey(key); Set
		 * superColumnSet = valueMap.entrySet(); Iterator iter =
		 * superColumnSet.iterator(); while (iter.hasNext()) { Map.Entry
		 * subEntry = (Map.Entry) iter.next(); key = (String) subEntry.getKey();
		 * if(key.equals("REG_MESSAGE")){ message = (String)
		 * subEntry.getValue(); } } } }
		 */
		// addFriendDetailsForUserInJson(hinUserProfile.getKey(),userID);
		// addFriendDetailsForUserInJson(userID,hinUserProfile.getKey());
		addFriendDetailsForUserInJson(userID, userDetails);
	}

	private void addFriendDetailsForUserInJson(String updatingUser,
			String userId) throws Exception {
		HashMap<String, String> userDetails = new HashMap<String, String>();
		userDetails.put("userId", userId);
		String orgDetailsJson = getJsonStringForInIdentityRepo(updatingUser,
				userDetails);
		updateJsonInIdentityRepo(updatingUser, orgDetailsJson);

	}

	private void addFriendDetailsForUserInJson(String updatingUser,
			HashMap<String, String> userDetails) throws Exception {
		String orgDetailsJson = getJsonStringForInIdentityRepo(updatingUser,
				userDetails);
		updateJsonInIdentityRepo(updatingUser, orgDetailsJson);

	}
/*
 * Retrieve profile details.
 * 
*/	public String getProfile(String userId) throws Exception {
		Map<String, Map<String, Map<String, String>>> mainMap = new HashMap<String, Map<String, Map<String, String>>>();
		HashMap<String, Object> valueMap = new HashMap<String, Object>();
		String key = "", value = "", message = "", messageID = "";
		HashMap<String, Object> columnValueMap = new HashMap<String, Object>();
		columnValueMap.put("ROWKEY", userId);
		columnValueMap.put("USER_NAME", null);
		columnValueMap.put("PASSWORD", null);
		columnValueMap.put("REG_MESSAGE", null);
		mainMap = messageRepository.retrieveSuperColumnFamily(userId, userId,
				"IDENTITY_REPO", null, null, columnValueMap);
		if (mainMap == null) {
			return null;
		}

		Set rowKeySet = mainMap.entrySet();
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
					// Super Column is key
					if (key.equals("REG_MESSAGE")) {
						valueMap = (HashMap<String, Object>) subEntry
								.getValue();
						Set columnSet = valueMap.entrySet();
						Iterator itr = columnSet.iterator();
						while (itr.hasNext()) {
							Map.Entry valueEntry = (Map.Entry) itr.next();
							messageID = (String) valueEntry.getKey();
							message = (String) valueEntry.getValue();
						}

					}
				}
			}
		}
		return message;
	}
/*
 * Update profile.
 * 
*/	public String updateProfile(String xpath, Node node,
			Document messageDocument, boolean insert, String tagName) {
		xpath = "//controlActProcess/subject/registrationEvent/subject/identifiedEntity/identifiedPerson";
		NodeList baseNodeList = (NodeList) XMLHelper.read(messageDocument,
				xpath, XPathConstants.NODESET);
		Node newNode = null;
		if (baseNodeList.getLength() < 1) {
			return XMLHelper.getXMLDocumentAsString(messageDocument);
		} else {
			xpath = xpath + "/" + tagName;
			NodeList nodeList = (NodeList) XMLHelper.read(messageDocument,
					xpath, XPathConstants.NODESET);
			if (nodeList.getLength() < 1) {
				/*
				 * NodeList identifyiedPersonsIdProperty
				 * =((Element)baseNodeList.item(0)).getElementsByTagName("id");
				 * if(identifyiedPersonsIdProperty.getLength() < 1){ Node
				 * idNode= messageDocument.createElement("id");
				 * ((Element)baseNodeList.item(0)).appendChild(idNode);
				 * System.out.println("Id tag added"); } NodeList
				 * identifyiedPersonsNameProperty
				 * =((Element)baseNodeList.item(0)
				 * ).getElementsByTagName("name");
				 * if(identifyiedPersonsNameProperty.getLength() < 1){ Node
				 * idNode= messageDocument.createElement("name");
				 * ((Element)baseNodeList.item(0)).appendChild(idNode);
				 * System.out.println("name tag added"); }
				 */
				NodeList identifyiedPersonsDescProperty = ((Element) baseNodeList
						.item(0)).getElementsByTagName("desc");
				if (identifyiedPersonsDescProperty.getLength() < 1) {
					// ((Element)baseNodeList.item(0)).appendChild(node);
					((Element) baseNodeList.item(0))
							.insertBefore(node,
									((Element) baseNodeList.item(0))
											.getElementsByTagName("statusCode")
											.item(0));
					// System.out.println("Image added to message");
				}

				/*
				 * NodeList identifyiedPersonProperties
				 * =((Element)baseNodeList.item(0)).getChildNodes(); NodeList
				 * identifyiedPersons2
				 * =messageDocument.getElementsByTagName("identifiedPerson");
				 * if(identifyiedPersons2.getLength() < 1){
				 * System.out.println("Working"); }
				 * if(identifyiedPersonProperties.getLength() < 1){
				 * ((Element)baseNodeList.item(0)).appendChild(node); return
				 * XMLHelper.getXMLDocumentAsString(messageDocument);
				 * 
				 * }else{ ((Element)baseNodeList.item(0)).appendChild(node);
				 * //identifyiedPersonProperties for(int
				 * i=0;i<identifyiedPersons.getLength();i++){
				 * ((Node)identifyiedPersons.item(i)).appendChild(node);
				 * 
				 * break; } try{ Node lastNode =
				 * identifyiedPersons.item(identifyiedPersons.getLength() - 1);
				 * lastNode.insertBefore(node, lastNode);}catch(Exception
				 * ex){System.out.println("Error while adding node.");} }
				 */
			} else {
				baseNodeList.item(0).replaceChild(node, nodeList.item(0));
			}

		}
		return XMLHelper.getXMLDocumentAsString(messageDocument);
	}
/*
 * Save the location of the organisation in the GMAP.
 * 
*/	public void saveGmapLocation(HinUserProfile hinUserProfile, GMap map) {
		/*
		 * BinaryUtils convertToBase64 = new BinaryUtils(); String lat =
		 * handler.getParameter("lat"); String lng =
		 * handler.getParameter("lng"); String title =
		 * handler.getParameter("title"); String content =
		 * handler.getParameter("content"); FileItem logoFileItem =
		 * handler.getFileParameter("logo"); FileItem iconFileItem =
		 * handler.getFileParameter("icon"); String icon =
		 * BinaryUtils.convertInputStreamToBase64(iconFileItem.getInputStream(),
		 * (int) iconFileItem.getSize()); String logo =
		 * BinaryUtils.convertInputStreamToBase64(logoFileItem.getInputStream(),
		 * (int) logoFileItem.getSize()); GMap map = new GMap(lat, lng, title,
		 * content, icon, logo);
		 */
		String mapJson = new Gson().toJson(map);
		HashMap<String, Object> columnValueMap = new HashMap<String, Object>();
		columnValueMap.put("ROWKEY", hinUserProfile.getKey());
		columnValueMap.put("LOCATION_JSON", mapJson);
		messageRepository.saveMessage("CF_GMAP_LOCATIONS", columnValueMap);
		// if(hinUserProfile.isOrganistaion()){
		updateIndexGmap(hinUserProfile.getUserName(), hinUserProfile.getKey());
		// }
	}
/*
 * Retrieve the organisation GMAP locations.
 * 
*/	public List<GMap> fetchGmapLocation(String orgId) {
		Gson gson = new Gson();
		Map<String, HashMap<String, String>> resultMap;
		resultMap = messageRepository.retrieveStandardColumnFamily(
				"CF_GMAP_LOCATIONS", orgId);
		Set rowKeySet = resultMap.entrySet();
		Iterator iterator = rowKeySet.iterator();
		List<GMap> gmapLocations = new ArrayList<GMap>();
		String message = "";
		String path = (String) HINApplicationContext.getHINApplicationContext()
				.getConfigurationParameter(
						HINConfigurationProperty.CONTEXT_PATH);
		while (iterator.hasNext()) {
			Map.Entry entry = (Map.Entry) iterator.next();
			String key = (String) entry.getKey();
			HashMap<String, String> valueMap = (HashMap<String, String>) entry
					.getValue();
			Set columnSet = valueMap.entrySet();
			Iterator iter = columnSet.iterator();
			List newList = new ArrayList<String>();
			while (iter.hasNext()) {
				Map.Entry subEntry = (Map.Entry) iter.next();
				key = (String) subEntry.getKey();
				message = subEntry.getValue().toString();
				if (message != null && !(key.equals("KEY"))) {
					GMap gmap = gson.fromJson(message, GMap.class);
					gmap.setPath(path);
					gmapLocations.add(gmap);
				}
			}
		}
		return gmapLocations;
	}

	/*
	 * private void updateContact(String message){ String
	 * personalRelationshipXpath=
	 * "PRPA_IN000001/controlActProcess/subject/registrationEvent/subject/identifiedEntity/identifiedPerson/personalRelationship"
	 * ; String contact=
	 * "<personalRelationship classCode=\"\" id=\"id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id382_1\">"
	 * +
	 * "<code id=\"id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id382_1_id386_1\" nullFlavor=\"\"/>"
	 * +
	 * "<relationshipHolder classCode=\"\" determinerCode=\"\" id=\"id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id382_1_id388_1\">"
	 * +
	 * "<name id=\"id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id382_1_id388_1_id470_1\"/>"
	 * +
	 * "<id extension=\"\" id=\"id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id382_1_id388_1_id469_1\" root=\"\"/>"
	 * + "</relationshipHolder>"+ "</personalRelationship>"; Document
	 * messageDocument = XMLHelper .getXMLDocument(message); Document
	 * personalRelationshipDocument;
	 * 
	 * 
	 * NodeList personalRelationshipNodeList = (NodeList)
	 * XMLHelper.read(messageDocument,personalRelationshipXpath,
	 * XPathConstants.NODESET); if(personalRelationshipNodeList.getLength()<1){
	 * personalRelationshipDocument = XMLHelper .getXMLDocument(contact);
	 * ((Element)personalRelationshipNodeList.item(0)).insertBefore(
	 * personalRelationshipDocument,
	 * ((Element)personalRelationshipNodeList.item(
	 * 0)).getElementsByTagName("birthplace").item(0));
	 * 
	 * }else{ int i=personalRelationshipNodeList.getLength();
	 * contact.replaceAll("_id382_"+i, "_id382_"+(i+1));
	 * personalRelationshipDocument = XMLHelper .getXMLDocument(contact);
	 * ((Element)personalRelationshipNodeList.item(0)).insertBefore(
	 * personalRelationshipDocument,
	 * ((Element)personalRelationshipNodeList.item(
	 * 0)).getElementsByTagName("birthplace").item(0)); } }
	 */

/*
 * Update user's profileId in message.
 * 
*/	private String updateUserProfileIdInMessage(String profileId, String message) {
		String profileIdXpath = "//controlActProcess/subject/registrationEvent/subject/identifiedEntity/identifiedPerson/id[1]";
		Document messageDocument = XMLHelper.getXMLDocument(message);
		NodeList profileIDNodeList = (NodeList) XMLHelper.read(messageDocument,
				profileIdXpath, XPathConstants.NODESET);
		if (profileIDNodeList.getLength() < 1) {
			return message;
		} else {
			NamedNodeMap obj = profileIDNodeList.item(0).getAttributes();
			obj.getNamedItem("root").setNodeValue(profileId);
		}
		return XMLHelper.getXMLDocumentAsString(messageDocument);
	}
/*
 * Update the user profile message with the employee details.
 * 
*/	private String updateUserProfileMessageWithEmployerDetails(
			HinOrgUserProfile hinOrgUserProfile, HinUserProfile hinUserProfile) {
		String employerUserMessage = hinOrgUserProfile.getMessage();
		String userMessage = hinUserProfile.getMessage();
		String profileIdXpath = "//controlActProcess/subject/registrationEvent/subject/identifiedEntity/identifiedPerson/asEmployment";
		String xpath = "//controlActProcess/subject/registrationEvent/subject/identifiedEntity/identifiedPerson";
		String contact;
		Document employerMessageDocument = XMLHelper
				.getXMLDocument(employerUserMessage);
		Document userDocument = XMLHelper.getXMLDocument(userMessage);
		NodeList employerUserDetailNodeList = (NodeList) XMLHelper
				.read(employerMessageDocument, profileIdXpath,
						XPathConstants.NODESET);
		if (employerUserDetailNodeList.getLength() < 1) {
			return userMessage;
		}

		/*
		 * <!-- asEmployment --> <asEmployment classCode=""
		 * id="id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id372_1">
		 * <employerOrganization classCode="" determinerCode=""
		 * id="id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id372_1_id298_1"
		 * > <name id=
		 * "id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id372_1_id298_1_id75_1"
		 * /> <telecom id=
		 * "id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id372_1_id298_1_id78_1"
		 * /> <telecom id=
		 * "id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id372_1_id298_1_id78_2"
		 * /> <addr id=
		 * "id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id372_1_id298_1_id79_1"
		 * > <country></country> <state></state> <city></city>
		 * <postalCode></postalCode> <streetName></streetName>
		 * <houseNumber></houseNumber> </addr> </employerOrganization>
		 * </asEmployment>
		 */
		NodeList emplymentNodeList = (NodeList) XMLHelper.read(userDocument,
				profileIdXpath, XPathConstants.NODESET);
		int i = emplymentNodeList.getLength();
		Node emplymentNode = userDocument.createElement("asEmployment");
		Attr mediaTypeAttr = userDocument.createAttribute("id");
		contact = "id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id372_1";
		contact.replaceAll("_id372_" + i, "_id372_" + (i + 1));
		mediaTypeAttr.setNodeValue(contact);
		emplymentNode.getAttributes().setNamedItem(mediaTypeAttr);

		Node employerOrganizationNode = userDocument
				.createElement("employerOrganization");
		Attr mediaTypeAttr1 = userDocument.createAttribute("id");
		contact = "id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id372_1_id298_1";
		contact.replaceAll("_id372_" + i, "_id372_" + (i + 1));
		mediaTypeAttr1.setNodeValue(contact);
		employerOrganizationNode.getAttributes().setNamedItem(mediaTypeAttr1);

		Node employeeOrgid = userDocument.createElement("id");
		Attr mediaTypeAttr4 = userDocument.createAttribute("root");
		mediaTypeAttr4.setNodeValue(hinOrgUserProfile.getOrgId());
		employeeOrgid.getAttributes().setNamedItem(mediaTypeAttr4);

		Node employeeName = userDocument.createElement("name");
		Attr nameAtr1 = userDocument.createAttribute("id");
		contact = "id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id372_1_id298_1_id75_1";
		contact.replaceAll("_id372_" + i, "_id372_" + (i + 1));
		nameAtr1.setNodeValue(contact);
		employeeName.getAttributes().setNamedItem(nameAtr1);

		Node employeeTelecome1 = userDocument.createElement("telecom");
		Attr telecomeAtr1 = userDocument.createAttribute("id");
		contact = "id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id372_1_id298_1_id78_1";
		contact.replaceAll("_id372_" + i, "_id372_" + (i + 1));
		telecomeAtr1.setNodeValue(contact);
		employeeTelecome1.getAttributes().setNamedItem(telecomeAtr1);

		Node employeeTelecome2 = userDocument.createElement("telecom");
		Attr telecomeAtr2 = userDocument.createAttribute("id");
		contact = "id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id372_1_id298_1_id78_2";
		contact.replaceAll("_id372_" + i, "_id372_" + (i + 1));
		telecomeAtr2.setNodeValue(contact);
		employeeTelecome2.getAttributes().setNamedItem(telecomeAtr2);

		Node addrNode = userDocument.createElement("addr");
		Attr mediaTypeAttr3 = userDocument.createAttribute("id");
		contact = "id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id372_1_id298_1_id79_1";
		contact.replaceAll("_id372_" + i, "_id372_" + (i + 1));
		mediaTypeAttr3.setNodeValue(contact);
		addrNode.getAttributes().setNamedItem(mediaTypeAttr3);

		employerOrganizationNode.appendChild(employeeOrgid);
		employerOrganizationNode.appendChild(employeeName);
		employerOrganizationNode.appendChild(employeeTelecome1);
		employerOrganizationNode.appendChild(employeeTelecome2);
		employerOrganizationNode.appendChild(addrNode);
		emplymentNode.appendChild(employerOrganizationNode);

		return updateUserProfile(xpath, emplymentNode, userDocument, true,
				"asCitizen", "asEmployment");

		/*
		 * //String abc=""; String profileIdXpath=
		 * "//controlActProcess/subject/registrationEvent/subject/identifiedEntity/identifiedPerson/asEmployment"
		 * ; try{ Document employerMessageDocument = XMLHelper
		 * .getXMLDocument(employerUserMessage); Document userDocument =
		 * XMLHelper .getXMLDocument(userMessage); NodeList
		 * employerUserDetailNodeList = (NodeList)
		 * XMLHelper.read(employerMessageDocument,profileIdXpath,
		 * XPathConstants.NODESET);
		 * if(employerUserDetailNodeList.getLength()<1){ return userMessage;
		 * }else{ NodeList userDetailNodeList = (NodeList)
		 * XMLHelper.read(userDocument,profileIdXpath, XPathConstants.NODESET);
		 * if (userDetailNodeList.getLength()<1){
		 * 
		 * NodeList personDetailsList = (NodeList)
		 * XMLHelper.read(userDocument,profileIdXpath, XPathConstants.NODESET);
		 * for(int i=0;i<employerUserDetailNodeList.getLength();i++){
		 * ((Element)personDetailsList
		 * .item(0)).insertBefore(employerUserDetailNodeList.item(i),
		 * ((Element)personDetailsList
		 * .item(0)).getElementsByTagName("asCitizen").item(0)); }
		 * 
		 * }else{ for(int i=0;i<employerUserDetailNodeList.getLength();i++){
		 * Node lastNode =
		 * userDetailNodeList.item(userDetailNodeList.getLength() - 1);
		 * ((Element
		 * )userDetailNodeList.item(userDetailNodeList.getLength()-1)).insertBefore
		 * (employerUserDetailNodeList.item(i), lastNode); } }
		 * 
		 * } return XMLHelper.getXMLDocumentAsString(userDocument);
		 * }catch(Exception ex){ System.out.println(
		 * "Erroe while upating employer details in user profile.:- "
		 * +ex.getMessage()); } return userMessage;
		 */
	}
/*
 * Update the index column family for the identity_repo.
 * 
*/	public void updateIndexIdentity(HinUserProfile hinUserProfile) {
		HashMap<String, Object> columnValueMapIndex = new HashMap<String, Object>();
		HashMap<String, String> indexNameMap = new HashMap<String, String>();
		String prefixXpath = (hinUserProfile.isOrganistaion()) ? "//COCT_MT150000/name[1]/prefix"
				: "//controlActProcess/subject/registrationEvent/subject/identifiedEntity/identifiedPerson/name[1]/prefix";
		String givenXpath = (hinUserProfile.isOrganistaion()) ? "//COCT_MT150000/name[1]/given"
				: "//controlActProcess/subject/registrationEvent/subject/identifiedEntity/identifiedPerson/name[1]/given";
		String familyXpath = (hinUserProfile.isOrganistaion()) ? "//COCT_MT150000/name[1]/family"
				: "//controlActProcess/subject/registrationEvent/subject/identifiedEntity/identifiedPerson/name[1]/family";

		String prefix = (String) XMLHelper.read(
				XMLHelper.getXMLDocument(hinUserProfile.getMessage()),
				prefixXpath, XPathConstants.STRING);
		String given = (String) XMLHelper.read(
				XMLHelper.getXMLDocument(hinUserProfile.getMessage()),
				givenXpath, XPathConstants.STRING);
		String family = (String) XMLHelper.read(
				XMLHelper.getXMLDocument(hinUserProfile.getMessage()),
				familyXpath, XPathConstants.STRING);
		if (given.length() >= 3) {
			String rowKey = given.substring(0, 3).toUpperCase();
			indexNameMap.put(hinUserProfile.getKey(), prefix + " " + given
					+ " " + family);
			columnValueMapIndex.put("ROWKEY", rowKey);
			columnValueMapIndex.put("IDENTITY_REPO_KEY", indexNameMap);
			messageRepository.saveMessage("IN_IDENTITY_REPO_BY_NAME",
					columnValueMapIndex);
		}

	}
/*
 * Update the index column family for the GMAP.
 * 
*/	public void updateIndexGmap(String orgId, String orgKey) {
		HashMap<String, String> indexNameMap = new HashMap<String, String>();
		if (orgKey.length() >= 3) {
			HashMap<String, Object> columnValueMapIndex = new HashMap<String, Object>();
			String rowKey = orgId.substring(0, 3);
			indexNameMap.put(orgKey, orgId);
			columnValueMapIndex.put("ROWKEY", rowKey.toUpperCase());
			columnValueMapIndex.put("ORG_KEY", indexNameMap);
			messageRepository.saveMessage("IN_GMAP_BY_ORG_NAME",
					columnValueMapIndex);
		}
	}

	/**
	 * 
	 */

/*
 * Search the organisation location from the index of the GMAP locations.
 * 
*/	public List<Object[]> searchOrgLocation(String rowKey, String columnFamily)
			throws Exception {
		IMessageRepository messageRepository = (IMessageRepository) HINApplicationContext
				.getHINApplicationContext().getRepositoryBean();
		Map<String, Map<String, Map<String, String>>> resultMap;
		HashMap<String, Object> columnValueMap = new HashMap<String, Object>();
		columnValueMap.put("ORG_KEY", "");
		List<Object[]> services = new ArrayList<Object[]>();
		resultMap = messageRepository.retrieveSuperColumnFamily(rowKey, rowKey,
				columnFamily, null, null, columnValueMap);
		if (!resultMap.isEmpty()) {
			String key = "", value = "";
			HashMap<String, Object> valueMap = new HashMap<String, Object>();

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
					key = (String) subEntry.getKey();// Super Column is key
					if (!key.equals("ROWKEY")) {
						valueMap = (HashMap<String, Object>) subEntry
								.getValue();
						Set columnSet = valueMap.entrySet();
						Iterator itr = columnSet.iterator();
						while (itr.hasNext()) {
							Object[] obj = new Object[2];
							Map.Entry valueEntry = (Map.Entry) itr.next();
							key = (String) valueEntry.getKey(); // Column is key
							value = (String) valueEntry.getValue();// value is
																	// value
							obj[0] = key;
							obj[1] = value;
							services.add(obj);
						}
					}
				}
			}
		}
		return services;
	}
/*
 * Search contacts using the lookup.
 * 
*/	public List<Object[]> searchContacts(String rowKey, String columnFamily)
			throws Exception {
		String key = "", value = "";
		if (rowKey.length() > 2) {
			rowKey = rowKey.substring(0, 3);
		} else {
			rowKey = rowKey + "AAA";
			rowKey = rowKey.substring(0, 3);
		}
		HashMap<String, Object> valueMap = new HashMap<String, Object>();
		Map<String, Map<String, Map<String, String>>> resultMap;
		HashMap<String, Object> columnValueMap = new HashMap<String, Object>();
		columnValueMap.put("IDENTITY_REPO_KEY", "");
		List<Object[]> services = new ArrayList<Object[]>();
		resultMap = messageRepository.retrieveSuperColumnFamily(
				rowKey.substring(0, 3), rowKey.substring(0, 3), columnFamily,
				null, null, columnValueMap);
		if (!resultMap.isEmpty()) {
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
					key = (String) subEntry.getKey();// Super Column is key
					if (!key.equals("ROWKEY")) {
						valueMap = (HashMap<String, Object>) subEntry
								.getValue();
						Set columnSet = valueMap.entrySet();
						Iterator itr = columnSet.iterator();
						while (itr.hasNext()) {
							Object[] obj = new Object[2];
							Map.Entry valueEntry = (Map.Entry) itr.next();
							key = (String) valueEntry.getKey(); // Column is key
							value = (String) valueEntry.getValue();// value is
																	// value
							obj[0] = key;
							obj[1] = value;
							services.add(obj);
						}
					}
				}
			}
		}
		return services;
	}
/*
 * Search users of an organisation.
 * 
*/	public List<Object[]> searchUsersByOrgId(String name, String orgId) throws Exception {
		HashMap<String, String> services = new HashMap<String, String>();
		String key = "", value = "";
		HashMap<String, Object> valueMap = new HashMap<String, Object>();
		List<Object[]> selectedOrgId = new ArrayList<Object[]>();
		services = getUserListForOrg(orgId, new HashMap<String, Object>());
		if (!services.isEmpty()) {
			Set rowKeySet = services.entrySet();
			Iterator iterator = rowKeySet.iterator();
			while (iterator.hasNext()) {
				Object[] obj = new Object[2];
				Map.Entry entry = (Map.Entry) iterator.next();
				String fullName = (String) entry.getValue();
				String given = fullName != null ? fullName.substring(fullName.indexOf(" ") + 1, fullName.lastIndexOf(" ")).trim() : "";
				key = (String) entry.getKey();
				if (given.toUpperCase().startsWith(name)) {
					obj[0] = key;
					obj[1] = fullName;
					selectedOrgId.add(obj);
				}
			}
		}
		return selectedOrgId;
	}

	public void createUserRelationships(String loginUserId,
			String friendUserId, String message, String relationship)
			throws Exception {
		String loginUserMessage = getProfile(loginUserId);
		String friendUserMessage = getProfile(friendUserId);
		String ReferenceNodeName = "coveredParty";
		String tagName = "personalRelationship";
		String xpath = "//controlActProcess/subject/registrationEvent/subject/identifiedEntity/identifiedPerson";
		if (relationship != null && relationship.equals("nextOfKin")) {
			ReferenceNodeName = "emergencyContact";
			tagName = "nextOfKin";
		} else if (relationship != null
				&& relationship.equals("emergencyContact")) {
			ReferenceNodeName = "guardian";
			tagName = "emergencyContact";
		} else if (relationship != null && relationship.equals("guardian")) {
			ReferenceNodeName = "personalRelationship";
			tagName = "guardian";
		}

		// updating logged in users personal relationships
		Document loginUserMessageDocument = XMLHelper
				.getXMLDocument(loginUserMessage);
		String newLoginUserMessage = updateUserProfile(
				xpath,
				getInsertingNode(friendUserMessage, loginUserMessageDocument,
						friendUserId, relationship), loginUserMessageDocument,
				true, ReferenceNodeName, tagName);
		updateMessageInColumnfamily(loginUserId, newLoginUserMessage);

		// updating friends profile personal relationship
		Document friendMessageDocument = XMLHelper
				.getXMLDocument(friendUserMessage);
		String newFriendUserMessage = updateUserProfile(
				xpath,
				getInsertingNode(loginUserMessage, friendMessageDocument,
						loginUserId, relationship), friendMessageDocument,
				true, ReferenceNodeName, tagName);
		updateMessageInColumnfamily(friendUserId, newFriendUserMessage);
	}

	public Node getInsertingNode(String sourceMessage, Document sourceDocument,
			String userID, String relationship) {
		Node insertingNode = null;
		if (relationship != null && relationship.equals("nextOfKin")) {
			return getNextOfKinNode(sourceMessage, sourceDocument, userID);
		} else if (relationship != null
				&& relationship.equals("emergencyContact")) {
			return getEmergencyContactNode(sourceMessage, sourceDocument,
					userID);
		} else if (relationship != null && relationship.equals("guardian")) {
			return getGuardianNode(sourceMessage, sourceDocument, userID);
		} else if (relationship == null || relationship.equals("")) {
			return getUserRelationshipNode(sourceMessage, sourceDocument,
					userID);
		}
		return insertingNode;
	}

	public Node getUserRelationshipNode(String sourceMessage,
			Document sourceDocument, String userID) {
		String personalRelationshipXpath = "//controlActProcess/subject/registrationEvent/subject/identifiedEntity/identifiedPerson/personalRelationship";
		NodeList personalRelationshipNodeList = (NodeList) XMLHelper.read(
				sourceDocument, personalRelationshipXpath,
				XPathConstants.NODESET);
		int i = personalRelationshipNodeList.getLength();
		String contact;
		Node personalrelationship = sourceDocument
				.createElement("personalRelationship");
		Attr mediaTypeAttr = sourceDocument.createAttribute("id");
		contact = "id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id382_1";
		contact.replaceAll("_id382_" + i, "_id382_" + (i + 1));
		mediaTypeAttr.setNodeValue(contact);
		personalrelationship.getAttributes().setNamedItem(mediaTypeAttr);
		Node relationshipHolder = sourceDocument
				.createElement("relationshipHolder");
		Attr mediaTypeAttr1 = sourceDocument.createAttribute("id");
		contact = "id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id382_1_id388_1";
		contact.replaceAll("_id382_" + i, "_id382_" + (i + 1));
		mediaTypeAttr1.setNodeValue(contact);
		relationshipHolder.getAttributes().setNamedItem(mediaTypeAttr1);
		Node relationshipName = sourceDocument.createElement("name");
		Attr mediaTypeAttr2 = sourceDocument.createAttribute("id");
		contact = "id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id382_1_id388_1_id470_1";
		contact.replaceAll("_id382_" + i, "_id382_" + (i + 1));
		mediaTypeAttr2.setNodeValue(contact);
		relationshipName.getAttributes().setNamedItem(mediaTypeAttr2);
		Node relationshipId = sourceDocument.createElement("id");
		Attr mediaTypeAttr3 = sourceDocument.createAttribute("id");
		contact = "id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id382_1_id388_1_id469_1";
		contact.replaceAll("_id382_" + i, "_id382_" + (i + 1));
		mediaTypeAttr3.setNodeValue(contact);
		relationshipId.getAttributes().setNamedItem(mediaTypeAttr3);
		Attr mediaTypeAttr4 = sourceDocument.createAttribute("root");
		mediaTypeAttr4.setNodeValue(userID);
		relationshipId.getAttributes().setNamedItem(mediaTypeAttr4);

		Document personalDetailDocument = XMLHelper
				.getXMLDocument(sourceMessage);
		String sourceMessageXpath = "//controlActProcess/subject/registrationEvent/subject/identifiedEntity/identifiedPerson/name";
		NodeList personalDeatilNodeList = (NodeList) XMLHelper.read(
				personalDetailDocument, sourceMessageXpath,
				XPathConstants.NODESET);
		Element node = (Element) personalDeatilNodeList.item(0);

		for (int j = 0; j < node.getChildNodes().getLength(); j++) {
			try {
				Node newNode = sourceDocument.createElement(node
						.getChildNodes().item(j).getNodeName());
				newNode.setTextContent(node.getChildNodes().item(j)
						.getTextContent());
				relationshipName.appendChild(newNode);
			} catch (Exception ex) {
				logger.error("An error occured while importing: "+ex.getMessage());
				System.out.println("Error while importing" + ex.getMessage());
			}
		}
		relationshipHolder.appendChild(relationshipName);
		relationshipHolder.appendChild(relationshipId);
		personalrelationship.appendChild(relationshipHolder);
		/*
		 * String contact=
		 * "<personalRelationship classCode=\"\" id=\"id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id382_1\">"
		 * +
		 * "<code id=\"id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id382_1_id386_1\" nullFlavor=\"\"/>"
		 * +
		 * "<relationshipHolder classCode=\"\" determinerCode=\"\" id=\"id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id382_1_id388_1\">"
		 * +
		 * "<name id=\"id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id382_1_id388_1_id470_1\"/>"
		 * +
		 * "<id extension=\"\" id=\"id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id382_1_id388_1_id469_1\" root=\"\"/>"
		 * + "</relationshipHolder>"+ "</personalRelationship>";
		 * 
		 * 
		 * Document personalRelationshipDocument = XMLHelper
		 * .getXMLDocument(contact);
		 * 
		 * String
		 * relationshipXpath="personalRelationship/relationshipHolder/name";
		 * NodeList personalRelationshipNodeList = (NodeList)
		 * XMLHelper.read(personalRelationshipDocument,relationshipXpath,
		 * XPathConstants.NODESET);
		 * 
		 * //Set Name Document personalDetailDocument =
		 * XMLHelper.getXMLDocument(sourceMessage); String sourceMessageXpath=
		 * "//controlActProcess/subject/registrationEvent/subject/identifiedEntity/identifiedPerson/name"
		 * ; NodeList personalDeatilNodeList = (NodeList)
		 * XMLHelper.read(personalDetailDocument,sourceMessageXpath,
		 * XPathConstants.NODESET); Element
		 * node=(Element)personalDeatilNodeList.item(0); try{ Node
		 * importedNode=personalRelationshipDocument.importNode(node, true);
		 * personalRelationshipNodeList.item(0).appendChild(importedNode);
		 * }catch(Exception
		 * ex){System.out.println("error while importing"+ex.getMessage());}
		 * 
		 * for(int j=0;j<node.getChildNodes().getLength();j++){ try{ Node
		 * newNode
		 * =personalRelationshipDocument.createElement(node.getChildNodes(
		 * ).item(j).getNodeName());
		 * newNode.setTextContent(node.getChildNodes().
		 * item(j).getTextContent());
		 * personalRelationshipNodeList.item(0).appendChild(newNode);
		 * }catch(Exception
		 * ex){System.out.println("Error while importing"+ex.getMessage());} }
		 * 
		 * 
		 * 
		 * //Set Id String
		 * relationshipIdXpath="//personalRelationship/relationshipHolder/id";
		 * NodeList personalIdNodeList = (NodeList)
		 * XMLHelper.read(personalRelationshipDocument,relationshipIdXpath,
		 * XPathConstants.NODESET);
		 * personalIdNodeList.item(0).getAttributes().getNamedItem
		 * ("root").setTextContent(userID);
		 */

		return personalrelationship;
	}

	public Node getNextOfKinNode(String sourceMessage, Document sourceDocument,
			String userID) {
		/*
		 * <!-- next of kin --> <nextOfKin classCode=""
		 * id="id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id377_1">
		 * <telecom
		 * id="id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id377_1_id347_1"
		 * use="" value=""/> <nextOfKinContactPerson classCode=""
		 * determinerCode=""
		 * id="id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id377_1_id350_1"
		 * > <id extension="" id=
		 * "id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id377_1_id350_1_id87_1"
		 * root=""/> <name id=
		 * "id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id377_1_id350_1_id88_1"
		 * > <prefix/> <given/> <family/> </name> </nextOfKinContactPerson>
		 * </nextOfKin>
		 */
		String personalRelationshipXpath = "//controlActProcess/subject/registrationEvent/subject/identifiedEntity/identifiedPerson/nextOfKin";
		NodeList personalRelationshipNodeList = (NodeList) XMLHelper.read(
				sourceDocument, personalRelationshipXpath,
				XPathConstants.NODESET);
		int i = personalRelationshipNodeList.getLength();
		String contact;
		Node personalrelationship = sourceDocument.createElement("nextOfKin");
		Attr mediaTypeAttr = sourceDocument.createAttribute("id");
		contact = "id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id377_1";
		contact.replaceAll("_id377_" + i, "_id377_" + (i + 1));
		mediaTypeAttr.setNodeValue(contact);
		personalrelationship.getAttributes().setNamedItem(mediaTypeAttr);

		Node telecomNode = sourceDocument.createElement("telecom");
		Attr telecomAttr = sourceDocument.createAttribute("id");
		contact = "id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id377_1_id347_1";
		contact.replaceAll("_id377_" + i, "_id377_" + (i + 1));
		telecomAttr.setNodeValue(contact);
		telecomNode.getAttributes().setNamedItem(telecomAttr);

		Node relationshipHolder = sourceDocument
				.createElement("nextOfKinContactPerson");
		Attr mediaTypeAttr1 = sourceDocument.createAttribute("id");
		contact = "id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id377_1_id350_1";
		contact.replaceAll("_id377_" + i, "_id377_" + (i + 1));
		mediaTypeAttr1.setNodeValue(contact);
		relationshipHolder.getAttributes().setNamedItem(mediaTypeAttr1);

		Node relationshipId = sourceDocument.createElement("id");
		Attr mediaTypeAttr3 = sourceDocument.createAttribute("id");
		contact = "id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id377_1_id350_1_id88_1";
		contact.replaceAll("_id377_" + i, "_id377_" + (i + 1));
		mediaTypeAttr3.setNodeValue(contact);
		relationshipId.getAttributes().setNamedItem(mediaTypeAttr3);
		Attr mediaTypeAttr4 = sourceDocument.createAttribute("root");
		mediaTypeAttr4.setNodeValue(userID);
		relationshipId.getAttributes().setNamedItem(mediaTypeAttr4);

		Node relationshipName = sourceDocument.createElement("name");
		Attr mediaTypeAttr2 = sourceDocument.createAttribute("id");
		contact = "id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id377_1_id350_1_id88_1";
		contact.replaceAll("_id377_" + i, "_id377_" + (i + 1));
		mediaTypeAttr2.setNodeValue(contact);
		relationshipName.getAttributes().setNamedItem(mediaTypeAttr2);

		Document personalDetailDocument = XMLHelper
				.getXMLDocument(sourceMessage);
		String sourceMessageXpath = "//controlActProcess/subject/registrationEvent/subject/identifiedEntity/identifiedPerson/name";
		NodeList personalDeatilNodeList = (NodeList) XMLHelper.read(
				personalDetailDocument, sourceMessageXpath,
				XPathConstants.NODESET);
		Element node = (Element) personalDeatilNodeList.item(0);

		for (int j = 0; j < node.getChildNodes().getLength(); j++) {
			try {
				Node newNode = sourceDocument.createElement(node
						.getChildNodes().item(j).getNodeName());
				newNode.setTextContent(node.getChildNodes().item(j)
						.getTextContent());
				relationshipName.appendChild(newNode);
			} catch (Exception ex) {
				logger.error("An error occured while importing: "+ex.getMessage());
				System.out.println("Error while importing" + ex.getMessage());
			}
		}
		relationshipHolder.appendChild(relationshipName);
		relationshipHolder.appendChild(relationshipId);
		personalrelationship.appendChild(telecomNode);
		personalrelationship.appendChild(relationshipHolder);
		return personalrelationship;
	}

	public Node getEmergencyContactNode(String sourceMessage,
			Document sourceDocument, String userID) {
		/*
		 * <!-- emergencyContact --> <emergencyContact classCode=""
		 * id="id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id378_1">
		 * <emergencyContactPerson classCode="" determinerCode=""
		 * id="id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id378_1_id289_1"
		 * > <id extension="" id=
		 * "id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id378_1_id289_1_id87_1"
		 * root=""/> <name id=
		 * "id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id378_1_id289_1_id88_1"
		 * > <prefix/> <given/> <family/> </name> </emergencyContactPerson>
		 * </emergencyContact>
		 */
		String personalRelationshipXpath = "//controlActProcess/subject/registrationEvent/subject/identifiedEntity/identifiedPerson/emergencyContact";
		NodeList personalRelationshipNodeList = (NodeList) XMLHelper.read(
				sourceDocument, personalRelationshipXpath,
				XPathConstants.NODESET);
		int i = personalRelationshipNodeList.getLength();
		String contact;
		Node personalrelationship = sourceDocument
				.createElement("emergencyContact");
		Attr mediaTypeAttr = sourceDocument.createAttribute("id");
		contact = "id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id378_1";
		contact.replaceAll("_id378_" + i, "_id378_" + (i + 1));
		mediaTypeAttr.setNodeValue(contact);
		personalrelationship.getAttributes().setNamedItem(mediaTypeAttr);

		Node relationshipHolder = sourceDocument
				.createElement("emergencyContactPerson");
		Attr mediaTypeAttr1 = sourceDocument.createAttribute("id");
		contact = "id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id378_1_id289_1";
		contact.replaceAll("_id378_" + i, "_id378_" + (i + 1));
		mediaTypeAttr1.setNodeValue(contact);
		relationshipHolder.getAttributes().setNamedItem(mediaTypeAttr1);

		Node relationshipId = sourceDocument.createElement("id");
		Attr mediaTypeAttr3 = sourceDocument.createAttribute("id");
		contact = "id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id378_1_id289_1_id87_1";
		contact.replaceAll("_id378_" + i, "_id378_" + (i + 1));
		mediaTypeAttr3.setNodeValue(contact);
		relationshipId.getAttributes().setNamedItem(mediaTypeAttr3);
		Attr mediaTypeAttr4 = sourceDocument.createAttribute("root");
		mediaTypeAttr4.setNodeValue(userID);
		relationshipId.getAttributes().setNamedItem(mediaTypeAttr4);

		Node relationshipName = sourceDocument.createElement("name");
		Attr mediaTypeAttr2 = sourceDocument.createAttribute("id");
		contact = "id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id378_1_id289_1_id88_1";
		contact.replaceAll("_id378_" + i, "_id378_" + (i + 1));
		mediaTypeAttr2.setNodeValue(contact);
		relationshipName.getAttributes().setNamedItem(mediaTypeAttr2);

		Document personalDetailDocument = XMLHelper
				.getXMLDocument(sourceMessage);
		String sourceMessageXpath = "//controlActProcess/subject/registrationEvent/subject/identifiedEntity/identifiedPerson/name";
		NodeList personalDeatilNodeList = (NodeList) XMLHelper.read(
				personalDetailDocument, sourceMessageXpath,
				XPathConstants.NODESET);
		Element node = (Element) personalDeatilNodeList.item(0);

		for (int j = 0; j < node.getChildNodes().getLength(); j++) {
			try {
				Node newNode = sourceDocument.createElement(node
						.getChildNodes().item(j).getNodeName());
				newNode.setTextContent(node.getChildNodes().item(j)
						.getTextContent());
				relationshipName.appendChild(newNode);
			} catch (Exception ex) {
				logger.error("An error occured while importing: "+ex.getMessage());
				System.out.println("Error while importing" + ex.getMessage());
			}
		}
		relationshipHolder.appendChild(relationshipName);
		relationshipHolder.appendChild(relationshipId);

		personalrelationship.appendChild(relationshipHolder);
		return personalrelationship;
	}

	public Node getGuardianNode(String sourceMessage, Document sourceDocument,
			String userID) {
		/*
		 * <!-- guardian --> <guardian classCode="LKM"
		 * id="id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id380_1">
		 * <telecom
		 * id="id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id380_1_id315_1"
		 * use="" value=""/> <guardianPerson classCode="POI"
		 * determinerCode="ERT"
		 * id="id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id380_1_id320_1"
		 * > <id extension="" id=
		 * "id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id380_1_id320_1_id87_1"
		 * root=""/> <name id=
		 * "id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id380_1_id320_1_id88_1"
		 * > <prefix/> <given/> <family/> </name> </guardianPerson> </guardian>
		 */
		String personalRelationshipXpath = "//controlActProcess/subject/registrationEvent/subject/identifiedEntity/identifiedPerson/guardian";
		NodeList personalRelationshipNodeList = (NodeList) XMLHelper.read(
				sourceDocument, personalRelationshipXpath,
				XPathConstants.NODESET);
		int i = personalRelationshipNodeList.getLength();
		String contact;
		Node personalrelationship = sourceDocument.createElement("guardian");
		Attr mediaTypeAttr = sourceDocument.createAttribute("id");
		contact = "id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id380_1";
		contact.replaceAll("_id380_" + i, "_id380_" + (i + 1));
		mediaTypeAttr.setNodeValue(contact);
		personalrelationship.getAttributes().setNamedItem(mediaTypeAttr);

		Node telecomNode = sourceDocument.createElement("telecom");
		Attr telecomAttr = sourceDocument.createAttribute("id");
		contact = "id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id377_1_id347_1";
		contact.replaceAll("_id380_" + i, "_id380_" + (i + 1));
		telecomAttr.setNodeValue(contact);
		telecomNode.getAttributes().setNamedItem(telecomAttr);

		Node relationshipHolder = sourceDocument
				.createElement("guardianPerson");
		Attr mediaTypeAttr1 = sourceDocument.createAttribute("id");
		contact = "id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id380_1_id320_1";
		contact.replaceAll("_id380_" + i, "_id380_" + (i + 1));
		mediaTypeAttr1.setNodeValue(contact);
		relationshipHolder.getAttributes().setNamedItem(mediaTypeAttr1);

		Node relationshipId = sourceDocument.createElement("id");
		Attr mediaTypeAttr3 = sourceDocument.createAttribute("id");
		contact = "id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id380_1_id320_1_id87_1";
		contact.replaceAll("_id380_" + i, "_id380_" + (i + 1));
		mediaTypeAttr3.setNodeValue(contact);
		relationshipId.getAttributes().setNamedItem(mediaTypeAttr3);
		Attr mediaTypeAttr4 = sourceDocument.createAttribute("root");
		mediaTypeAttr4.setNodeValue(userID);
		relationshipId.getAttributes().setNamedItem(mediaTypeAttr4);

		Node relationshipName = sourceDocument.createElement("name");
		Attr mediaTypeAttr2 = sourceDocument.createAttribute("id");
		contact = "id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id380_1_id320_1_id88_1";
		contact.replaceAll("_id380_" + i, "_id380_" + (i + 1));
		mediaTypeAttr2.setNodeValue(contact);
		relationshipName.getAttributes().setNamedItem(mediaTypeAttr2);

		Document personalDetailDocument = XMLHelper
				.getXMLDocument(sourceMessage);
		String sourceMessageXpath = "//controlActProcess/subject/registrationEvent/subject/identifiedEntity/identifiedPerson/name";
		NodeList personalDeatilNodeList = (NodeList) XMLHelper.read(
				personalDetailDocument, sourceMessageXpath,
				XPathConstants.NODESET);
		Element node = (Element) personalDeatilNodeList.item(0);

		for (int j = 0; j < node.getChildNodes().getLength(); j++) {
			try {
				Node newNode = sourceDocument.createElement(node
						.getChildNodes().item(j).getNodeName());
				newNode.setTextContent(node.getChildNodes().item(j)
						.getTextContent());
				relationshipName.appendChild(newNode);
			} catch (Exception ex) {
				logger.error("An error occured while importing: "+ex.getMessage());
				System.out.println("Error while importing" + ex.getMessage());
			}
		}
		relationshipHolder.appendChild(relationshipName);
		relationshipHolder.appendChild(relationshipId);
		personalrelationship.appendChild(telecomNode);
		personalrelationship.appendChild(relationshipHolder);
		return personalrelationship;
	}

	public String updateUserProfile(String xpath, Node node,
			Document messageDocument, boolean insert, String ReferenceNodeName,
			String tagName) {
		NodeList baseNodeList = (NodeList) XMLHelper.read(messageDocument,
				xpath, XPathConstants.NODESET);
		if (baseNodeList.getLength() < 1) {
			return XMLHelper.getXMLDocumentAsString(messageDocument);
		} else {
			xpath = xpath + "/" + tagName;
			NodeList nodeList = (NodeList) XMLHelper.read(messageDocument,
					xpath, XPathConstants.NODESET);
			if (nodeList.getLength() < 1) {
				NodeList identifyiedPersonsDescProperty = ((Element) baseNodeList
						.item(0)).getElementsByTagName(tagName);
				if (identifyiedPersonsDescProperty.getLength() < 1) {
					((Element) baseNodeList.item(0)).insertBefore(node,
							((Element) baseNodeList.item(0))
									.getElementsByTagName(ReferenceNodeName)
									.item(0));
					// System.out.println("Node inserted");
				}
			} else {
				if (!insert) {
					baseNodeList.item(0).replaceChild(node, nodeList.item(0));
				} else {
					((Element) baseNodeList.item(0)).insertBefore(node,
							((Element) baseNodeList.item(0))
									.getElementsByTagName(ReferenceNodeName)
									.item(0));
				}
			}

		}
		return XMLHelper.getXMLDocumentAsString(messageDocument);
	}
/*
 * Fetch the linked profile message of an employee.
 * 
*/	public List<String> fetchLinkedProfileMessage(String orgId)
			throws Exception {
		Map<String, Map<String, Map<String, String>>> mainMap = new HashMap<String, Map<String, Map<String, String>>>();
		HashMap<String, Object> columnValueMap = new HashMap<String, Object>();
		columnValueMap.put("ROWKEY", orgId);
		List<String> messageList = new ArrayList<String>();
		HashMap<String, Object> valueMap = new HashMap<String, Object>();
		String key = "";
		HinOrgUserProfile hinOrgUserProfile = new HinOrgUserProfile();
		List<Map<String, String>> mapList = getJsonArrayForOrg(orgId);
		if (mapList == null)
			return null;
		for (Map<String, String> map : mapList) {
			if (map.get("HinOrgUserProfile") != null
					&& map.get("HinOrgUserProfile") != ""
					&& map.containsValue("EMPLOYEE")) {
				columnValueMap.put(map.get("HinOrgUserProfile"), null);
			}
		}
		mainMap = messageRepository.retrieveSuperColumnFamily(orgId, orgId,
				"IDENTITY_REPO", null, null, columnValueMap);
		if (!mainMap.isEmpty()) {
			Set rowKeySet = mainMap.entrySet();
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
					valueMap = (HashMap<String, Object>) subEntry.getValue();
					Set columnSet = valueMap.entrySet();
					Iterator itr = columnSet.iterator();
					while (itr.hasNext()) {
						Map.Entry valueEntry = (Map.Entry) itr.next();
						key = (String) valueEntry.getKey();
						if (key.equals("LINKED_PROFILE")) {
							messageList.add((String) valueEntry.getValue());
						}
					}
				}
			}
		}
		
		List<UserProfileMessage> userProfileMessagesList = new ArrayList<UserProfileMessage>();
		for (String message : messageList) {
			String xml = message;
			UserProfileMessage userProfileMessage = new UserProfileMessage();
			String nameXpath = "//controlActProcess/subject/registrationEvent/subject/identifiedEntity/identifiedPerson/name[1]/given";
			String name = (String) XMLHelper.read(XMLHelper.getXMLDocument(xml),nameXpath, XPathConstants.STRING);
			userProfileMessage.setName(name);
			userProfileMessage.setProfileMessage(message);
			userProfileMessagesList.add(userProfileMessage);
		}
		Comparable<UserProfileMessage> comp = (Comparable<UserProfileMessage>) new UserProfileMessage();
		Collections.sort(userProfileMessagesList);
		List<String> newMessageList = new ArrayList<String>();
		for(UserProfileMessage userProfileMessage : userProfileMessagesList){
			newMessageList.add(userProfileMessage.getProfileMessage());
		}
		
		return newMessageList;
	}
/*
 * Get the user name of a user from profile id.
 * 
*/	public String getUserName(String userId) throws Exception {
		String userName = userId, key;
		HashMap<String, Object> valueMap = new HashMap<String, Object>();
		Map<String, Map<String, Map<String, String>>> mainMap = new HashMap<String, Map<String, Map<String, String>>>();
		HashMap<String, Object> columnValueMap = new HashMap<String, Object>();
		columnValueMap.put("ROWKEY", userId);
		columnValueMap.put("USER_NAME", null);
		mainMap = messageRepository.retrieveSuperColumnFamily(userId, userId,
				"IDENTITY_REPO", null, null, columnValueMap);
		if (mainMap == null) {
			return null;
		}
		Set rowKeySet = mainMap.entrySet();
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
				if (key.equals("USER_NAME")) {
					valueMap = (HashMap<String, Object>) subEntry.getValue();
					Set columnSet = valueMap.entrySet();
					Iterator itr = columnSet.iterator();
					while (itr.hasNext()) {
						Map.Entry valueEntry = (Map.Entry) itr.next();
						userName = (String) valueEntry.getValue();
						break;
					}
				}
			}
		}
		return userName;
	}

	private String getUserType(HinOrgUserProfile hinOrgUserProfile) {
		String userType = "USER";
		Document orgUserMessageDocument = XMLHelper
				.getXMLDocument(hinOrgUserProfile.getMessage());
		String sourceMessageXpath = "//user/@type";
		NodeList userDeatilNodeList = (NodeList) XMLHelper.read(
				orgUserMessageDocument, sourceMessageXpath,
				XPathConstants.NODESET);
		if (userDeatilNodeList.item(0) != null) {
			// Element node=(Element)userDeatilNodeList.item(0);
			userType = userDeatilNodeList.item(0).getNodeValue();
		}
		return userType;
	}

	public String getUserId(String message) {
		Document xmlDocument = XMLHelper.getXMLDocument(message);
		String messageType = (String) XMLHelper.read(xmlDocument, "name(/*)",
				XPathConstants.STRING);
		String profileIDXpath = "//controlActProcess/subject/registrationEvent/subject/identifiedEntity/identifiedPerson/id[1]/@root";
		if (messageType.equals("POXX_IN121001")) {
			profileIDXpath = "//controlActProcess/subject/specimenObservationOrder/recordTarget/patient/patientPerson/id/@root";// "//identifiedPerson[1]/id/@root";//
																																		// /personalRelationship/relationshipHolder/id/@root";
		} else if (messageType.equals("POSA_IN000001")) {
			profileIDXpath = "//controlActProcess/subject/substanceAdministrationOrder/subject/patient/id/@root";
		} else if (messageType.equals("POXX_IN120001")) {
			profileIDXpath = "//controlActProcess/subject/observationOrder/subject/patient/patientPerson/id/@root";
		} else if (messageType.equals("PRPA_IN410001")) {
			profileIDXpath = "//controlActProcess/subject/encounterAppointment/subject/patient/id/@root";
		}
		String profileID = (String) XMLHelper.read(xmlDocument, profileIDXpath,
				XPathConstants.STRING);
		return profileID;
	}
/*
 * Get the user full name from the hinUserProfile.
 * 
*/	public String getUserFullNameFromMessage(HinUserProfile hinUserProfile) {
		String message = hinUserProfile.getMessage();
		Document userDocument = XMLHelper.getXMLDocument(hinUserProfile
				.getMessage());
		String prefix = "//controlActProcess/subject/registrationEvent/subject/identifiedEntity/identifiedPerson/name/prefix";
		String given = "//controlActProcess/subject/registrationEvent/subject/identifiedEntity/identifiedPerson/name/given";
		String family = "//controlActProcess/subject/registrationEvent/subject/identifiedEntity/identifiedPerson/name/family";
		prefix = (String) XMLHelper.read(userDocument, prefix,
				XPathConstants.STRING);
		given = (String) XMLHelper.read(userDocument, given,
				XPathConstants.STRING);
		family = (String) XMLHelper.read(userDocument, family,
				XPathConstants.STRING);

		// NodeList personalDeatilNodeList = (NodeList)
		// XMLHelper.read(userDocument,prefix, XPathConstants.NODESET);
		// Element node=(Element)personalDeatilNodeList.item(0);
		String fullName = "";
		fullName = prefix + " " + given + " " + family;
		System.out.println(fullName);
		// for(int j=0;j<node.getChildNodes().getLength();j++){
		// try{
		// fullName=fullName +
		// node.getChildNodes().item(j).getNodeValue().toString() +"  ";
		// }catch(Exception ex){
		// System.out.println("Error while importing"+ex.getMessage());
		// }
		// }
		return fullName;
	}
}
