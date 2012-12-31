package com.hin.hl7messaging.api;

import java.util.HashMap;
import java.util.Map;


public interface IIdentityMessageService {
	/*public void saveRoleMessage(String message, String subscriberId, String roleName, String roleId, String contactSubscriberId, String playerOrScoper);
	public void saveSubscriberProfileMessage(String message, String userName,  String fullName,
			String password, String securityQuestion, String securityAnswer, String subscriberType, String email);
	
	public Map<String, HashMap<String, String>> retrieveRoleDefinition(String roleName, String subscriberId);
	public Map<String, HashMap<String, String>> checkAvailability(String columnFamily, String userName);
	
	public HashMap<String, String> retrieveRolePermission(String subscriberId);
	public Map<String, HashMap<String,String>> retrieveProfileNameColumn(String columnFamily);
	
	public String retrieveRoleName(String subId);
	public void savePermission(String subscriberId,String permission);
	public void saveRoleDefinition(String subscriberId, String roleName, String message);
	public String retrieveRoleStatus(String subscriberId);
	public List<RolesVO> retrieveRelations(String subscriberId);
	public Map<String, HashMap<String, String>> roleListFromRoleIndex(String subscriberId, String contact);
	
	public String retrieveRoleInstanceDefinition(String roleName,String subscriberId);*/
	/**  For new IdentityMessageService   */
	
	public HashMap<byte[], HashMap<byte[], Object>> retrieveSuperColumn(String keyspace, String columnFamily, String rowKey);
	public Map<String, HashMap<String, String>> retrieveStandardColumn(String subscriberId, String columnFamily);
	public Map<String, HashMap<String, String>> login(String userName, String password);
	public void updateStatus(String subscriberId, String columnFamily, String roleId, String columnName, String status);
	public void saveSubscriberProfile(String subscriberId, String message);
}
