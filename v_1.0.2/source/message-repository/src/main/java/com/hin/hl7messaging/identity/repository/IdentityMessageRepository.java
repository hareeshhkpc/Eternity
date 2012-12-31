package com.hin.hl7messaging.identity.repository;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.xml.xpath.XPathConstants;

import me.prettyprint.cassandra.serializers.LongSerializer;
import me.prettyprint.cassandra.serializers.ObjectSerializer;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.hector.api.Serializer;

import org.apache.cassandra.thrift.InvalidRequestException;
import org.apache.cassandra.thrift.SchemaDisagreementException;
import org.apache.log4j.Logger;
import org.apache.thrift.TException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.hin.domain.vo.MessageVO;
import com.hin.hl7.messaging.api.IIdentityRepository;
import com.hin.hl7messaging.cassandra.CassandraClient;
import com.hin.hl7messaging.cassandra.CassandraConnector;
import com.hin.hl7messaging.utils.XMLHelper;


@Repository(value = "identityMessageRepository")
public class IdentityMessageRepository implements IIdentityRepository {
	Serializer<String> stringSerializer = StringSerializer.get();
	Serializer<Object> valueSerializer = ObjectSerializer.get();
	LongSerializer longSerializer = LongSerializer.get();
	private Logger logger = Logger.getLogger(IdentityMessageRepository.class
			.getName());

	@Autowired
	private CassandraClient client;
	
	@Autowired
	private CassandraConnector cassandraConnector;
	
	@Value("${messageConfig.dirPath}")
	private String messageConfigurationPath;
	


	public HashMap<byte[], HashMap<byte[], Object>> retrieveSuperColumn(
			String keyspace, String columnFamily, String rowKey) {
		HashMap<byte[], HashMap<byte[], Object>> resultMap = new HashMap<byte[], HashMap<byte[], Object>>();
		resultMap = client.getData(keyspace, columnFamily, rowKey.getBytes());
		return resultMap;
	}

	public Map<String, Map<String, Map<String, String>>> querySuperColumnFamily(
			String startRowKey, String endRowKey, String columnFamily,
			Long startColumn, Long endColumn, List<String> superColumns) {

		String startColumnName = "", endColumnName = "";
		int rowLimit = 1000, columnLimit = 1000;

		startColumnName = startColumn != null ? startColumn.toString() : "";
		endColumnName = endColumn != null ? endColumn.toString() : "";
		try {
			Map<String, Map<String, Map<String, String>>> result = (client
					.querySuperColumnFamily(startRowKey, endRowKey,
							superColumns, columnFamily, startColumnName,
							endColumnName, rowLimit, columnLimit));

			for (String rowKey : result.keySet()) {
				Map<String, Map<String, String>> superColumn = result
						.get(rowKey);
				for (String sColumName : superColumn.keySet()) {
					Map<String, String> column = superColumn.get(sColumName);
					for (String columnName : column.keySet()) {
						String value = column.get(columnName);
						value = value.replaceAll("--del--", "\n");
						value = value.replaceAll("\\\\", "'");
						column.put(columnName, value);
					}
				}
			}
			return result;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * Retrieve Standard column family.
	 * 
	 * @param columnFamily
	 *            Name of the column family.
	 * @param profileID
	 *            Is the unique identity number of user.
	 */
	public Map<String, HashMap<String, String>> retrieveStandardColumnFamily(
			String columnFamily, String subscriberId) {

		Map<String, HashMap<String, String>> resultMap = new HashMap<String, HashMap<String, String>>();
		if (subscriberId == null || subscriberId.equals("")) {
			resultMap = client
					.queryKeySpace("select * from '" + columnFamily + "'",
							stringSerializer, stringSerializer,
							stringSerializer);
		} else {
			resultMap = client.queryKeySpace("select * from '" + columnFamily
					+ "' where key = '" + subscriberId + "'", stringSerializer,
					stringSerializer, stringSerializer);
		}
		return resultMap;
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	public void saveSuperColumn(String columnFamily, String rowKey,
			String superColumnName, Map columnValueMap) {

		String value;
		Object columnName = columnValueMap.keySet().toArray()[0];

		if (columnName instanceof String) {
			HashMap<String, String> columns = new HashMap<String, String>();

			for (String columName : ((Map<String, String>) columnValueMap)
					.keySet()) {
				value = (String) columnValueMap.get(columName);
				value = value.replaceAll("\n", "--del--");
				value = value.replaceAll("\r", "");
				value = value.replaceAll("'", "\\\\");
				columns.put((String) columName, value);
			}
			client.insertIntoSuperColumnFamily(columnFamily, rowKey,
					superColumnName, columns, stringSerializer,
					stringSerializer, stringSerializer);
		} else if (columnName instanceof Long) {
			HashMap<Long, String> columns = new HashMap<Long, String>();
			for (Long columName : ((Map<Long, String>) columnValueMap).keySet()) {
				value = (String) columnValueMap.get(columName);
				value = value.replaceAll("\n", "--del--");
				value = value.replaceAll("\r", "");
				value = value.replaceAll("'", "\\\\");
				columns.put(columName, value);
			}
			client.insertIntoSuperColumnFamily(columnFamily, rowKey,
					superColumnName, columns, stringSerializer,
					LongSerializer.get(), stringSerializer);
		}
	}

	public Map<String, HashMap<String, String>> login(String username,
			String password) {
		Map<String, HashMap<String, String>> resultMap = client.queryKeySpace(
				"select * from SUBSCRIBER_PROFILE where USERNAME = '"
						+ username + "' and PASSWORD = '" + password + "'",
				stringSerializer, stringSerializer, stringSerializer);
		return resultMap;
	}

	public void saveStandardColumnFamily(
			HashMap<String, Object> columnValueMap, String columnFamily) {

		client.saveStandardColumnFamily(columnValueMap, columnFamily);
	}

	public Map<String, HashMap<String, String>> retrieveStandardColumnFamily(
			String columnFamily, String columnName, String columnValue) {
		Map<String, HashMap<String, String>> resultMap = new HashMap<String, HashMap<String, String>>();
		if (columnName != null && !columnName.equals("") && columnValue != null
				&& !columnValue.equals("")) {
			resultMap = client.queryKeySpace("select * from '" + columnFamily
					+ "' where " + columnName + " = '" + columnValue + "'",
					stringSerializer, stringSerializer, stringSerializer);
		}
		return resultMap;
	}
	
	public Map<String, HashMap<String, String>> retrieveStandardColumnFamily(
			String columnFamily, HashMap<String, String> condtitionMap) {
		Map<String, HashMap<String, String>> resultMap = new HashMap<String, HashMap<String, String>>();
		String query="";
		Iterator iterator = condtitionMap.entrySet().iterator();
		while (iterator.hasNext()) {
	    	Map.Entry conditionEntry = (Map.Entry) iterator.next();
	    	String columnName=(String)conditionEntry.getKey();
	    	String columnValue=(String)conditionEntry.getValue();
	    	if (columnName != null && !columnName.equals("") && columnValue != null
					&& !columnValue.equals("")) {
	    		if(query.equals(""))
	    			query="select * from '" + columnFamily + "' where ";
	    		else
	    			query=query + " and ";
				query = query + columnName + " = '" + columnValue + "'";
				
			}
		}
		resultMap = client.queryKeySpace(query,
				stringSerializer, stringSerializer, stringSerializer);
		return resultMap;
	}
	public void updateStatus(String subscriberId, String columnFamily,
			String columnName, String status) {
		HashMap<String, String> columnValueMap = new HashMap<String, String>();
		columnValueMap.put("ROWKEY", subscriberId);
		columnValueMap.put(columnName, status);
		client.saveStandardColumnFamily(columnValueMap, columnFamily);

	}

	public void saveSubscriberProfile(String subscriberId, String message) {
		HashMap<String, String> columnValueMap = new HashMap<String, String>();
		columnValueMap.put("ROWKEY", subscriberId);
		columnValueMap.put("MESSAGE", message);
		client.saveStandardColumnFamily(columnValueMap, "SUBSCRIBER_PROFILE");
	}
	public void saveSubscriberProfile(MessageVO messageVo) {
		HashMap<String, String> columnValueMap = new HashMap<String, String>();
		columnValueMap.put("ROWKEY", messageVo.getId());
		columnValueMap.put("MESSAGE", messageVo.getMessage());
		columnValueMap.put("USERNAME", messageVo.getName());
		columnValueMap.put("PASSWORD",  messageVo.getPassword());
		client.saveStandardColumnFamily(columnValueMap, "SUBSCRIBER_PROFILE");
	}
	
	public Map<String, HashMap<String, String>> retrieveStandardColumnFamilyForCondition(
			String columnFamily, String condition) {
		Map<String, HashMap<String, String>> resultMap = new HashMap<String, HashMap<String, String>>();

			resultMap = client.queryKeySpace("select * from '" + columnFamily
					+ "' where " + condition ,
					stringSerializer, stringSerializer, stringSerializer);
		return resultMap;
 }
	public List<String> getMessageParticipants(String messageId){
		Map<String, HashMap<String, String>> resultMessageMap = retrieveStandardColumnFamily("MESSAGE_PARTICIPANT","MESSAGEID",messageId);
		HashMap<String, List<String>> columnValues = new HashMap<String, List<String>>();
		List<String> columnList = new ArrayList<String>();
		columnList.add("USERID");
		List<String> userList=new ArrayList<String>();
		Iterator iterator = resultMessageMap.entrySet().iterator();
		while (iterator.hasNext()) {
	    	Map.Entry subscriberIdEntry = (Map.Entry) iterator.next();
			columnValues=getColumnValues(columnList,subscriberIdEntry);
			userList.add(columnValues.get("USERID").get(0).toString());
		}
		return userList;
	}
	public List<String> getUserMessages(String userId){
		Map<String, HashMap<String, String>> resultMessageMap =retrieveStandardColumnFamily("MESSAGE_PARTICIPANT","USERID",userId);
		HashMap<String, List<String>> columnValues = new HashMap<String, List<String>>();
		List<String> columnList = new ArrayList<String>();
		columnList.add("MESSAGEID");
		List<String> messageList=new ArrayList<String>();
		Iterator iterator = resultMessageMap.entrySet().iterator();
		while (iterator.hasNext()) {
	    	Map.Entry subscriberIdEntry = (Map.Entry) iterator.next();
			columnValues=getColumnValues(columnList,subscriberIdEntry);
			messageList.add(columnValues.get("MESSAGEID").get(0).toString());
		}
		return messageList;
	}
	 public HashMap<String, List<String>>  getColumnValues(List<String> column,Map.Entry subscriberIdEntry){
	    	String columnName = "";
			List<String> msgIdList;
	    	HashMap<String, String> columnValueMap = new HashMap<String, String>();
			HashMap<String, List<String>> columnValues = new HashMap<String, List<String>>();

			columnValueMap = (HashMap<String, String>) subscriberIdEntry
					.getValue();
			Iterator columnValueIterator = columnValueMap.entrySet().iterator();
			while (columnValueIterator.hasNext()) {
				Map.Entry columnValueEntry = (Map.Entry) columnValueIterator
						.next();
				columnName = (String) columnValueEntry.getKey();
				if (column.contains(columnName)) {
					if (columnValues.containsKey(columnName))
						msgIdList = columnValues.get(columnName);
					else {
						msgIdList = new ArrayList<String>();
						columnValues.put(columnName, msgIdList);
					}

					msgIdList.add(columnValueEntry.getValue().toString());
				}
			}
			return columnValues;
	    }
	 public String getColumnValue(String columnFamily, String rowKey,
				String column) {
			String columnName = "";
			Map<String, HashMap<String, String>> resultMap = retrieveStandardColumnFamily(columnFamily, rowKey);
			HashMap<String, String> columnValueMap = new HashMap<String, String>();
			Iterator iterator = resultMap.entrySet().iterator();
			while (iterator.hasNext()) {
				Map.Entry subscriberIdEntry = (Map.Entry) iterator.next();
				columnValueMap = (HashMap<String, String>) subscriberIdEntry
						.getValue();
				Iterator columnValueIterator = columnValueMap.entrySet().iterator();
				while (columnValueIterator.hasNext()) {
					Map.Entry columnValueEntry = (Map.Entry) columnValueIterator
							.next();
					columnName = (String) columnValueEntry.getKey();
					if (columnName.equals(column)) {
						return (String) columnValueEntry.getValue();
					}
				}
			}
			return "";
		}
	 
	 public List<String> getColumnValue(
				Map<String, HashMap<String, String>> resultMap, String column) {
			String columnName = "";
			List<String> msgIdList = new ArrayList<String>();
			HashMap<String, String> columnValueMap = new HashMap<String, String>();
			Iterator iterator = resultMap.entrySet().iterator();
			while (iterator.hasNext()) {
				Map.Entry subscriberIdEntry = (Map.Entry) iterator.next();
				columnValueMap = (HashMap<String, String>) subscriberIdEntry
						.getValue();
				Iterator columnValueIterator = columnValueMap.entrySet().iterator();
				while (columnValueIterator.hasNext()) {
					Map.Entry columnValueEntry = (Map.Entry) columnValueIterator
							.next();
					columnName = (String) columnValueEntry.getKey();
					if (columnName.equals(column)) {
						msgIdList.add(columnValueEntry.getValue().toString());
					}
				}
			}
			return msgIdList;
		}
	 
	 public void createColumnFamily(String messageType) throws InvalidRequestException, SchemaDisagreementException, TException{
		 client.createMessageTypeStore(messageType);
	 }

	@Override
	public void saveRoleDefinition(MessageVO messageVO) {
		// TODO Auto-generated method stub
		HashMap<String, Object> roleDefinitionIndexMap = new HashMap<String, Object>();
		String messageXML = messageVO.getMessage();
		Document messageDocument = XMLHelper.getXMLDocument(messageXML);
		String roleName = (String) XMLHelper.read(messageDocument,
				"//message/ROLE_DEFINITION/roleName/thumbnail",
				XPathConstants.STRING);
		roleDefinitionIndexMap.put("ROWKEY", roleName);
		roleDefinitionIndexMap.put("ROLE_NAME", roleName);
		client.saveStandardColumnFamily(roleDefinitionIndexMap,
				"ROLE_DEFINITION1");
		
	}

	@Override
	public Map<String, HashMap<String, String>> login(String username,
			String password, String organizationId) {
		Map<String, HashMap<String, String>> resultMap = cassandraConnector.queryKeySpace(
				"select * from SUBSCRIBER_PROFILE where USERNAME = '"
						+ username + "' and PASSWORD = '" + password + "'",
				stringSerializer, stringSerializer, stringSerializer,organizationId);
		return resultMap;
	}
	 
	 /*private HashMap<String, List<String>>  getColumnValues(List<String> column,Map.Entry subscriberIdEntry){
	    	String columnName = "";
			List<String> msgIdList;
	    	HashMap<String, String> columnValueMap = new HashMap<String, String>();
			HashMap<String, List<String>> columnValues = new HashMap<String, List<String>>();

			columnValueMap = (HashMap<String, String>) subscriberIdEntry
					.getValue();
			Iterator columnValueIterator = columnValueMap.entrySet().iterator();
			while (columnValueIterator.hasNext()) {
				Map.Entry columnValueEntry = (Map.Entry) columnValueIterator
						.next();
				columnName = (String) columnValueEntry.getKey();
				if (column.contains(columnName)) {
					if (columnValues.containsKey(columnName))
						msgIdList = columnValues.get(columnName);
					else {
						msgIdList = new ArrayList<String>();
						columnValues.put(columnName, msgIdList);
					}

					msgIdList.add(columnValueEntry.getValue().toString());
				}
			}
			return columnValues;
	    }*/

	/*
	 * public void saveRoleMessage(Role role,String subscriberId){
	 * HashMap<String, String> columnValueMap = new HashMap<String, String>();
	 * columnValueMap.put("ROWKEY", role.getSubscriber_roleId());
	 * columnValueMap.put("MESSAGE", role.getMessage());
	 * columnValueMap.put("ROLE_NAME", role.getRoleName());
	 * columnValueMap.put("CONTACT", role.getContact());
	 * columnValueMap.put("PLAYER_OR_SCOPER", role.getPlayerOrScoper());
	 * columnValueMap.put("ROLE_STATUS", role.getRole_status());
	 * columnValueMap.put("CREATED_BY", role.getCreatedBy());
	 * columnValueMap.put("ROLE_CREATION_TIME", role.getCreatedTime());
	 * columnValueMap.put("LAST_MODIFIED_TIME", role.getLastModifiedTime());
	 * columnValueMap.put("MODIFIED_BY", role.getModifiedBy());
	 * columnValueMap.put("BLOCKED", "FALSE");
	 * client.saveStandardColumnFamily(columnValueMap, "ROLE");
	 * saveRoleIndex(subscriberId, role.getRoleId(), role.getRoleName()); }
	 * 
	 * 
	 * private void saveRoleIndex(String subscriberId, String roleId, String
	 * roleName){ HashMap<String, String> columnValueMap = new HashMap<String,
	 * String>(); columnValueMap.put("ROWKEY", subscriberId);
	 * columnValueMap.put(roleId, roleName);
	 * client.saveStandardColumnFamily(columnValueMap, "ROLE_INDEX"); }
	 * 
	 * public void saveSubscriberProfileMessage(SubscriberProfile
	 * subscriberProfile) { HashMap<String, String> columnValueMap = new
	 * HashMap<String, String>(); columnValueMap.put("ROWKEY",
	 * subscriberProfile.getSubscriberId()); columnValueMap.put("MESSAGE",
	 * subscriberProfile.getMessage()); columnValueMap.put("USERNAME",
	 * subscriberProfile.getUserName()); columnValueMap.put("PASSWORD",
	 * subscriberProfile.getPassword());
	 * columnValueMap.put("SUBSCRIBER_TYPE",subscriberProfile
	 * .getSubscriberType());
	 * columnValueMap.put("SECURITY_QUESTION",subscriberProfile
	 * .getSecurityQuestion());
	 * columnValueMap.put("SECURITY_ANSWER",subscriberProfile
	 * .getSecurityAnswer()); columnValueMap.put("EMAIL",
	 * subscriberProfile.getEmail()); columnValueMap.put("FULLNAME",
	 * subscriberProfile.getFullName()); columnValueMap.put("ACTIVE",
	 * subscriberProfile.getActive()); columnValueMap.put("CREATION_TIME",
	 * subscriberProfile.getCreatedTime()); columnValueMap.put("CREATED_BY",
	 * subscriberProfile.getCreatedBy());
	 * columnValueMap.put("LAST_MODIFIED_TIME"
	 * ,subscriberProfile.getLastModifiedTime());
	 * columnValueMap.put("MODIFIED_BY", subscriberProfile.getModifiedBy());
	 * System.out.println(subscriberProfile);
	 * client.saveStandardColumnFamily(columnValueMap, "SUBSCRIBER_PROFILE"); }
	 * 
	 * 
	 * public void saveRoleDefinition(String subscriberId, String roleName,
	 * String message){ HashMap<String, String> columnValueMap = new
	 * HashMap<String, String>(); columnValueMap.put("ROWKEY", subscriberId);
	 * columnValueMap.put("DEFINITION" , message);
	 * columnValueMap.put("ROLE_NAME" , roleName);
	 * client.saveStandardColumnFamily(columnValueMap, "ROLE_DEFINITION"); }
	 * 
	 * public void saveService(Services services) { HashMap<String, String>
	 * columnValueMap = new HashMap<String, String>();
	 * columnValueMap.put("ROWKEY", services.getSubscriber_RoleId());
	 * columnValueMap.put("SERVICEID", services.getServiceId());
	 * client.saveStandardColumnFamily(columnValueMap, "SERVICES");
	 * saveServicesIndex(services.getServiceId()); }
	 * 
	 * private void saveServicesIndex(String serviceId){ HashMap<String, String>
	 * columnValueMap = new HashMap<String, String>();
	 * columnValueMap.put("ROWKEY", serviceId); columnValueMap.put("SERVICE",
	 * ""); client.saveStandardColumnFamily(columnValueMap, "SERVICES_INDEX"); }
	 * 
	 * 
	 * 
	 * 
	 * 
	 * public Map<String, HashMap<String, String>> checkAvailabity(String
	 * columnFamily, String userName){ Map<String, HashMap<String, String>>
	 * resultMap = new HashMap<String, HashMap<String, String>>(); resultMap =
	 * client.queryKeySpace( "select * from'" + columnFamily +
	 * "'where USERNAME = '" + userName + "'", stringSerializer,
	 * stringSerializer, stringSerializer); return resultMap; }
	 * 
	 * public Map<String, HashMap<String,String>>
	 * retrieveProfileNameColumnFamily(String columnFamily){ Map<String,
	 * HashMap<String, String>> resultMap = new HashMap<String, HashMap<String,
	 * String>>(); if(columnFamily !=null){ resultMap =
	 * client.queryKeySpace("select USERNAME from '" + columnFamily + "'",
	 * stringSerializer, stringSerializer, stringSerializer); } return
	 * resultMap; }
	 * 
	 * @SuppressWarnings({ "rawtypes", "unchecked" }) public Map<String,
	 * HashMap<String, String>> retrieveRoleDefinition(String roleName, String
	 * columnFamily, String subscriberId){ Map<String, HashMap<String, String>>
	 * resultMap = new HashMap<String, HashMap<String, String>>();
	 * HashMap<String, String> columnValueMap = new HashMap<String, String>();
	 * String columnName="", value="", key=""; resultMap = client.queryKeySpace(
	 * "select * from ROLE_INDEX where key = '" + subscriberId + "'",
	 * stringSerializer, stringSerializer, stringSerializer); Iterator iterator
	 * = resultMap.entrySet().iterator(); while(iterator.hasNext()){ Map.Entry
	 * subscriberIdEntry = (Map.Entry) iterator.next(); columnValueMap =
	 * (HashMap<String, String>) subscriberIdEntry.getValue(); Iterator
	 * columnValueIterator = columnValueMap.entrySet().iterator();
	 * while(columnValueIterator.hasNext()){ Map.Entry columnValueEntry =
	 * (Map.Entry) columnValueIterator.next(); if(!((String)
	 * columnValueEntry.getKey()).equals("KEY")){ value = (String)
	 * columnValueEntry.getValue(); if(value.equals(roleName)) columnName =
	 * (String) columnValueEntry.getKey(); } } } key = subscriberId + "_" +
	 * columnName; resultMap = client.queryKeySpace(
	 * "select * from ROLE_DEFINITION where key = '" + key + "'",
	 * stringSerializer, stringSerializer, stringSerializer);
	 * 
	 * return resultMap; }
	 * 
	 * @SuppressWarnings("rawtypes") public String
	 * retrieveRoleInstanceDefinition(String roleName, String subscriberId){
	 * Map<String, HashMap<String, String>> resultMap = new HashMap<String,
	 * HashMap<String, String>>(); HashMap<String, String> columnValueMap = new
	 * HashMap<String, String>(); String columnName="", value="", key="";
	 * resultMap = client.queryKeySpace(
	 * "select * from ROLE_INDEX where key = '" + subscriberId + "'",
	 * stringSerializer, stringSerializer, stringSerializer);
	 * 
	 * columnValueMap = resultMap.get(subscriberId); Iterator
	 * columnValueIterator = columnValueMap.entrySet().iterator();
	 * while(columnValueIterator.hasNext()){ Map.Entry columnValueEntry =
	 * (Map.Entry) columnValueIterator.next(); if(!((String)
	 * columnValueEntry.getKey()).equals("KEY")){ value = (String)
	 * columnValueEntry.getValue(); if(value.equals(roleName)) columnName =
	 * (String) columnValueEntry.getKey(); } }
	 * 
	 * key = subscriberId + "_" + columnName; resultMap = client.queryKeySpace(
	 * "select * from ROLE where key = '" + key + "'", stringSerializer,
	 * stringSerializer, stringSerializer); columnValueMap = resultMap.get(key);
	 * String message = columnValueMap.get("MESSAGE"); return message; }
	 * 
	 * 
	 * @SuppressWarnings({ "rawtypes", "unchecked" }) public HashMap<String,
	 * String> retrieveRolePermission(String columnFamily, String subscriberId){
	 * Map<String, HashMap<String, String>> resultMap = new HashMap<String,
	 * HashMap<String, String>>(); HashMap<String, String> permissionResultMap =
	 * new HashMap<String, String>(); HashMap<String, String> columnValueMap =
	 * new HashMap<String, String>(); HashMap<String, String> permissionMap =
	 * new HashMap<String, String>(); String key=""; resultMap =
	 * client.queryKeySpace( "select * from ROLE_INDEX where key = '" +
	 * subscriberId + "'", stringSerializer, stringSerializer,
	 * stringSerializer); Iterator iterator = resultMap.entrySet().iterator();
	 * while(iterator.hasNext()){ Map.Entry subscriberIdEntry = (Map.Entry)
	 * iterator.next(); columnValueMap = (HashMap<String, String>)
	 * subscriberIdEntry.getValue(); }
	 * 
	 * Iterator columnValueIterator = columnValueMap.entrySet().iterator();
	 * while(columnValueIterator.hasNext()){ Map.Entry columnValueEntry =
	 * (Map.Entry) columnValueIterator.next(); if(!((String)
	 * columnValueEntry.getKey()).equals("KEY")){ key = subscriberId + "_" +
	 * (String) columnValueEntry.getKey(); resultMap = client.queryKeySpace(
	 * "select * from ROLE_DEFINITION where key = '" + key + "'",
	 * stringSerializer, stringSerializer, stringSerializer); iterator =
	 * resultMap.entrySet().iterator(); while(iterator.hasNext()){ Map.Entry
	 * subscriberIdEntry = (Map.Entry) iterator.next(); permissionMap =
	 * (HashMap<String, String>) subscriberIdEntry.getValue(); Iterator
	 * permissionIterator = permissionMap.entrySet().iterator();
	 * while(permissionIterator.hasNext()){ Map.Entry roleIdEntry = (Map.Entry)
	 * permissionIterator.next(); if(roleIdEntry.getKey().equals("PERMISSION")){
	 * permissionResultMap.put(key, (String) roleIdEntry.getValue()); } } } }
	 * 
	 * } return permissionResultMap; }
	 * 
	 * public void updateRoleDefinition(String roleDefinitionId,String
	 * permission){ HashMap<String, String> columnValueMap = new HashMap<String,
	 * String>(); columnValueMap.put("ROWKEY", roleDefinitionId);
	 * columnValueMap.put("PERMISSION", permission);
	 * client.saveStandardColumnFamily(columnValueMap, "ROLE_DEFINITION"); }
	 * 
	 * public Map<String, HashMap<String, String>> retrieveSubscriberName(String
	 * subId){ Map<String, HashMap<String, String>> resultMap = new
	 * HashMap<String, HashMap<String, String>>(); resultMap =
	 * client.queryKeySpace
	 * ("select USERNAME from SUBSCRIBER_PROFILE where key = '"+ subId+"'",
	 * stringSerializer, stringSerializer, stringSerializer); return resultMap;
	 * }
	 * 
	 * public Map<String, HashMap<String, String>> rolesFromRoleIndex(String
	 * subscriberId, String contact){ Map<String, HashMap<String, String>>
	 * resultMap = new HashMap<String, HashMap<String, String>>();
	 * 
	 * resultMap = client.queryKeySpace(
	 * "select CONTACT,ROLE_STATUS,BLOCKED from ROLE where key = '" +
	 * subscriberId + "' and CONTACT = '" + contact + "'", stringSerializer,
	 * stringSerializer, stringSerializer);
	 * 
	 * return resultMap; }
	 */

}
