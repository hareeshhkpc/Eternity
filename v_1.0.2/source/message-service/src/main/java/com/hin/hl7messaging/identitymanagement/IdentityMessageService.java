package com.hin.hl7messaging.identitymanagement;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hin.hl7.messaging.api.IIdentityRepository;
import com.hin.hl7messaging.api.IIdentityMessageService;
import com.hin.hl7messaging.cassandra.CassandraConnector;

@Service(value="identityMessageService")
public class IdentityMessageService implements IIdentityMessageService {
	
	@Resource(name="identityMessageRepository")
	private IIdentityRepository repository;
	
	@Autowired
	private CassandraConnector cassandraConnector;

	public IdentityMessageService() {

	}

	
	public HashMap<byte[], HashMap<byte[], Object>> retrieveSuperColumn(String keyspace, String columnFamily, String rowKey){
		HashMap<byte[], HashMap<byte[], Object>> resultMap = new HashMap<byte[], HashMap<byte[],Object>>();
		resultMap = repository.retrieveSuperColumn(keyspace, columnFamily, rowKey);
		return resultMap;
	}
	
	public Map<String, HashMap<String, String>> retrieveStandardColumn(String subscriberId, String columnFamily){
		Map<String, HashMap<String, String>> resultMap = new HashMap<String, HashMap<String, String>>();
		resultMap=cassandraConnector.retrieveStandardColumnFamily(columnFamily, subscriberId,"");
		if(resultMap!=null && !resultMap.isEmpty()){
			return resultMap;
		}
		else {
			return null;
		}
	}
	public Map<String, HashMap<String, String>> login(String userName, String password){
		Map<String, HashMap<String, String>> resultMap = new HashMap<String, HashMap<String, String>>();
		resultMap = repository.login(password, userName);
		if(resultMap!=null && !resultMap.isEmpty()){
			return resultMap;
		}
		else {
			return null;
		}
	}
	
	public void updateStatus(String subscriberId, String columnFamily, String roleId, String columnName, String status){

		repository.updateStatus(subscriberId+"_"+roleId, columnFamily, columnName, status);
	}
	
	public void saveSubscriberProfile(String subscriberId, String message){
		repository.saveSubscriberProfile(subscriberId, message);
	}
	
	/*public void saveRoleMessage(String message, String subscriberId, String roleName, String roleId, String contactSubscriberId, String playerOrScoper){
		String createdBy=subscriberId, modifiedBy=subscriberId;//WILL READ VALUES FROM THE MESSAGE IN FUTURE
		Long timestamp = System.currentTimeMillis();
		String creationTime = timestamp.toString();
		//String roleId = generateRandomNumber();
		Role role = new Role();
		role.setSubscriber_roleId(subscriberId+"_"+roleId);
		role.setMessage(message);
		role.setRoleName(roleName);
		role.setContact(contactSubscriberId);
		role.setRoleId(roleId);
		role.setPlayerOrScoper(playerOrScoper);
		role.setRole_status("NEW");
		role.setCreatedTime(creationTime);
		role.setCreatedBy(createdBy);
		role.setLastModifiedTime(creationTime);
		role.setModifiedBy(modifiedBy);
		
		repository.saveRoleMessage(role,subscriberId);
		
	}
	

	
	public void saveSubscriberProfileMessage(String message, String userName, String fullName,
			String password, String securityQuestion, String securityAnswer,
			String subscriberType, String email) {
		Long timestamp = System.currentTimeMillis();
		String creationTime = timestamp.toString();		
		SubscriberProfile subscriberProfile = new SubscriberProfile();
		subscriberProfile.setSubscriberId(generateRandomNumber());
		subscriberProfile.setMessage(message);
		subscriberProfile.setUserName(userName);
		subscriberProfile.setPassword(password);
		subscriberProfile.setSubscriberType(subscriberType);
		subscriberProfile.setSecurityQuestion(securityQuestion);
		subscriberProfile.setSecurityAnswer(securityAnswer);
		subscriberProfile.setEmail(email);
		subscriberProfile.setFullName(fullName);
		subscriberProfile.setActive("TRUE");
		subscriberProfile.setCreatedTime(creationTime);
		subscriberProfile.setCreatedBy(userName);
		subscriberProfile.setLastModifiedTime(creationTime);
		subscriberProfile.setModifiedBy(userName);
		System.out.println(subscriberProfile);
		repository.saveSubscriberProfileMessage(subscriberProfile);
	}
	
	public void saveRoleDefinition(String subscriberId, String roleName, String message){
		repository.saveRoleDefinition(subscriberId, roleName, message);
	}
	
	public void saveServices(){
		Services services = new Services();
		services.setServiceId(generateRandomNumber());
		services.setSubscriber_RoleId("");
		repository.saveService(services);
	}
	
	private String generateRandomNumber() {
		UUID uuid = UUID.randomUUID();
		return uuid.toString();
	}
	
	
	public Map<String, HashMap<String, String>> checkAvailability(String columnFamily, String userName){
		Map<String, HashMap<String, String>> resultMap = new HashMap<String, HashMap<String, String>>();
		resultMap = repository.checkAvailabity(columnFamily, userName);		
		return resultMap;
	}
	public Map<String, HashMap<String, String>> retrieveRoleDefinition(String roleName, String subscriberId){
		Map<String, HashMap<String, String>> resultMap = new HashMap<String, HashMap<String, String>>();		
		resultMap = repository.retrieveRoleDefinition(roleName, "ROLE_INDEX", subscriberId);
		if(resultMap!=null && !resultMap.isEmpty()){
			return resultMap;
		}
		else {
			return null;
		}
	}
	
	public HashMap<String, String> retrieveRolePermission(String subscriberId){
		HashMap<String, String> resultMap = new HashMap<String, String>();		
		resultMap = repository.retrieveRolePermission("ROLE", subscriberId);
		if(resultMap!=null && !resultMap.isEmpty()){
			return resultMap;
		}
		else {
			return null;
		}
	}
	
	public Map<String, HashMap<String,String>> retrieveProfileNameColumn(String columnFamily){
		Map<String, HashMap<String, String>> resultMap = new HashMap<String, HashMap<String, String>>();
		resultMap = repository.retrieveProfileNameColumnFamily(columnFamily);
		if(resultMap != null && !resultMap.isEmpty()){
			return resultMap;
		}
		else {
			return null;
		}
	}
	
	public String updateMessage(String message, String subscriberId){
		String subscriberProfileIdXpath = "//identifiedEntity/identifiedPerson/name";
		Document messageDocument = XMLHelper.getXMLDocument(message);
		NodeList subscriberProfileIdNodeList = (NodeList) XMLHelper.read(messageDocument,
				subscriberProfileIdXpath, XPathConstants.NODESET);
		if (subscriberProfileIdNodeList.getLength() < 1) {
			return message;
		} else {
			NamedNodeMap obj = subscriberProfileIdNodeList.item(0).getAttributes();
			obj.getNamedItem("id").setNodeValue(subscriberId);
		}
		return XMLHelper.getXMLDocumentAsString(messageDocument);
	}

	public String retrieveRoleStatus(String subscriberId){
		Map<String, HashMap<String, String>> resultMap = new HashMap<String, HashMap<String, String>>();
		HashMap<String, String> columnValueMap = new HashMap<String, String>();
		resultMap = repository.retrieveStandardColumnFamily("ROLE", subscriberId);
		columnValueMap = resultMap.get(subscriberId);
		String value = columnValueMap.get("ROLE_STATUS");
		return value;
	}
	
	public String retrieveRoleInstanceDefinition(String subscriberId,String roleName){
		String value = repository.retrieveRoleInstanceDefinition(roleName,subscriberId);
		return value;
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	public String retrieveRoleName(String subId){
		HashMap<String, String> columnValueMap = new HashMap<String, String>();
		String roleName="";
		Map<String, HashMap<String, String>> st=repository.retrieveStandardColumnFamily("ROLE_DEFINITION", subId);
		if(st !=null && !st.isEmpty()){
			Iterator iterator = st.entrySet().iterator();
			while(iterator.hasNext()){
				Map.Entry subscriberIdEntry = (Map.Entry) iterator.next();
				columnValueMap =  (HashMap<String, String>) subscriberIdEntry.getValue();
				Iterator columnValueIterator = columnValueMap.entrySet().iterator();
				while(columnValueIterator.hasNext()){
					Map.Entry columnValueEntry = (Map.Entry) columnValueIterator.next();
					if(!columnValueEntry.getKey().equals("KEY")&&(columnValueEntry.getKey().equals("ROLE_NAME"))){
						roleName = (String) columnValueEntry.getValue();
					}
				}
			}
		}
		return roleName;
	}
	
	public void savePermission(String roleDefinitionId,String permission){
		repository.updateRoleDefinition(roleDefinitionId,permission);
	}
	
	@SuppressWarnings("rawtypes")
	public List<RolesVO> retrieveRelations(String subscriberId){
		List<RolesVO> roleNameContactList = new ArrayList<RolesVO>();
	
		HashMap<String, String> roleIdMap = new HashMap<String, String>();
		HashMap<String, String> columnValueMap = new HashMap<String, String>();
		String columnName="";
		Map<String, HashMap<String, String>> roleIndexMap = repository.retrieveStandardColumnFamily("ROLE_INDEX", subscriberId);
		Map<String, HashMap<String, String>> resultMap = new HashMap<String, HashMap<String, String>>();
		
		roleIdMap = roleIndexMap.get(subscriberId);
		Iterator roleIdIterator = roleIdMap.entrySet().iterator();
		while(roleIdIterator.hasNext()){
			Map.Entry roleIdEntry = (Map.Entry) roleIdIterator.next();
			columnName = (String) roleIdEntry.getKey();
			RolesVO roleContact = new RolesVO();
			if(!(columnName.equals("KEY"))){
				
				resultMap = repository.retrieveStandardColumnFamily("ROLE", subscriberId+"_"+columnName);
				columnValueMap = resultMap.get(subscriberId+"_"+columnName);
				roleContact.setRoleId(columnName);
				roleContact.setStatus(columnValueMap.get("ROLE_STATUS"));
				roleContact.setRoleName(columnValueMap.get("ROLE_NAME"));
				roleContact.setContactSubscriberId(columnValueMap.get("CONTACT"));
				roleContact.setContact(retrieveSubscriberName(columnValueMap.get("CONTACT")));
				roleContact.setCreationTime(columnValueMap.get("ROLE_CREATION_TIME"));
				roleContact.setBlocked(columnValueMap.get("BLOCKED"));
				roleNameContactList.add(roleContact);
			}
		}
		
		return roleNameContactList;
	}
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public String retrieveSubscriberName(String subId) {
		String userName="";
		Map<String, HashMap<String, String>> resultMap = new HashMap<String, HashMap<String, String>>();
		resultMap = repository.retrieveSubscriberName(subId);
		if(resultMap!=null && !resultMap.isEmpty()){
			Iterator iterator = resultMap.entrySet().iterator();
			while (iterator.hasNext()) {
				Map.Entry resultMapEntry = (Map.Entry) iterator.next();
				HashMap<String, Object> SubTypeMap = new HashMap<String, Object>();
				SubTypeMap = (HashMap<String, Object>) resultMapEntry.getValue();
				Iterator resultIterator = SubTypeMap.entrySet().iterator();
				while (resultIterator.hasNext()) {
					Map.Entry subTypeEntry = (Map.Entry) resultIterator.next();
					userName = (String) subTypeEntry.getValue();
				}
			}
		}
		return userName;
	}
	
	public Map<String, HashMap<String, String>> roleListFromRoleIndex(String subscriberId, String contact){
		Map<String, HashMap<String, String>> resultMap = new HashMap<String, HashMap<String, String>>();
		HashMap<String, String> SubTypeMap = new HashMap<String, String>();
		String columnName="", blocked="";
		resultMap = repository.rolesFromRoleIndex(subscriberId, contact);
		if(resultMap!=null && !resultMap.isEmpty()){
			SubTypeMap = resultMap.get(subscriberId);
			blocked = SubTypeMap.get("BLOCKED");
			columnName = SubTypeMap.get("ROLE_STATUS");
			if(blocked.equals("FALSE")){
				if(columnName.equals("ACTIVE")||columnName.equals("NEW"))
					return resultMap;
				else{
					resultMap.clear();
					return resultMap;
				}
			}
			else{
				resultMap.clear();
				return resultMap;
			}
		}
		else {
			return null;
		}
	}*/
	

}
