package com.hin.hl7messaging.repository;

import java.io.File;
import java.io.FileNotFoundException;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.xml.xpath.XPathConstants;

import me.prettyprint.cassandra.model.HColumnImpl;
import me.prettyprint.cassandra.serializers.LongSerializer;
import me.prettyprint.cassandra.serializers.ObjectSerializer;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.hector.api.Cluster;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.beans.ColumnSlice;
import me.prettyprint.hector.api.beans.HColumn;
import me.prettyprint.hector.api.beans.HSuperColumn;
import me.prettyprint.hector.api.beans.SuperSlice;
import me.prettyprint.hector.api.ddl.ColumnFamilyDefinition;
import me.prettyprint.hector.api.ddl.ColumnType;
import me.prettyprint.hector.api.ddl.ComparatorType;
import me.prettyprint.hector.api.ddl.KeyspaceDefinition;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import me.prettyprint.hector.api.query.QueryResult;
import me.prettyprint.hector.api.query.SliceQuery;
import me.prettyprint.hector.api.query.SuperSliceQuery;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.hin.hl7.messaging.api.IMessageRepository;
import com.hin.hl7messaging.cassandra.CassandraClient;
import com.hin.hl7messaging.repository.ColumnFamily.ColumnFamilyType;
import com.hin.hl7messaging.repository.RowKey.RowKeyType;
import com.hin.hl7messaging.utils.XMLHelper;

@Repository(value = "messageRepositoryStandard")
public class MessageRepositoryStandard implements IMessageRepository {

	private Logger logger = Logger.getLogger(MessageRepositoryStandard.class
			.getName());

	MessageStorageConfig messageStorageConfig = null;

	StringSerializer stringSerializer = StringSerializer.get();
	LongSerializer longSerializer = LongSerializer.get();
	ObjectSerializer objectSerializer = ObjectSerializer.get();
	// Cluster cluster = HFactory.getOrCreateCluster("MessageKS", new
	// CassandraHostConfigurator("localhost:9160"));

	Cluster cluster;// = HFactory.getOrCreateCluster("MessageKS", new
					// CassandraHostConfigurator("172.25.250.165:9160"));
	Keyspace keyspaceOperator;// = HFactory.createKeyspace("MessageKS",
								// cluster);
	KeyspaceDefinition newKeyspace;
	ColumnFamilyDefinition cfDef, cfDef1;

	@Autowired
	CassandraClient client;

	public void setCassandraClient(CassandraClient cassandraClient) {
		this.client = cassandraClient;
		this.cluster = this.client.getCluster();
		this.keyspaceOperator = this.client.getKeyspace();
	}

	/**
	 * Creating column Families
	 * 
	 * @param document
	 *            Is an xml file containing all column families and their
	 *            columns.
	 */
	public void registerMessageTypes(Document document) throws Exception {

		@SuppressWarnings({ "unchecked", "rawtypes" })
		List<ColumnFamilyDefinition> columnFamilyDefinitionList = new ArrayList();

		String msgType = "/message/message-type";
		NodeList fields = (NodeList) XMLHelper.read(document, msgType,
				XPathConstants.NODESET);
		int msgTypeSize = fields.getLength();

		for (int i = 1; i <= msgTypeSize; i++) {

			String msgTypeName = "/message/message-type[" + i + "]/@name";
			String columnFamily = (String) XMLHelper.read(document,
					msgTypeName, XPathConstants.STRING);

			String messageType = "/message/message-type[" + i
					+ "]/@columnFamilyType";
			String columnFamilyType = (String) XMLHelper.read(document,
					messageType, XPathConstants.STRING);

			cfDef = HFactory.createColumnFamilyDefinition("MessageKS",
					columnFamily, ComparatorType.UTF8TYPE);

			if (columnFamilyType.equals("SUPER"))
				cfDef.setColumnType(ColumnType.SUPER);

			columnFamilyDefinitionList.add(cfDef);
		}

		cfDef1 = HFactory.createColumnFamilyDefinition("MessageKS",
				"DEIDENTIFICATION", ComparatorType.UTF8TYPE);
		columnFamilyDefinitionList.add(cfDef1);
		client.createColumnFamilies(columnFamilyDefinitionList);

		System.out.println("ColumnFamily created");
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	/**
	 * Insert a new row to a standard column family or super column family.
	 * @param columnFamily Name of the column family. 
	 * @param columnMap A map containing column names and values.
	 */
	public void saveMessage(String columnFamily,
			HashMap<String, Object> columnMap) {

		Mutator<String> mutator = HFactory.createMutator(keyspaceOperator,
				stringSerializer);
		HColumn<Long, String> column = new HColumnImpl<Long, String>(
				longSerializer, stringSerializer);

		String columnFamilyType = "", rowKey = "", value = "", superColumnName = "", columnName = "";
		Object columnValueMapObject = new Object();
		Long timeStamp;

		/*
		 * To identify whether column family is a super column family or a
		 * standard column family.
		 */
		Iterator iterator = columnMap.entrySet().iterator();
		while (iterator.hasNext()) {
			Map.Entry columnMapEntry = (Map.Entry) iterator.next();
			superColumnName = (String) columnMapEntry.getKey();
			columnValueMapObject = columnMapEntry.getValue();

			if (superColumnName.equals("ROWKEY"))
				rowKey = (String) columnMapEntry.getValue();

			else {
				if (columnValueMapObject instanceof Map)
					columnFamilyType = "SUPER";
				else
					columnFamilyType = "STANDARD";
			}
			System.out.println(rowKey);
		}

		/* For Super column family with column type as Long */
		iterator = columnMap.entrySet().iterator();
		if (columnFamilyType.equals("SUPER")) {
			try {
				while (iterator.hasNext()) {
					Map.Entry columnMapEntry = (Map.Entry) iterator.next();
					superColumnName = (String) columnMapEntry.getKey();
					if (!superColumnName.equals("ROWKEY")) {
						columnValueMapObject = columnMapEntry.getValue();
						HashMap<Long, String> columnValueMap = new HashMap<Long, String>();
						columnValueMap = (HashMap<Long, String>) columnValueMapObject;
						Set subSet = columnValueMap.entrySet();
						Iterator iter = subSet.iterator();
						while (iter.hasNext()) {
							Map.Entry columnValueMapEntry = (Map.Entry) iter
									.next();
							timeStamp = (Long) columnValueMapEntry.getKey();
							value = (String) columnValueMapEntry.getValue();
							value = value.replaceAll("\n", "--del--");
							value = value.replaceAll("\r", "");
							value = value.replaceAll("'", "\\\\");
							System.out.println(value);
							column.setName(timeStamp);
							column.setValue(value);
							column.setClock(timeStamp);
						}
						mutator.insert(rowKey, columnFamily, HFactory
								.createSuperColumn(superColumnName,
										Arrays.asList(column),
										stringSerializer, longSerializer,
										stringSerializer));
					} else
						System.out.println("ROWKEY" + rowKey);
				}
				System.out.println("Inserted");
			} catch (Exception e) {
				logger.error("An error occured while inserting supercolumn into superColumnFamily: "
						+ e.getMessage());
			}

			/* For Standard column family */
		} else if (columnFamilyType.equals("STANDARD")) {
			iterator = columnMap.entrySet().iterator();
			try {
				while (iterator.hasNext()) {
					Map.Entry mEntry = (Map.Entry) iterator.next();
					columnName = (String) mEntry.getKey();
					value = (String) mEntry.getValue();
					if (columnName.equals("ROWKEY"))
						rowKey = value;

					else {
						if (columnName.equals("MESSAGE")) {
							value = value.replaceAll("\n", "--del--");
							value = value.replaceAll("\r", "");
							value = value.replaceAll("'", "\\\\");
						}
						mutator.insert(rowKey, columnFamily,
								HFactory.createStringColumn(columnName, value));
					}
				}
				System.out.println("Inserted");
			} catch (Exception e) {
				logger.error("An error occured while inserting rows into StandardcolumnFamily: "
						+ e.getMessage());
			}
		}

	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	/**
	 * Save a message in super column family with column type as String
	 * @param columnFamily Name of the column family
	 * @param columnMap Consists of column names and its values.
	 */
	private void saveSuperColumnFamily(String columnFamily,
			HashMap<String, Object> columnMap) {
		Mutator<String> mutator = HFactory.createMutator(keyspaceOperator,
				stringSerializer);
		HColumn<String, String> column = new HColumnImpl<String, String>(
				stringSerializer, stringSerializer);
		HashMap<String, String> columnValueMap = new HashMap<String, String>();
		String rowKey = (String) columnMap.get("ROWKEY"), value = "", superColumnName = "", columnName = "";

		Iterator iterator = columnMap.entrySet().iterator();
		iterator = columnMap.entrySet().iterator();
		try {
			while (iterator.hasNext()) {
				Map.Entry columnMapEntry = (Map.Entry) iterator.next();
				superColumnName = (String) columnMapEntry.getKey();
				if (!superColumnName.equals("ROWKEY")) {
					columnValueMap = (HashMap<String, String>) columnMapEntry
							.getValue();
					Iterator iter = columnValueMap.entrySet().iterator();
					while (iter.hasNext()) {
						Map.Entry columnValueMapEntry = (Map.Entry) iter.next();
						columnName = (String) columnValueMapEntry.getKey();
						value = (String) columnValueMapEntry.getValue();
						value = value.replaceAll("\n", "--del--");
						value = value.replaceAll("\r", "");
						value = value.replaceAll("'", "\\\\");
						column.setName(columnName);
						column.setValue(value);
						column.setClock(System.currentTimeMillis());
					}
					mutator.insert(rowKey, columnFamily, HFactory
							.createSuperColumn(superColumnName,
									Arrays.asList(column), stringSerializer,
									stringSerializer, stringSerializer));
				}
			}
			System.out.println("Inserted");
		} catch (Exception e) {
			logger.error("An error occured while inserting rows into SuperColumnFamily: "
					+ e.getMessage());
		}

	}

	/**
	 * de-identified a message with default value
	 * 
	 * @param message
	 * @param creationTime
	 *            Is the creation time of the message.
	 */
	public void saveDeidentifiedMessage(String message, String creationTime)
			throws Exception {
		try {

			Mutator<String> mutator = HFactory.createMutator(keyspaceOperator,
					stringSerializer);
			mutator.insert(creationTime, "DEIDENTIFICATION",
					HFactory.createStringColumn("UPDATED_MESSAGE", message));

			mutator.insert(creationTime, "DEIDENTIFICATION",
					HFactory.createStringColumn("UPDATED_MESSAGE", message));
			System.out.println("Inserted");

		} catch (Exception e) {
			logger.error("An error occured while inserting rows into DEIDENTIFICATION columnfamily: "
					+ e.getMessage());
		}
	}

	@SuppressWarnings("rawtypes")
	/**
	 * Retrieving Standard column family. 
	 * @param columnFamily Name of the column family.
	 * @param columnMap Consists of column names. 
	 */
	synchronized public HashMap<String, Object> retrieveStandardMessage(
			String columnFamily, HashMap<String, Object> columnMap) {

		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		String columnName = "", rowKey = "", value = "";
		Set set = columnMap.entrySet();
		Iterator iterator = set.iterator();

		while (iterator.hasNext()) {
			Map.Entry inboxMapEntry = (Map.Entry) iterator.next();
			columnName = (String) inboxMapEntry.getKey();
			if (columnName.equals("ROWKEY"))
				rowKey = (String) inboxMapEntry.getValue();
		}

		iterator = set.iterator();
		try {

			SliceQuery<String, String, String> q = HFactory.createSliceQuery(
					keyspaceOperator, stringSerializer, stringSerializer,
					stringSerializer);
			while (iterator.hasNext()) {
				Map.Entry mapEntry = (Map.Entry) iterator.next();
				columnName = (String) mapEntry.getKey();

				q.setColumnFamily(columnFamily).setKey(rowKey)
						.setColumnNames(columnName);
				QueryResult<ColumnSlice<String, String>> queryResult = q
						.execute();
				List<HColumn<String, String>> columns = queryResult.get()
						.getColumns();

				for (HColumn<String, String> hColumn : columns) {
					System.out.println(hColumn.getName() + ": "
							+ hColumn.getValue());

					if (hColumn.getName().equals("MESSAGE")) {
						value = hColumn.getValue();
						value = value.replaceAll("--del--", "\n");
						value = value.replaceAll("\\\\", "'");
						resultMap.put(hColumn.getName(), value);
					} else
						resultMap.put(hColumn.getName(), hColumn.getValue());
				}
			}
		} catch (Exception e) {
			logger.error("An error occured while retrieving StandardMessageColumnfamily: "
					+ e.getMessage());
		}

		return resultMap;
	}

	@SuppressWarnings("rawtypes")
	/**
	 * Retrieving a super column family. 
	 * @param columnFamily Name of the column family.
	 * @param columnMap Consists of super column names. 
	 */
	synchronized public HashMap<String, Object> retrieveSuperColumn(
			String columnFamily, HashMap<String, Object> columnMap) {
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		String superColumnName = "", rowKey = "", value = "";
		Set set = columnMap.entrySet();
		Iterator iterator = set.iterator();

		while (iterator.hasNext()) {
			Map.Entry inboxMapEntry = (Map.Entry) iterator.next();
			superColumnName = (String) inboxMapEntry.getKey();
			if (superColumnName.equals("ROWKEY"))
				rowKey = (String) inboxMapEntry.getValue();
		}

		iterator = set.iterator();
		try {
			SuperSliceQuery<String, String, Long, String> query = HFactory
					.createSuperSliceQuery(keyspaceOperator, stringSerializer,
							stringSerializer, longSerializer, stringSerializer);

			while (iterator.hasNext()) {
				Map.Entry superMapEntry = (Map.Entry) iterator.next();
				superColumnName = (String) superMapEntry.getKey();

				if (!superColumnName.equals("ROWKEY")) {
					System.out.println("ROWKEY" + rowKey);

					query.setColumnFamily(columnFamily).setKey(rowKey)
							.setColumnNames(superColumnName);
					QueryResult<SuperSlice<String, Long, String>> queryResult = query
							.execute();

					if (queryResult.get().getSuperColumns().size() > 0) {
						List<HSuperColumn<String, Long, String>> list = queryResult
								.get().getSuperColumns();

						for (HSuperColumn<String, Long, String> row : list) {
							for (HColumn<Long, String> col : row.getColumns()) {
								value = col.getValue();
								value = value.replaceAll("--del--", "\n");
								value = value.replaceAll("\\\\", "'");
								resultMap.put(col.getName().toString(), value);
							}
						}
					}
				}
			}
		} catch (Exception e) {
			logger.error("An error occured while retrieving Super Columnfamily: "
					+ e.getMessage());
		}

		return resultMap;
	}

	@SuppressWarnings("rawtypes")
	/**
	 * Retrieving a super column family based on timeStamp. 
	 * @param columnFamily Name of the column family.
	 * @param start Is the starting timeStamp.
	 * @param end Is the ending timeStamp.
	 * @param columnMap Consists of super column names. 
	 */
	synchronized public HashMap<String, Object> retrieveMessageInbox(
			String columnFamily, Long start, Long end,
			HashMap<String, Object> columnMap) {

		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		String superColumnName = "", value = "", rowKey = "";

		Set set = columnMap.entrySet();
		Iterator iterator = set.iterator();
		try {
			SuperSliceQuery<String, String, Long, String> query = HFactory
					.createSuperSliceQuery(keyspaceOperator, stringSerializer,
							stringSerializer, longSerializer, stringSerializer);

			while (iterator.hasNext()) {
				Map.Entry superMapEntry = (Map.Entry) iterator.next();
				superColumnName = (String) superMapEntry.getKey();
				if (superColumnName.equals("ROWKEY"))
					rowKey = (String) superMapEntry.getValue();
			}

			iterator = set.iterator();
			while (iterator.hasNext()) {
				Map.Entry superMapEntry = (Map.Entry) iterator.next();
				superColumnName = (String) superMapEntry.getKey();
				if (!superColumnName.equals("ROWKEY")) {
					System.out.println("ROWKEY" + rowKey);

					query.setColumnFamily(columnFamily).setKey(rowKey)
							.setColumnNames(superColumnName);
					QueryResult<SuperSlice<String, Long, String>> queryResult = query
							.execute();

					if (queryResult.get().getSuperColumns().size() > 0) {
						List<HSuperColumn<String, Long, String>> list = queryResult
								.get().getSuperColumns();

						for (HSuperColumn<String, Long, String> row : list) {
							System.out.println("\nSuper Column: "
									+ row.getName());

							for (HColumn<Long, String> col : row.getColumns()) {
								value = col.getValue();
								if (col.getName() >= start
										&& col.getName() <= end) {
									System.out.println("TimeStamp: "
											+ col.getName());
									value = value.replaceAll("--del--", "\n");
									value = value.replaceAll("\\\\", "'");
									resultMap.put(col.getName().toString(),
											value);
								}
							}
						}
					}
				}
			}
		} catch (Exception e) {
			logger.error("An error occured while retrieving MessageInbox Columnfamily: "
					+ e.getMessage());
		}
		return resultMap;
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	/**
	 * Updating the statistics for a message. 
	 * @param messageID Is the unique identity number of message.
	 * @param superStatisticsMap Consists of artifactID as super column and creation date and message as columns.
	 * @param columnFamily Name of the column family.
	 */
	synchronized private void updateStatistics(String messageID,
			Map<String, HashMap<String, String>> superStatisticsMap,
			String columnFamily) {
		String totalRowKey = "", columnValue = "", countMapValue = "", countMapkey = "";
		List<String> superColumnNames = new ArrayList<String>();
		HashMap<String, String> countMap = new HashMap<String, String>();
		HColumn<String, String> column = new HColumnImpl<String, String>(
				stringSerializer, stringSerializer);

		Mutator<String> mutator = HFactory.createMutator(keyspaceOperator,
				stringSerializer);
		Map<String, Map<String, Map<String, String>>> resultMap = new HashMap<String, Map<String, Map<String, String>>>();

		/*
		 * For date, month and year as rowKey and artifactID as super column
		 * name. date as ddmmyyyy format month as mmyyyy format year as yyyy
		 * format
		 */
		Iterator iterator = superStatisticsMap.entrySet().iterator();
		List<String> rowKeyList = new ArrayList<String>();
		try {
			while (iterator.hasNext()) {
				Map.Entry mEntry = (Map.Entry) iterator.next();
				countMapkey = (String) mEntry.getKey();
				superColumnNames.add(countMapkey);
				countMap = (HashMap<String, String>) mEntry.getValue();
				Iterator countMapIterator = countMap.entrySet().iterator();
				while (countMapIterator.hasNext()) {
					Map.Entry countMapEntry = (Map.Entry) countMapIterator
							.next();
					countMapValue = (String) countMapEntry.getValue();
					countMapkey = (String) countMapEntry.getKey();
					if (countMapValue.equals("ROWKEY")
							&& countMapkey.equals("TOTAL"))
						totalRowKey = countMapkey;
					else if (countMapValue.equals("ROWKEY")
							&& !(countMapkey.equals("TOTAL"))) {
						rowKeyList.add(countMapkey);
					}
				}
			}
			// For Message Types
			for (String rowKey : rowKeyList) {
				/*
				 * To retrieve the count of a particular rowKey(Date, Month or
				 * Year)
				 */
				resultMap = client.querySuperColumnFamily(rowKey, rowKey,
						superColumnNames, columnFamily, "", "", 1000, 1000);
				System.out.println(resultMap);
				int count = 0;
				if (!(resultMap.isEmpty() || resultMap.get(rowKey)
						.get(superColumnNames.get(0)).isEmpty())) {
					columnValue = resultMap.get(rowKey)
							.get(superColumnNames.get(0)).get("COUNT");
					count = Integer.parseInt(columnValue);
					count++;
				} else {
					columnValue = "";
					count = 1;
				}
				columnValue = Integer.toString(count);
				column.setName("COUNT");
				column.setValue(columnValue);
				column.setClock(System.currentTimeMillis());
				mutator.insert(rowKey, columnFamily, HFactory
						.createSuperColumn(superColumnNames.get(0),
								Arrays.asList(column), stringSerializer,
								stringSerializer, stringSerializer));
				column.setName(messageID);
				column.setValue(messageID);
				column.setClock(System.currentTimeMillis());
				mutator.insert(rowKey, columnFamily, HFactory
						.createSuperColumn(superColumnNames.get(0),
								Arrays.asList(column), stringSerializer,
								stringSerializer, stringSerializer));
			}

			/*
			 * To retrieve the count of a particular rowKey(Total) of an
			 * artifactID
			 */
			resultMap = client.querySuperColumnFamily(totalRowKey, totalRowKey,
					superColumnNames, columnFamily, "", "", 1000, 1000);
			System.out.println(resultMap);
			int count = 0;
			if (!(resultMap.isEmpty() || resultMap.get(totalRowKey)
					.get(superColumnNames.get(0)).isEmpty())) {
				columnValue = resultMap.get(totalRowKey)
						.get(superColumnNames.get(0)).get("COUNT");
				count = Integer.parseInt(columnValue);
				count++;
			} else {
				columnValue = "";
				count = 1;
			}
			columnValue = Integer.toString(count);
			column.setName("COUNT");
			column.setValue(columnValue);
			column.setClock(System.currentTimeMillis());
			mutator.insert(totalRowKey, columnFamily, HFactory
					.createSuperColumn(superColumnNames.get(0),
							Arrays.asList(column), stringSerializer,
							stringSerializer, stringSerializer));
			column.setName(messageID);
			column.setValue(messageID);
			column.setClock(System.currentTimeMillis());
			mutator.insert(totalRowKey, columnFamily, HFactory
					.createSuperColumn(superColumnNames.get(0),
							Arrays.asList(column), stringSerializer,
							stringSerializer, stringSerializer));

			System.out.println("Inserted");

		} catch (Exception e) {
			logger.error("An error occured while inserting rows to Statistics Columnfamily: "
					+ e.getMessage());
		}
	}

	/**
	 * Archiving a message.
	 * 
	 * @param profileID
	 *            Is the unique identity number of user.
	 * @param location
	 *            Is path of the xml file which consists of columns for a
	 *            particular artifactID.
	 * @param message
	 *            .
	 * @param variable
	 *            Consists of variable name with values.
	 */
	synchronized public void archieveMessageRepository(String profileID,
			String location, String message, HashMap<String, String> variable) {
		System.out.println("Location in repository" + location);
		File fileConfig = new File(location);
		try {
			if (fileConfig.exists()) {
				System.out.println("File Exists");
				Document doc = XMLHelper.getXMLDocument(fileConfig);
				/* Sets the class properties for archiving a message */
				messageStorageConfig = getStorageConfiguration(doc);
				/*
				 * Creating a column family with the artifactID as the column
				 * family name
				 */
				createMessageStorageConfig(doc);
				/* Inserting values to the above created column families */
				insertStorageConfig(profileID, message, variable);
			} else {
				System.out.println("File Not Exists");
				throw new FileNotFoundException();
			}

		} catch (FileNotFoundException e) {
			logger.error("An error occured while loading configFile: "
					+ e.getMessage());
		}
	}

	/**
	 * Create Index Column Families.
	 * 
	 * @param document
	 *            Consists of index column family names and its columns to.
	 */
	private void createMessageStorageConfig(Document document) {
		ColumnFamilyDefinition cfDef = null, cfDef1 = null;
		List<ColumnFamilyDefinition> columnFamilyDefinitionList = new ArrayList<ColumnFamilyDefinition>();
		String keyspaceName = "NETWORK";

		String columnFamilyName = messageStorageConfig.getColumnFamily()
				.getName();
		String columnFamilyType = messageStorageConfig.getColumnFamily()
				.getType().getName();

		cfDef = HFactory.createColumnFamilyDefinition(keyspaceName,
				columnFamilyName, ComparatorType.UTF8TYPE);
		if (columnFamilyType.equals("SUPER"))
			cfDef.setColumnType(ColumnType.SUPER);
		columnFamilyDefinitionList.add(cfDef);

		NodeList indexNodes = (NodeList) XMLHelper.read(document,
				"/repository-config/indexes/index", XPathConstants.NODESET);
		int indexTypeSize = indexNodes.getLength();

		for (int i = 1; i <= indexTypeSize; i++) {
			String indexColumnFamilyName = messageStorageConfig.getIndexes()
					.get(i - 1).getName();
			String indexRowKeySeparator = messageStorageConfig.getIndexes()
					.get(i - 1).getRowKey().getKeyFieldsSeparator();
			if (indexRowKeySeparator != null)
				indexColumnFamilyName = columnFamilyName
						.concat(indexRowKeySeparator
								.concat(indexColumnFamilyName));
			else
				indexColumnFamilyName = columnFamilyName
						.concat(indexColumnFamilyName);

			String indexColumnFamilyType = messageStorageConfig.getIndexes()
					.get(i - 1).getType();
			cfDef1 = HFactory.createColumnFamilyDefinition(keyspaceName,
					indexColumnFamilyName, ComparatorType.UTF8TYPE);
			if (indexColumnFamilyType.equals("SUPER"))
				cfDef1.setColumnType(ColumnType.SUPER);
			columnFamilyDefinitionList.add(cfDef1);
		}

		client.createColumnFamilies(columnFamilyDefinitionList);
	}

	/**
	 * Setting the class properties for the given column families.
	 * 
	 * @param document
	 *            Consists of column family names and its columns to.
	 */
	private MessageStorageConfig getStorageConfiguration(Document document) {
		RowKey rowKey = null;
		Column column = null;
		Element storageConfigNode = (Element) XMLHelper.read(document,
				"/repository-config", XPathConstants.NODE);
		List<KeyComponent> key = new ArrayList<KeyComponent>();

		if (storageConfigNode != null) {
			messageStorageConfig = new MessageStorageConfig();
		}

		Element columnFamilyElement = (Element) storageConfigNode
				.getElementsByTagName("column-family").item(0);
		ColumnFamily columnFamily = null;
		if (columnFamilyElement != null) {
			columnFamily = new ColumnFamily();
			messageStorageConfig.setColumnFamily(columnFamily);
		}
		columnFamily.setName(columnFamilyElement.getAttribute("name"));
		columnFamily.setType(ColumnFamilyType.valueOf(columnFamilyElement
				.getAttribute("type")));

		NodeList columnFamilyNodes = storageConfigNode
				.getElementsByTagName("column-family").item(0).getChildNodes();
		Element rowKeyElement = (Element) storageConfigNode
				.getElementsByTagName("row-key").item(0);
		rowKey = null;
		if (rowKeyElement != null) {
			rowKey = new RowKey();
			columnFamily.setRowKey(rowKey);
			rowKey.setName(rowKeyElement.getAttribute("name"));
			rowKey.setKeyFieldsSeparator(rowKeyElement
					.getAttribute("separator"));
			rowKey.setKeyType(RowKeyType.valueOf(rowKeyElement
					.getAttribute("type")));

			KeyComponent keyComponent = null;
			if (rowKeyElement.getAttribute("type").equals("COMPOSITE")) {

				NodeList keyNodes = storageConfigNode
						.getElementsByTagName("row-key").item(0)
						.getChildNodes();
				for (int rowKeyIndex = 0; rowKeyIndex < keyNodes.getLength(); rowKeyIndex++) {
					keyComponent = new KeyComponent();
					if (keyNodes.item(rowKeyIndex).getNodeType() != Node.ELEMENT_NODE) {
						continue;
					}
					Element keyIndexElement = (Element) keyNodes
							.item(rowKeyIndex);
					keyComponent
							.setXpath(keyIndexElement.getAttribute("xpath"));
					if (!keyIndexElement.getAttribute("variable").equals(""))
						keyComponent.setVariable(ColumnVariable
								.valueOf(keyIndexElement
										.getAttribute("variable")));
					key.add(keyComponent);
				}
				rowKey.setKeyComponents(key);
				columnFamily.setRowKey(rowKey);
			}

			else if (rowKeyElement.getAttribute("type").equals("SINGLE")) {
				rowKey = new RowKey();
				rowKey.setKeyFieldsSeparator(rowKeyElement
						.getAttribute("separator"));
				rowKey.setName(rowKeyElement.getAttribute("name"));
				rowKey.setKeyType(RowKeyType.valueOf(rowKeyElement
						.getAttribute("type")));
				rowKey.setXpath(rowKeyElement.getAttribute("xpath"));
				if (!(rowKeyElement.getAttribute("variable").equals("")))
					rowKey.setVariable(ColumnVariable.valueOf(rowKeyElement
							.getAttribute("variable")));
				columnFamily.setRowKey(rowKey);
			}
			columnFamily.setRowKey(rowKey);
		}

		for (int columnNodeIndex = 0; columnNodeIndex < columnFamilyNodes
				.getLength(); columnNodeIndex++) {
			if (columnFamilyNodes.item(columnNodeIndex).getNodeType() != Node.ELEMENT_NODE) {
				continue;
			}

			Element columnElement = (Element) columnFamilyNodes
					.item(columnNodeIndex);
			if (columnElement.getNodeName().equals("column")) {
				column = new Column();
				column.setName(columnElement.getAttribute("name"));
				column.setXpath(columnElement.getAttribute("xpath"));
				column.setVariable(columnElement.getAttribute("variable"));
				columnFamily.setColumn(column);
			}
		}
		messageStorageConfig.setColumnFamily(columnFamily);

		// Indexes
		List<KeyComponent> indexKey = new ArrayList<KeyComponent>();
		NodeList indexFamilyNodes = storageConfigNode
				.getElementsByTagName("indexes").item(0).getChildNodes();
		IndexColumnFamily indexColumnFamily = null;
		for (int nodeIndex = 0; nodeIndex < indexFamilyNodes.getLength(); nodeIndex++) {
			indexColumnFamily = new IndexColumnFamily();
			if (indexFamilyNodes.item(nodeIndex).getNodeType() != Node.ELEMENT_NODE) {
				continue;
			}

			Element indexFamilyElement = (Element) indexFamilyNodes
					.item(nodeIndex);
			if (indexFamilyElement != null) {
				messageStorageConfig.getIndexes().add(indexColumnFamily);
				indexColumnFamily.setName(indexFamilyElement
						.getAttribute("name"));
				indexColumnFamily.setType(indexFamilyElement
						.getAttribute("type"));

				Element rowKeyIndexElement = (Element) indexFamilyElement
						.getElementsByTagName("row-key").item(0);
				rowKey = null;
				if (rowKeyIndexElement != null) {
					rowKey = new RowKey();
					indexColumnFamily.setRowKey(rowKey);

					rowKey.setName(rowKeyIndexElement.getAttribute("name"));
					rowKey.setKeyType(RowKeyType.valueOf(rowKeyIndexElement
							.getAttribute("type")));

					rowKey.setKeyFieldsSeparator(rowKeyIndexElement
							.getAttribute("separator"));
					KeyComponent keyComponent = null;
					if (rowKeyIndexElement.getAttribute("type").equals(
							"COMPOSITE")) {

						NodeList keyNodes = storageConfigNode
								.getElementsByTagName("row-key")
								.item(nodeIndex).getChildNodes();
						for (int rowKeyIndex = 0; rowKeyIndex < keyNodes
								.getLength(); rowKeyIndex++) {
							keyComponent = new KeyComponent();

							if (keyNodes.item(rowKeyIndex).getNodeType() != Node.ELEMENT_NODE) {
								continue;
							}
							Element keyIndexElement = (Element) keyNodes
									.item(rowKeyIndex);
							keyComponent.setXpath(keyIndexElement
									.getAttribute("xpath"));
							if (!keyIndexElement.getAttribute("variable")
									.equals(""))
								keyComponent.setVariable(ColumnVariable
										.valueOf(keyIndexElement
												.getAttribute("variable")));
							indexKey.add(keyComponent);
						}

						rowKey.setKeyComponents(indexKey);
						indexColumnFamily.setRowKey(rowKey);
					}

					else if (rowKeyIndexElement.getAttribute("type").equals(
							"SINGLE")) {
						rowKey = new RowKey();
						rowKey.setKeyFieldsSeparator(rowKeyIndexElement
								.getAttribute("separator"));
						rowKey.setName(rowKeyIndexElement.getAttribute("name"));
						rowKey.setKeyType(RowKeyType.valueOf(rowKeyIndexElement
								.getAttribute("type")));
						rowKey.setXpath(rowKeyIndexElement
								.getAttribute("xpath"));
						if (!rowKeyIndexElement.getAttribute("variable")
								.equals(""))
							rowKey.setVariable(ColumnVariable
									.valueOf(rowKeyIndexElement
											.getAttribute("variable")));
						indexColumnFamily.setRowKey(rowKey);
					}
				}

				Element columnElement = (Element) indexFamilyElement
						.getElementsByTagName("column").item(0);
				if (columnElement.getNodeName().equals("column")) {
					column = new Column();
					column.setName(columnElement.getAttribute("name"));
					column.setXpath(columnElement.getAttribute("xpath"));
					column.setVariable(columnElement.getAttribute("variable"));
					indexColumnFamily.setColumn(column);
				}
			}
		}
		return messageStorageConfig;
	}

	/**
	 * Inserting values in the archive column families by reading the class
	 * properties and also updating the statistics.
	 * 
	 * @param profileID
	 *            Is the unique identity number of user.
	 * @param message
	 *            .
	 * @param variable
	 *            Consists of variable name with values.
	 */
	private void insertStorageConfig(String profileID, String message,
			HashMap<String, String> variable) {
		System.out.println(messageStorageConfig.getColumnFamily());
		System.out.println(messageStorageConfig.getIndexes());

		Document messageDoc = XMLHelper.getXMLDocument(message);
		String creationTime = (String) XMLHelper.read(messageDoc,
				"//creationTime[1]/@value", XPathConstants.STRING);
		String messageID = (String) XMLHelper.read(messageDoc, "//id[1]/@root",
				XPathConstants.STRING);
		String columnFamily = insertStorageConfigIntoColumnFamily(profileID,
				messageDoc, variable);
		insertStorageConfigIntoIndexColumnFamily(columnFamily, profileID,
				messageDoc, variable);

		Map<String, HashMap<String, String>> superStatisticsMap = new HashMap<String, HashMap<String, String>>();
		HashMap<String, String> countMap = new HashMap<String, String>();
		Calendar c = Calendar.getInstance();
		String rowKey = "";
		SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmss");

		Date creationDate = null;
		try {
			c.setTime(format.parse(creationTime));
			creationDate = c.getTime();
		} catch (ParseException e) {
			logger.error("An error occured while parsing creationTime: "
					+ e.getMessage());
		}

		int year = c.get(Calendar.YEAR);
		int month = c.get(Calendar.MONTH) + 1;
		int day = c.get(Calendar.DAY_OF_MONTH);

		DecimalFormat myFormatter = new DecimalFormat("00");
		String monthStr = myFormatter.format(month);
		String dayStr = myFormatter.format(day);

		if (creationDate == null) {
			System.out
					.println("No creation time is given, skipping updating statistics.");
			return;
		} else {
			if (day > 0) {
				rowKey = (dayStr).concat(monthStr).concat(
						Integer.toString(year));
				countMap.put(rowKey, "ROWKEY");
				System.out.println("Date: " + rowKey);
			}
			if (month > 0) {
				rowKey = monthStr.concat(Integer.toString(year));
				countMap.put(rowKey, "ROWKEY");
				System.out.println("Month: " + rowKey);
			}
			if (year > 0) {
				rowKey = Integer.toString(year);
				countMap.put(rowKey, "ROWKEY");
				System.out.println("Year: " + rowKey);
			}
		}

		String superColumnName = columnFamily;
		countMap.put("TOTAL", "ROWKEY");
		superStatisticsMap.put(superColumnName, countMap);

		/* Updating the statistics */
		updateStatistics(messageID, superStatisticsMap, "IN_HIN_STATISTICS");
	}

	private String insertStorageConfigIntoColumnFamily(String profileID,
			Document messageDoc, HashMap<String, String> variable) {
		String columnFamily = "", rowKey = "", rowKeyXpath = "", rowKeyVariable = "", column = "";

		HashMap<String, Object> columnMap = new HashMap<String, Object>();
		/* For Column Family rowKey */
		if ((messageStorageConfig.getColumnFamily().getRowKey().getKeyType()
				.name()).equals("SINGLE")) {
			if (!(messageStorageConfig.getColumnFamily().getRowKey().getXpath()
					.equals(""))) {
				rowKey = messageStorageConfig.getColumnFamily().getRowKey()
						.getXpath();
				rowKey = (String) XMLHelper.read(messageDoc, rowKey,
						XPathConstants.STRING);
			} else if (!(messageStorageConfig.getColumnFamily().getRowKey()
					.getVariable().equals(""))) {
				rowKey = variable.get(messageStorageConfig.getColumnFamily()
						.getRowKey().getVariable().name());
			}
			System.out.println(rowKey);
		} else if ((messageStorageConfig.getColumnFamily().getRowKey()
				.getKeyType().name()).equals("COMPOSITE")) {
			for (int i = 0; i < messageStorageConfig.getColumnFamily()
					.getRowKey().getKeyComponents().size(); i++) {
				if (!(messageStorageConfig.getColumnFamily().getRowKey()
						.getKeyComponents().get(i).getXpath().isEmpty())) {
					rowKeyXpath = messageStorageConfig.getColumnFamily()
							.getRowKey().getKeyComponents().get(i).getXpath();
					rowKeyXpath = (String) XMLHelper.read(messageDoc,
							rowKeyXpath, XPathConstants.STRING);
					rowKey = rowKeyXpath.concat(
							messageStorageConfig.getColumnFamily().getRowKey()
									.getKeyFieldsSeparator()).concat(rowKey);
				} else if (!(messageStorageConfig.getColumnFamily().getRowKey()
						.getKeyComponents().get(i).getVariable().equals(""))) {
					rowKeyVariable = messageStorageConfig.getColumnFamily()
							.getRowKey().getKeyComponents().get(i)
							.getVariable().name();
					rowKeyVariable = variable.get(rowKeyVariable);
					rowKey = rowKeyVariable.concat(
							messageStorageConfig.getColumnFamily().getRowKey()
									.getKeyFieldsSeparator()).concat(rowKey);
				}
				System.out.println(rowKey);
			}
			int lenght = rowKey.length();
			rowKey = rowKey.substring(0, lenght - 1);
		}

		System.out.println("Rowkey: " + rowKey);
		columnMap.put(messageStorageConfig.getColumnFamily().getRowKey()
				.getName(), rowKey);

		/* For Column Family Column */
		String type = messageStorageConfig.getColumnFamily().getType()
				.toString();
		if (type.equals("STANDARD")) {
			if (!(messageStorageConfig.getColumnFamily().getColumn().getXpath()
					.isEmpty())) {
				column = messageStorageConfig.getColumnFamily().getColumn()
						.getXpath();
				column = (String) XMLHelper.read(messageDoc, column,
						XPathConstants.STRING);
			} else if (!(messageStorageConfig.getColumnFamily().getColumn()
					.getVariable().isEmpty())) {
				column = variable.get(messageStorageConfig.getColumnFamily()
						.getColumn().getVariable());
			}
			columnMap.put(messageStorageConfig.getColumnFamily().getColumn()
					.getName(), column);
		}

		else if (type.equals("SUPER")) {
			if (!(messageStorageConfig.getColumnFamily().getColumn().getXpath()
					.isEmpty())) {
				column = messageStorageConfig.getColumnFamily().getColumn()
						.getXpath();
				column = (String) XMLHelper.read(messageDoc, column,
						XPathConstants.STRING);
			} else if (!(messageStorageConfig.getColumnFamily().getColumn()
					.getVariable().isEmpty())) {
				column = variable.get(messageStorageConfig.getColumnFamily()
						.getColumn().getVariable());
			}
			HashMap<String, String> columnValueMap = new HashMap<String, String>();
			columnValueMap.put(messageStorageConfig.getColumnFamily()
					.getColumn().getName(), column);
			columnMap.put(messageStorageConfig.getColumnFamily().getColumn()
					.getName(), columnValueMap);
		}

		columnFamily = messageStorageConfig.getColumnFamily().getName();

		String messageType = messageStorageConfig.getColumnFamily().getType()
				.toString();
		if (messageType.equals("STANDARD"))
			saveMessage(columnFamily, columnMap);
		else
			saveSuperColumnFamily(columnFamily, columnMap);

		return columnFamily;
	}

	/* For Index Column Families */
	private void insertStorageConfigIntoIndexColumnFamily(String columnFamily,
			String profileID, Document messageDoc,
			HashMap<String, String> variable) {
		String indexColumnFamily = "", rowKeyVariable = "", rowKeyXpath = "", rowKeyType = "", rowKey = "", column = "";
		HashMap<String, Object> indexColumnMap = null;

		for (int i = 0; i < messageStorageConfig.getIndexes().size(); i++) {
			indexColumnMap = new HashMap<String, Object>();
			indexColumnFamily = messageStorageConfig.getIndexes().get(i)
					.getName();
			rowKeyType = messageStorageConfig.getIndexes().get(i).getRowKey()
					.getKeyType().name();

			/* For Index Column Family Rowkey */
			if (rowKeyType.equals("COMPOSITE")) {
				for (int j = 0; j < messageStorageConfig.getIndexes().get(i)
						.getRowKey().getKeyComponents().size(); j++) {
					if (!(messageStorageConfig.getIndexes().get(i).getRowKey()
							.getKeyComponents().get(j).getXpath().isEmpty())) {
						rowKeyXpath = messageStorageConfig.getIndexes().get(i)
								.getRowKey().getKeyComponents().get(j)
								.getXpath();
						rowKeyXpath = (String) XMLHelper.read(messageDoc,
								rowKeyXpath, XPathConstants.STRING);
						rowKey = rowKeyXpath.concat(
								messageStorageConfig.getIndexes().get(i)
										.getRowKey().getKeyFieldsSeparator())
								.concat(rowKey);
					} else if (!(messageStorageConfig.getIndexes().get(i)
							.getRowKey().getKeyComponents().get(j)
							.getVariable().equals(""))) {
						rowKeyVariable = messageStorageConfig.getIndexes()
								.get(i).getRowKey().getKeyComponents().get(j)
								.getVariable().name();
						rowKeyVariable = variable.get(rowKeyVariable);
						rowKey = rowKeyVariable.concat(
								messageStorageConfig.getIndexes().get(i)
										.getRowKey().getKeyFieldsSeparator())
								.concat(rowKey);
					}
				}
				int lenght = rowKey.length();
				rowKey = rowKey.substring(0, lenght - 1);
			} else if (rowKeyType.equals("SINGLE")) {
				if (!(messageStorageConfig.getIndexes().get(i).getRowKey()
						.getXpath().equals(""))) {
					rowKey = messageStorageConfig.getIndexes().get(i)
							.getRowKey().getXpath();
					rowKey = (String) XMLHelper.read(messageDoc, rowKey,
							XPathConstants.STRING);
				} else if (!(messageStorageConfig.getIndexes().get(i)
						.getRowKey().getVariable().equals(""))) {
					rowKey = variable.get(messageStorageConfig.getIndexes()
							.get(i).getRowKey().getVariable().name());
				}
			}

			if (!(messageStorageConfig.getIndexes().get(i).getRowKey()
					.getKeyFieldsSeparator().isEmpty()))
				indexColumnFamily = columnFamily.concat(
						messageStorageConfig.getIndexes().get(i).getRowKey()
								.getKeyFieldsSeparator()).concat(
						indexColumnFamily);
			else
				indexColumnFamily = columnFamily.concat(indexColumnFamily);
			System.out.println("Rowkey " + rowKey);
			indexColumnMap.put(messageStorageConfig.getIndexes().get(i)
					.getRowKey().getName(), rowKey);

			/* For Index Column Family column */
			if (!(messageStorageConfig.getIndexes().get(i).getColumn()
					.getXpath().isEmpty())) {
				column = messageStorageConfig.getIndexes().get(i).getColumn()
						.getXpath();
				column = (String) XMLHelper.read(messageDoc, column,
						XPathConstants.STRING);
			} else if (!(messageStorageConfig.getIndexes().get(i).getColumn()
					.getVariable().isEmpty())) {
				column = variable.get(messageStorageConfig.getIndexes().get(i)
						.getColumn().getVariable());
			}
			if (messageStorageConfig.getIndexes().get(i).getType()
					.equals("STANDARD")) {

				indexColumnMap.put(messageStorageConfig.getIndexes().get(i)
						.getColumn().getName(), column);
			} else if (messageStorageConfig.getIndexes().get(i).getType()
					.equals("SUPER")) {
				HashMap<String, String> columnValueMap = new HashMap<String, String>();
				columnValueMap.put(column, column);
				indexColumnMap.put(messageStorageConfig.getIndexes().get(i)
						.getColumn().getName(), columnValueMap);
			}

			if (messageStorageConfig.getIndexes().get(i).getType()
					.equals("STANDARD"))
				saveMessage(indexColumnFamily, indexColumnMap);
			else
				saveSuperColumnFamily(indexColumnFamily, indexColumnMap);
		}
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	/**
	 * Retrieving a standard column family by profileID. 
	 * @param columnFamily Name of the column family.
	 * @param profileID Is the unique identity number of user. 
	 */
	synchronized public Map<String, HashMap<String, String>> retrieveStandardColumnFamily(
			String columnFamily, String profileID) {
		HashMap<String, HashMap<String, String>> resultMap = new HashMap<String, HashMap<String, String>>();
		String rowKey = "";
		if (profileID != null && profileID != "")
			rowKey = profileID;
		else
			return null;
		HashMap<String, String> resultHashMap = new HashMap<String, String>();
		System.out.println(rowKey);
		try {
			HashMap<byte[], HashMap<byte[], Object>> hashMapObj = client
					.getData(client.getKeyspace().getKeyspaceName(),
							columnFamily, profileID.getBytes());
			// System.out.println(hashMapObj);
			Set resultSet = hashMapObj.entrySet();
			Iterator resultIterator = resultSet.iterator();
			while (resultIterator.hasNext()) {
				Map.Entry superMapEntry = (Map.Entry) resultIterator.next();
				byte[] keyinBytes = (byte[]) superMapEntry.getKey();
				String keyinString = new String(keyinBytes);
				HashMap<byte[], Object> valueInMap = (HashMap<byte[], Object>) superMapEntry
						.getValue();
				Set messageResultSet = valueInMap.entrySet();
				Iterator messageResultIterator = messageResultSet.iterator();
				while (messageResultIterator.hasNext()) {
					Map.Entry messageMapEntry = (Map.Entry) messageResultIterator
							.next();
					byte[] keyinBytes1 = (byte[]) messageMapEntry.getValue();
					String keyinString2 = new String(keyinBytes1);
					keyinString2 = keyinString2.replaceAll("--del--", "\n");
					keyinString2 = keyinString2.replaceAll("\\\\", "'");

					resultHashMap.put(keyinString, keyinString2);
				}

				// resultMap.put(keyinString, resultHashMap);
			}

			resultMap.put(profileID, resultHashMap);

		} catch (Exception e) {
			logger.error("An error occured while retrieving Standard Columnfamily: "
					+ e.getMessage());
		}

		return resultMap;
	}

	@Override
	synchronized public Map<String, Map<String, Map<String, String>>> retrieveSuperColumnFamily(
			String startRowKey, String endRowKey, String columnFamily,
			Long startColumn, Long endColumn, HashMap<String, Object> columnMap) {
		return null;
	}

	@Override
	synchronized public Map<String, HashMap<String, String>> queryStandardColumnFamily(
			String columnFamily, Object rowKey) {
		return null;
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

	/*
	 * public void testKeysOnlyPredicate() { RangeSlicesQuery<String, String,
	 * Long> rangeSlicesQuery = HFactory.createRangeSlicesQuery(keyspace, se,
	 * se, le); QueryResult<OrderedRows<String, String, Long>> result =
	 * rangeSlicesQuery.setColumnFamily(cf).setKeys("",
	 * "").setReturnKeysOnly().execute(); OrderedRows<String, String, Long>
	 * orderedRows = result.get(); Row<String, String, Long> row =
	 * orderedRows.iterator().next(); assertNotNull(row.getKey());
	 * assertEquals(0,row.getColumnSlice().getColumns().size());
	 * 
	 * result = rangeSlicesQuery.setColumnNames("","").setRowCount(5).execute();
	 * orderedRows = result.get(); row = orderedRows.iterator().next();
	 * assertNotNull(row.getKey());
	 * assertEquals(2,row.getColumnSlice().getColumns().size()); }
	 */
}
