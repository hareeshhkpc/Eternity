package com.hin.hl7.messaging.api;

import java.util.HashMap;
import java.util.Map;

import org.w3c.dom.Document;

public interface IMessageRepository {
	public void registerMessageTypes(Document document) throws Exception;
	
	public void saveMessage(String ColumnFamily, HashMap<String, Object> map);	
	
	public void saveDeidentifiedMessage(String message, String creationTime) throws Exception;
	
	// Method of MessageRepositoryStandard
	public HashMap<String, Object> retrieveStandardMessage(String columnFamily, HashMap<String, Object> map);	
	
	public HashMap<String, Object> retrieveSuperColumn(String columnFamily, HashMap<String, Object> columnMap);
	
	// Method of MessageRepositoryStandard
	public HashMap<String, Object> retrieveMessageInbox(String columnFamily, Long start, Long end, HashMap<String, Object> columnMap);
	
	public Map<String, HashMap<String, String>> retrieveStandardColumnFamily(String columnFamily, String profileID);
	
	public  Map<String, Map<String, Map<String, String>>> retrieveSuperColumnFamily(String startRowKey, String endRowKey, String columnFamily,
			Long startColumn, Long endColumn, HashMap<String, Object> columnMap) throws Exception;

	public void archieveMessageRepository(String profileID, String location, String message, HashMap<String,String> variable);

	public Map<String, HashMap<String, String>> queryStandardColumnFamily(
			String columnFamily, Object rowKey);
	public void deleteColumn(String columnFamilyName, String rowKey,
			String columnName);
	public void deleteRow(String columnFamily, String rowKey);
}
