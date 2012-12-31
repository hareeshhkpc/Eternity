package com.hin.hl7.messaging.api;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.cassandra.thrift.InvalidRequestException;
import org.apache.cassandra.thrift.SchemaDisagreementException;
import org.apache.thrift.TException;

import com.hin.domain.vo.MessageVO;

public interface IIdentityRepository {
	/*public void saveRoleMessage(Role role, String subscriberId);
	public void saveSubscriberProfileMessage(SubscriberProfile subscriberProfile);
	public void saveService(Services services);
	public Map<String, HashMap<String, String>> retrieveRoleDefinition(String roleName, String columnFamily, String subscriberId);
	public Map<String, HashMap<String, String>> checkAvailabity(String columnFamily, String userName);
	public HashMap<String, String> retrieveRolePermission(String columnFamily, String subscriberId);
	public Map<String, HashMap<String,String>> retrieveProfileNameColumnFamily(String columnFamily);
	public void updateRoleDefinition(String subscriberId,String permission);
	public void saveRoleDefinition(String subscriberId, String roleName, String message);
	public Map<String, HashMap<String, String>> retrieveSubscriberName(String subId);
	public Map<String, HashMap<String, String>> rolesFromRoleIndex(String subscriberId, String contact);
	public String retrieveRoleInstanceDefinition(String roleName, String subscriberId);*/
	
	/**  For new IdentityMessageRepository   */
	public HashMap<byte[], HashMap<byte[], Object>> retrieveSuperColumn(String keyspace, String columnFamily, String rowKey);
	
	public Map<String, Map<String, Map<String, String>>> querySuperColumnFamily(
			String startRowKey, String endRowKey, String columnFamily,
			Long startColumn, Long endColumn, List<String> superColumns);
	
	public Map<String, HashMap<String, String>> retrieveStandardColumnFamily(String columnFamily, String columnName,String columnValue);
	public Map<String, HashMap<String, String>> retrieveStandardColumnFamily(String columnFamily, String subscriberId);
	public Map<String, HashMap<String, String>> retrieveStandardColumnFamily(String columnFamily, HashMap<String, String> condtitionMap);
	public void saveSuperColumn(String columnFamily, String rowKey, String superColumnName, Map columnValueMap);
	public Map<String, HashMap<String, String>> login(String password, String subscriberId);
	public void updateStatus(String subscriberId, String columnFamily, String columnName, String status);
	public void saveSubscriberProfile(String subscriberId, String message);
	public void saveStandardColumnFamily(HashMap<String, Object> columnValueMap,String columnFamily);
	public Map<String, HashMap<String, String>> retrieveStandardColumnFamilyForCondition(String columnFamily, String condition);
	public String getColumnValue(String columnFamily, String rowKey,String column);
	public HashMap<String, List<String>>  getColumnValues(List<String> column,Map.Entry subscriberIdEntry);
	public List<String> getColumnValue(Map<String, HashMap<String, String>> resultMap, String column); 
    public void saveSubscriberProfile(MessageVO messageVo) ;
    public void createColumnFamily(String messageType) throws InvalidRequestException, SchemaDisagreementException, TException;
    public void  saveRoleDefinition(MessageVO messageVO);
	public Map<String, HashMap<String, String>> login(String username,
			String password,String organizationId) ;
}
