package com.hin.hl7messaging.repository;

import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.xml.xpath.XPathConstants;

import me.prettyprint.cassandra.serializers.LongSerializer;
import me.prettyprint.cassandra.serializers.ObjectSerializer;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.hector.api.Serializer;
import me.prettyprint.hector.api.ddl.ColumnFamilyDefinition;
import me.prettyprint.hector.api.ddl.ColumnType;
import me.prettyprint.hector.api.ddl.ComparatorType;
import me.prettyprint.hector.api.factory.HFactory;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;

import com.hin.hl7.messaging.api.IMessageRepository;
import com.hin.hl7messaging.cassandra.CassandraClient;
import com.hin.hl7messaging.utils.XMLHelper;

@Repository(value = "messageRepository")
public class MessageRepository implements IMessageRepository {
	Serializer<String> stringSerializer = StringSerializer.get();
	Serializer<Object> valueSerializer = ObjectSerializer.get();
	LongSerializer longSerializer = LongSerializer.get();
	private Logger logger = Logger.getLogger(MessageRepository.class.getName());

	@Autowired
	private CassandraClient client;

	/**
	 * Creates column families.
	 * 
	 * @param Document
	 *            Is an xml file containing all column families and their
	 *            columns.
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public void registerMessageTypes(Document document) throws Exception {
		ColumnFamilyDefinition cfDef = null;
		List<ColumnFamilyDefinition> ColumnFamilyDefinitionlist = new ArrayList();
		String keyspaceName = "MessageKS";

		NodeList fields = (NodeList) XMLHelper.read(document,
				"/message/message-type", XPathConstants.NODESET);
		int msgTypeSize = fields.getLength();

		for (int i = 1; i <= msgTypeSize; i++) {

			String msgTypeName = "/message/message-type[" + i + "]/@name";
			String columnFamily = (String) XMLHelper.read(document,
					msgTypeName, XPathConstants.STRING);

			String messageType = "/message/message-type[" + i + "]/@type";
			String columnFamilyType = (String) XMLHelper.read(document,
					messageType, XPathConstants.STRING);

			cfDef = HFactory.createColumnFamilyDefinition(keyspaceName,
					columnFamily, ComparatorType.UTF8TYPE);
			if (columnFamilyType.equals("SUPER"))
				cfDef.setColumnType(ColumnType.SUPER);
			ColumnFamilyDefinitionlist.add(cfDef);
		}

		client.createColumnFamilies(ColumnFamilyDefinitionlist);
	}

	/**
	 * Insert a new row to a standard column family or super column family.
	 * 
	 * @param columnFamily
	 *            Name of the column family
	 * @param columnMap
	 *            A map containing column names and values. The column name and
	 *            value can be of any type.
	 */
	@SuppressWarnings("rawtypes")
	synchronized public void saveMessage(String columnFamily,
			HashMap<String, Object> columnMap) {

		String columnFamilyType = "", supercolumnName = "", rowKey = "";
		Object subMapObject = new Object();
		rowKey = (String) columnMap.get("ROWKEY");

		if (rowKey == null) {
			// System.out.println("No row key  is specified. Message will be discarded");
			return;
		}

		if (columnMap.size() < 1) {
			// System.out.println("No columns to save.");
			return;
		}

		columnFamilyType = getColumFamilyType(columnMap);
		Iterator iterator = columnMap.entrySet().iterator();

		if (columnFamilyType.equals("SUPER")) {
			try {
				while (iterator.hasNext()) {
					Map.Entry columnMapEntry = (Map.Entry) iterator.next();
					supercolumnName = (String) columnMapEntry.getKey();
					if (!supercolumnName.equals("ROWKEY")) {
						subMapObject = columnMapEntry.getValue();
						saveSuperColumn(columnFamily, rowKey, supercolumnName,
								(Map) subMapObject);
					}
				}
				// System.out.println("Inserted");
			} catch (Exception e) {
				logger.error("An error occured while saving supercolumn: "
						+ e.getMessage());
			}
		} else if (columnFamilyType.equals("STANDARD")) {
			try {
				saveStandardColumn(columnFamily, columnMap, rowKey);
				// System.out.println("Inserted");
			} catch (Exception e) {
				logger.error("An error occured while saving StandardColumn: "
						+ e.getMessage());
			}
		}
	}

	@SuppressWarnings("rawtypes")
	/**
	 * Inserting a message in standard column family.
	 * @param columnFamily Name of the column family.
	 * @param columnMap Consists of column names and its values.
	 * @param rowKey
	 */
	private void saveStandardColumn(String columnFamily,
			HashMap<String, Object> columnMap, String rowKey) {
		String columnName, value;

		if (columnMap.values().toArray()[0] instanceof String) {
			HashMap<String, String> stringColValueMap = new HashMap<String, String>();
			Iterator iterator = columnMap.entrySet().iterator();
			while (iterator.hasNext()) {
				Map.Entry columnMapEntry = (Map.Entry) iterator.next();
				columnName = (String) columnMapEntry.getKey();
				value = (String) columnMapEntry.getValue();
				if (columnName.equals("ROWKEY"))
					rowKey = value;
				else {
					if (columnName.equals("MESSAGE")) {
						value = value.replaceAll("\n", "--del--");
						value = value.replaceAll("\r", "");
						value = value.replaceAll("'", "\\\\");
					}
					stringColValueMap.put(columnName, value);
				}
			}
			client.insertIntoStandardColumnFamily(columnFamily, rowKey,
					stringColValueMap, stringSerializer, stringSerializer);
		} else {
			Iterator iterator = columnMap.entrySet().iterator();
			while (iterator.hasNext()) {
				Map.Entry columnMapEntry = (Map.Entry) iterator.next();
				columnName = (String) columnMapEntry.getKey();
				value = (String) columnMapEntry.getValue();
				if (columnName.equals("ROWKEY"))
					rowKey = value;
				else {
					if (columnName.equals("MESSAGE")) {
						value = value.replaceAll("\n", "--del--");
						value = value.replaceAll("\r", "");
						value = value.replaceAll("'", "\\\\");
					}
				}
			}
			client.insertIntoStandardColumnFamily(columnFamily, rowKey,
					columnMap, stringSerializer, valueSerializer);
		}
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	/**
	 * Inserting a message in super column family
	 * @param columnFamily Name of the column family.
	 * @param rowKey
	 * @param superColumnName
	 * @param columnValueMap Consists of column names and its values.
	 */
	private void saveSuperColumn(String columnFamily, String rowKey,
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

	@SuppressWarnings("rawtypes")
	/**
	 * To get the type(Super or Standard) of a column family.
	 * @param columnMap Consists of column names and its values.
	 */
	private String getColumFamilyType(HashMap<String, Object> columnMap) {

		String columnFamilyType = null, superKey;
		Object subMapObject;

		Iterator iterator = columnMap.entrySet().iterator();
		while (iterator.hasNext()) {
			Map.Entry inboxMapEntry = (Map.Entry) iterator.next();
			superKey = (String) inboxMapEntry.getKey();
			subMapObject = inboxMapEntry.getValue();

			if (!superKey.equals("ROWKEY")) {
				if (subMapObject instanceof Map)
					columnFamilyType = "SUPER";
				else
					columnFamilyType = "STANDARD";
			}

		}
		return columnFamilyType;
	}

	/**
	 * De-identify a message with a default value.
	 * 
	 * @param message
	 *            .
	 * @param creationTime
	 *            Is the creation time of the message.
	 */
	synchronized public void saveDeidentifiedMessage(String message,
			String creationTime) throws Exception {

		try {
			HashMap<String, String> columnValueMap = new HashMap<String, String>();
			columnValueMap.put("UPDATED_MESSAGE", message);
			client.insertIntoStandardColumnFamily("DEIDENTIFICATION",
					creationTime, columnValueMap, stringSerializer,
					stringSerializer);
			// System.out.println("Inserted");

		} catch (Exception e) {
			logger.error("An error occured while inserting rows into StandardColumnFamilly: "
					+ e.getMessage());
		}
	}

	/**
	 * Retrieve Standard column family.
	 * 
	 * @param columnFamily
	 *            Name of the column family.
	 * @param profileID
	 *            Is the unique identity number of user.
	 */
	synchronized public Map<String, HashMap<String, String>> retrieveStandardColumnFamily(
			String columnFamily, String profileID) {

		Map<String, HashMap<String, String>> resultMap = new HashMap<String, HashMap<String, String>>();
		if (profileID == null || profileID.equals("")) {
			resultMap = client
					.queryKeySpace("select * from '" + columnFamily + "'",
							stringSerializer, stringSerializer,
							stringSerializer);
		} else {
			resultMap = client.queryKeySpace("select * from '" + columnFamily
					+ "' where key = '" + profileID + "'", stringSerializer,
					stringSerializer, stringSerializer);
		}
		// System.out.println(resultMap);
		return resultMap;
	}

	/**
	 * Retrieve Standard column family.
	 * 
	 * @param columnFamily
	 *            Name of the column family.
	 * @param profileID
	 *            Is the unique identity number of user.
	 */
	synchronized public Map<String, HashMap<String, String>> queryStandardColumnFamily(
			String columnFamily, Object rowKey) {

		if (rowKey instanceof String) {
			Map<String, HashMap<String, String>> resultMap = new HashMap<String, HashMap<String, String>>();
			if (((String) rowKey).isEmpty()) {
				resultMap = client.queryKeySpace("select * from '"
						+ columnFamily + "'", stringSerializer,
						stringSerializer, stringSerializer);
				// System.out.println(resultMap);
			} else {
				resultMap = client.queryKeySpace("select * from '"
						+ columnFamily + "' where key = '" + rowKey + "'",
						stringSerializer, stringSerializer, stringSerializer);
				// System.out.println(resultMap);
			}
			return resultMap;
		} else {
			Map<String, HashMap<String, String>> resultMap = new HashMap<String, HashMap<String, String>>();
			resultMap = client.queryKeySpace(
					"select * from '" + columnFamily + "' where key = '"
							+ ByteBuffer.wrap(((String) rowKey).getBytes())
							+ "'", stringSerializer, stringSerializer,
					stringSerializer);
			// System.out.println(resultMap);
			return resultMap;
		}
	}

	/**
	 * Retrieve Super column family within a limit.
	 * 
	 * @param startRowKey
	 * @param endRowKey
	 * @param columnFamily
	 *            Name of the column family.
	 * @param startColumn
	 *            Is the start of the column range.
	 * @param endColumn
	 *            Is the end of the column range.
	 * @param columnMap
	 *            A map containing Super column names.
	 */
	@SuppressWarnings("rawtypes")
	synchronized public Map<String, Map<String, Map<String, String>>> retrieveSuperColumnFamily(
			String startRowKey, String endRowKey, String columnFamily,
			Long startColumn, Long endColumn, HashMap<String, Object> columnMap)
			throws Exception {

		List<String> superColumns = new ArrayList<String>();
		String superColumnName = "", startColumnName = "", endColumnName = "";
		int rowLimit = 1000, columnLimit = 1000;

		Set set = columnMap.entrySet();
		Iterator iterator = set.iterator();

		while (iterator.hasNext()) {
			Map.Entry superMapEntry = (Map.Entry) iterator.next();
			superColumnName = (String) superMapEntry.getKey();
			if (superColumnName.equals("ROWKEY")) {
				;
			}// System.out.println(superMapEntry.getValue());
			else
				superColumns.add(superColumnName);
		}

		startColumnName = startColumn != null ? startColumn.toString() : "";
		endColumnName = endColumn != null ? endColumn.toString() : "";

		Map<String, Map<String, Map<String, String>>> result = (client
				.querySuperColumnFamily(startRowKey, endRowKey, superColumns,
						columnFamily, startColumnName, endColumnName, rowLimit,
						columnLimit));

		for (String rowKey : result.keySet()) {
			Map<String, Map<String, String>> superColumn = result.get(rowKey);
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
	}

	@SuppressWarnings("rawtypes")
	@Override
	/**
	 * Retrieve Super column family.
	 * 
	 * @param columnFamily
	 *            Name of the column family.
	 * @param columnMap
	 *            A map containing Super column names.
	 */
	synchronized public HashMap<String, Object> retrieveSuperColumn(
			String columnFamily, HashMap<String, Object> columnMap) {
		String rowKey = "", superColumnName = "";
		Iterator iterator = columnMap.entrySet().iterator();
		while (iterator.hasNext()) {
			Map.Entry superMapEntry = (Map.Entry) iterator.next();
			superColumnName = (String) superMapEntry.getKey();
			if (superColumnName.equals("ROWKEY")) {
				// System.out.println(superMapEntry.getValue());
				rowKey = (String) superMapEntry.getValue();
			}
		}
		HashMap<String, Object> resultMap = new HashMap<String, Object>();

		HashMap<byte[], HashMap<byte[], Object>> hashMapObj = client.getData(
				client.getKeyspace().getKeyspaceName(), columnFamily,
				rowKey.getBytes());
		Set resultSet = hashMapObj.entrySet();
		Iterator resultIterator = resultSet.iterator();
		while (resultIterator.hasNext()) {
			Map.Entry superMapEntry = (Map.Entry) resultIterator.next();
			byte[] keyinBytes = (byte[]) superMapEntry.getKey();
			String keyinString = new String(keyinBytes);
			resultMap.put(keyinString, superMapEntry.getValue());
		}
		return resultMap;
	}

	@Override
	synchronized public HashMap<String, Object> retrieveStandardMessage(
			String columnFamily, HashMap<String, Object> map) {
		return null;
	}

	@Override
	synchronized public HashMap<String, Object> retrieveMessageInbox(
			String columnFamily, Long start, Long end,
			HashMap<String, Object> columnMap) {
		return null;
	}

	synchronized public void archieveMessageRepository(String profileID,
			String location, String message, HashMap<String, String> variable) {
		// System.out.println("Location in repository" + location);
	}

	@Override
	public void deleteColumn(String columnFamilyName, String rowKey,
			String columnName) {
		client.deleteColumn(columnFamilyName, rowKey, columnName);
	}

	@Override
	public void deleteRow(String columnFamily, String rowKey) {
		client.deleteRow(columnFamily, rowKey);
	}
}
