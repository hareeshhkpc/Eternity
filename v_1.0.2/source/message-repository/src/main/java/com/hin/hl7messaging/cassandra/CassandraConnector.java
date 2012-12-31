package com.hin.hl7messaging.cassandra;

import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Map.Entry;

import javax.annotation.PostConstruct;

import me.prettyprint.cassandra.model.ConfigurableConsistencyLevel;
import me.prettyprint.cassandra.model.CqlQuery;
import me.prettyprint.cassandra.model.CqlRows;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.cassandra.service.CassandraHostConfigurator;
import me.prettyprint.hector.api.HConsistencyLevel;
import me.prettyprint.hector.api.Serializer;
import me.prettyprint.hector.api.beans.HColumn;
import me.prettyprint.hector.api.beans.Row;
import me.prettyprint.hector.api.ddl.ColumnFamilyDefinition;
import me.prettyprint.hector.api.ddl.KeyspaceDefinition;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.query.QueryResult;

import org.apache.cassandra.db.marshal.UTF8Type;
import org.apache.cassandra.thrift.Cassandra;
import org.apache.cassandra.thrift.CfDef;
import org.apache.cassandra.thrift.Column;
import org.apache.cassandra.thrift.ColumnDef;
import org.apache.cassandra.thrift.ColumnParent;
import org.apache.cassandra.thrift.ColumnPath;
import org.apache.cassandra.thrift.Compression;
import org.apache.cassandra.thrift.ConsistencyLevel;
import org.apache.cassandra.thrift.InvalidRequestException;
import org.apache.cassandra.thrift.SchemaDisagreementException;
import org.apache.cassandra.thrift.TimedOutException;
import org.apache.cassandra.thrift.UnavailableException;
import org.apache.log4j.Logger;
import org.apache.thrift.TException;
import org.apache.thrift.protocol.TBinaryProtocol;
import org.apache.thrift.protocol.TProtocol;
import org.apache.thrift.transport.TFramedTransport;
import org.apache.thrift.transport.TSocket;
import org.apache.thrift.transport.TTransport;
import org.apache.thrift.transport.TTransportException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

@Repository(value = "cassandraConnector")
public class CassandraConnector implements ICassandraConnector {

	HashMap<String, CassandaraConnection> connectionMap = new HashMap<String, CassandaraConnection>();

	@Value("${cassandra.DB_CLUSTER_NAME}")
	private String clusterName;

	@Value("${cassandra.DB_HOST}")
	private String host;

	@Value("${cassandra.DB_PORT}")
	private Integer port;

	@Value("${cassandra.DB_THRIFT_CONNECTION}")
	private Boolean isThrift;

	@Value("${cassandra.DB_KEYSPACE_NAME}")
	private String keyspaceName;

	private String masterKeySpace = "HIN";

	private static Logger logger = Logger.getLogger(CassandraClient.class
			.getName());

	@PostConstruct
	public void initClient() throws Exception {
		CassandaraConnection cassandaraConnection = new CassandaraConnection();
		connectionMap.put(masterKeySpace, cassandaraConnection);
		cassandaraConnection.setClusterName(clusterName);
		cassandaraConnection.setHost(host);
		cassandaraConnection.setIsThrift(isThrift);
		cassandaraConnection.setPort(port);
		cassandaraConnection.setKeyspaceName(keyspaceName);
		connect(cassandaraConnection);
	}
    public CassandaraConnection setDefaultConnectionParameter(CassandaraConnection cassandaraConnection){
		cassandaraConnection.setClusterName(clusterName);
		cassandaraConnection.setHost(host);
		cassandaraConnection.setIsThrift(isThrift);
		cassandaraConnection.setPort(port);
		cassandaraConnection.setKeyspaceName(keyspaceName);
		return cassandaraConnection;
    }
	public void createNewConnectionForOrganization(String organizationId,CassandaraConnection cassandaraConnection) throws Exception{
		connectionMap.put(organizationId, cassandaraConnection);
		createKeySpaceUsingCql(cassandaraConnection);
		connect(cassandaraConnection);
	}
	public void connect(CassandaraConnection cassandaraConnection)
			throws TTransportException, Exception {
		createThriftAndNonThriftConnections(cassandaraConnection);
		setKeyspace(cassandaraConnection);
	}

	private void createThriftAndNonThriftConnections(
			CassandaraConnection cassandaraConnection)
			throws TTransportException {
		CassandraHostConfigurator config = new CassandraHostConfigurator(
				cassandaraConnection.getHost() + ":"
						+ cassandaraConnection.getPort());
		cassandaraConnection.setCluster(HFactory.getOrCreateCluster(
				cassandaraConnection.getClusterName(), config));
		cassandaraConnection
				.setTransport(new TFramedTransport(new TSocket(
						cassandaraConnection.getHost(), cassandaraConnection
								.getPort())));
		TProtocol proto = new TBinaryProtocol(
				cassandaraConnection.getTransport());
		cassandaraConnection.getTransport().open();
		cassandaraConnection.setClient(new Cassandra.Client(proto));
	}

	private void setKeyspace(CassandaraConnection cassandaraConnection)
			throws Exception {
		if (cassandaraConnection.getClient() == null) {
			throw new Exception("Cassandra.Client is not created.");
		}

		cassandaraConnection.getClient().set_keyspace(
				cassandaraConnection.getKeyspaceName());

		if (cassandaraConnection.getCluster() == null) {
			throw new Exception("Cluster is not created.");
		}

		ConfigurableConsistencyLevel configurableConsistencyLevel = new ConfigurableConsistencyLevel();

		configurableConsistencyLevel
				.setDefaultWriteConsistencyLevel(HConsistencyLevel.ANY);
		configurableConsistencyLevel
				.setDefaultReadConsistencyLevel(HConsistencyLevel.ANY);

		cassandaraConnection
				.setKeyspace(HFactory.createKeyspace(
						cassandaraConnection.getKeyspaceName(),
						cassandaraConnection.getCluster(),
						configurableConsistencyLevel));

		if (cassandaraConnection.getCluster().describeKeyspace(
				cassandaraConnection.getKeyspaceName()) == null) {
			throw new Exception("Keyspace '"
					+ cassandaraConnection.getKeyspaceName()
					+ "' does not exist.");
		}
	}
	public void createKeySpaceUsingCql(CassandaraConnection cassandaraConnection)
			throws InvalidRequestException, UnavailableException,
			TimedOutException, SchemaDisagreementException, TException {
		TTransport tr = new TFramedTransport(new TSocket(cassandaraConnection.getHost(), cassandaraConnection.getPort()));
		TProtocol proto = new TBinaryProtocol(tr);
		Cassandra.Client client = new Cassandra.Client(proto);
		tr.open();
		String cql = "CREATE keyspace " + cassandaraConnection.getKeyspaceName()
				+ " WITH strategy_options:replication_factor = '"
				+ cassandaraConnection.getReplicationFactor() + "' " + " AND strategy_class = '"
				+ cassandaraConnection.getStrategeyClass() + "'";
		client.execute_cql_query(ByteBuffer.wrap(cql.getBytes()),
				Compression.NONE);
		tr.close();

	}
	private CassandaraConnection getConnectionObject(String organizationId)
			throws TTransportException, Exception {
		if (organizationId == null || organizationId.length() < 1) {
			System.out.println("Organization Id is null");
			organizationId = "HIN";
		}
		CassandaraConnection cassandaraConnection = connectionMap
				.get(organizationId);
		if (cassandaraConnection == null) {
			cassandaraConnection = createCassandraConnection(organizationId);
		}
		return cassandaraConnection;
	}

	private CassandaraConnection createCassandraConnection(String organizationId)
			throws TTransportException, Exception {
		CassandaraConnection cassandraConnection = new CassandaraConnection();
		setConnectionProperties(cassandraConnection, organizationId);
		connect(cassandraConnection);
		connectionMap.put(organizationId, cassandraConnection);
		return cassandraConnection;
	}
	public Boolean isConnectionAvailableForOrganization(String organizationId) throws Exception{
		if(connectionMap.containsKey(organizationId)){
			return true;
		}
		Map<String, HashMap<String, String>> resultMap=getConnectionDetailsForOrganization(organizationId);
		List<String> column = new ArrayList<String>();
		HashMap<String, List<String>> columnValues = new HashMap<String, List<String>>();
		column.add("KEYSPACENAME");
		Iterator iterator = resultMap.entrySet().iterator();
		while (iterator.hasNext()) {
			Map.Entry idEntry = (Map.Entry) iterator.next();
			columnValues = getColumnValues(column, idEntry);
			if(columnValues.isEmpty())
				break;
			if(columnValues.get("CLUSTERNAME").get(0)!=null && columnValues.get("CLUSTERNAME").get(0).length()>1);
				return true;
		}	
		return false;
	}
	private Map<String, HashMap<String, String>> getConnectionDetailsForOrganization(String organizationId) throws Exception{
		Map<String, HashMap<String, String>> resultMap = retrieveStandardColumnFamily(
				"ORGANIZATION_LIST", organizationId, masterKeySpace);
		return resultMap;
	}
	private void setConnectionProperties(
			CassandaraConnection cassandraConnection, String organizationId)
			throws Exception {
		Map<String, HashMap<String, String>> resultMap = getConnectionDetailsForOrganization(organizationId);
		List<String> column = new ArrayList<String>();
		column.add("CLUSTERNAME");
		column.add("HOST");
		column.add("PORT");
		column.add("ISTHRIFT");
		column.add("KEYSPACENAME");
		List<String> msgIdList;
		HashMap<String, String> columnValueMap = new HashMap<String, String>();
		HashMap<String, List<String>> columnValues = new HashMap<String, List<String>>();
		Iterator iterator = resultMap.entrySet().iterator();
		while (iterator.hasNext()) {
			Map.Entry idEntry = (Map.Entry) iterator.next();
			columnValues = getColumnValues(column, idEntry);
			cassandraConnection.setClusterName(columnValues.get("CLUSTERNAME")
					.get(0));
			cassandraConnection.setHost(columnValues.get("HOST").get(0));
			cassandraConnection.setPort(Integer.parseInt(columnValues.get(
					"PORT").get(0)));
			cassandraConnection.setIsThrift(Boolean.parseBoolean(columnValues
					.get("ISTHRIFT").get(0)));
			cassandraConnection.setKeyspaceName(columnValues
					.get("KEYSPACENAME").get(0));
			columnValues.clear();
		}
	}

	/************************************************************* Utility methods ************************************************************************************************************************************/
	public HashMap<String, List<String>> getColumnValues(List<String> column,
			Map.Entry mapEntry) {
		String columnName = "";
		List<String> msgIdList;
		HashMap<String, String> columnValueMap = new HashMap<String, String>();
		HashMap<String, List<String>> columnValues = new HashMap<String, List<String>>();

		columnValueMap = (HashMap<String, String>) mapEntry.getValue();
		Iterator columnValueIterator = columnValueMap.entrySet().iterator();
		while (columnValueIterator.hasNext()) {
			Map.Entry columnValueEntry = (Map.Entry) columnValueIterator.next();
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
	public  List<String> getKeys(
			Map.Entry mapEntry) {
		String columnName = "";
		List<String> keyList=new ArrayList<String>();
		HashMap<String, String> columnValueMap = new HashMap<String, String>();
		columnValueMap = (HashMap<String, String>) mapEntry.getValue();
		Iterator columnValueIterator = columnValueMap.entrySet().iterator();
		while (columnValueIterator.hasNext()) {
			Map.Entry columnValueEntry = (Map.Entry) columnValueIterator.next();
			keyList.add((String) columnValueEntry.getKey());

		}
		return keyList;
	}
	/************************************************** Creating new column family in cassandra ******************************************************************************************************/
	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.hin.hl7messaging.cassandra.ICassandraConnector#createMessageTypeStore
	 * (java.lang.String)
	 */
	public void createMessageTypeStore(String columnFamilyName,
			String organizationId) throws Exception, InvalidRequestException,
			SchemaDisagreementException, TException {
		if (!checkcolumnFamily(columnFamilyName, organizationId)) {
			return;
		}
		CfDef cfDef = new CfDef();
		cfDef.setKeyspace(getConnectionObject(organizationId).getKeyspaceName());
		cfDef.setName(columnFamilyName);
		cfDef.setComparator_type(UTF8Type.class.getName());
		cfDef.setDefault_validation_class(UTF8Type.class.getName());
		cfDef.setKey_validation_class(UTF8Type.class.getName());
		List<ColumnDef> columnDefs = new ArrayList<ColumnDef>();
		ColumnDef columnDef = new ColumnDef();
		columnDef.setName(("VERSION").getBytes());
		columnDef.setValidation_class(UTF8Type.class.getName());
		columnDefs.add(columnDef);
		cfDef.setColumn_metadata(columnDefs);
		if (cfDef.getColumn_type().equals("SUPER")) {
			cfDef.setSubcomparator_type(UTF8Type.class.getName());
		}
		getConnectionObject(organizationId).getClient()
				.system_add_column_family(cfDef);
	}

	public boolean checkcolumnFamily(String columnFamily, String organizationId)
			throws TTransportException, Exception {
		boolean flag = true;
		KeyspaceDefinition keyspaceDefinition = getConnectionObject(
				organizationId).getCluster().describeKeyspace(
				getConnectionObject(organizationId).getKeyspaceName());
		for (ColumnFamilyDefinition columnFamilyDefinition : keyspaceDefinition
				.getCfDefs()) {
			if (columnFamilyDefinition.getName().equals(columnFamily)) {
				flag = false;
				break;
			}
		}
		return flag;
	}

	/*
	 * 
	 */
	public void createColumnFamily(String columnFamilyName, String OrganizationId)
			throws Exception, InvalidRequestException,
			SchemaDisagreementException, TException {
		createMessageTypeStore(columnFamilyName, OrganizationId);
	}

	/************************************************** Saving data to cassandra ******************************************************************************************************/
	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.hin.hl7messaging.cassandra.ICassandraConnector#saveStandardColumnFamily
	 * (java.util.HashMap, java.lang.String)
	 */
	public <K, V> void saveStandardColumnFamily(HashMap<K, V> columnValueMap,
			String columnFamily, String organizationId) {
		try {
			Set<?> setMap = columnValueMap.entrySet();
			Iterator<?> iterator = setMap.iterator();
			while (iterator.hasNext()) {
				@SuppressWarnings("unchecked")
				Map.Entry<K, V> entryMap = (Entry<K, V>) iterator.next();
				K key = entryMap.getKey();
				V value = entryMap.getValue();

				ColumnParent parent = new ColumnParent(columnFamily);
				Column column = new Column();

				value = entryMap.getValue();
				column.setName(((String) key).getBytes());
				column.setValue(((String) value).getBytes());
				column.setTimestamp(System.currentTimeMillis());

				if (!key.equals("ROWKEY")) {
					getConnectionObject(organizationId).getClient().insert(
							ByteBuffer.wrap(((String) columnValueMap
									.get("ROWKEY")).getBytes()), parent,
							column, ConsistencyLevel.ONE);
				}
			}
		} catch (Exception e) {
			logger.error("An error occured while inserting into columnfamily through mutator:"
					+ e.getMessage());
			System.out.println(e);
		}
	}

	public void deleteColumn(String columnFamilyName, String rowKey,
			String columnName, String organizationId) {
		try {
			byte[] byteArray = rowKey.getBytes();
			ByteBuffer byteBuffer = ByteBuffer.wrap(byteArray);
			ColumnPath columnPath = new ColumnPath(columnFamilyName);
			columnPath.setColumn(columnName.getBytes());
			long timeStamp = System.currentTimeMillis();
			ConsistencyLevel consistencyLevel = ConsistencyLevel.ONE;
			getConnectionObject(organizationId).getClient().remove(byteBuffer,
					columnPath, timeStamp, consistencyLevel);
		} catch (InvalidRequestException e) {
			e.printStackTrace();
		} catch (UnavailableException e) {
			e.printStackTrace();
		} catch (TimedOutException e) {
			e.printStackTrace();
		} catch (TException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void deleteRow(String columnFamily, String rowKey,
			String organizationId) {
		try {
			byte[] byteArray = rowKey.getBytes();
			ByteBuffer byteBuffer = ByteBuffer.wrap(byteArray);
			ColumnPath columnPath = new ColumnPath(columnFamily);
			long timeStamp = System.currentTimeMillis();
			ConsistencyLevel consistencyLevel = ConsistencyLevel.ONE;
			getConnectionObject(organizationId).getClient().remove(byteBuffer,
					columnPath, timeStamp, consistencyLevel);
		} catch (InvalidRequestException e) {
			e.printStackTrace();
		} catch (UnavailableException e) {
			e.printStackTrace();
		} catch (TimedOutException e) {
			e.printStackTrace();
		} catch (TException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/************************************************** Reading data from cassandra ******************************************************************************************************/
	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.hin.hl7messaging.cassandra.ICassandraConnector#queryKeySpace(java
	 * .lang.String, me.prettyprint.hector.api.Serializer,
	 * me.prettyprint.hector.api.Serializer,
	 * me.prettyprint.hector.api.Serializer)
	 */
	public <RK, K, V> Map<RK, HashMap<K, V>> queryKeySpace(String query,
			Serializer<RK> rowKeySerializer, Serializer<K> keySerializer,
			Serializer<V> valueSerializer, String organizationId) {
		Map<RK, HashMap<K, V>> keyColumnMap = new HashMap<RK, HashMap<K, V>>();
		Map<K, V> columValueMap = null;
		K key = null;
		V value = null;

		QueryResult<CqlRows<RK, K, V>> result = null;
		try {
			CqlQuery<RK, K, V> cqlQuery = new CqlQuery<RK, K, V>(
					getConnectionObject(organizationId).getKeyspace(),
					rowKeySerializer, keySerializer, valueSerializer);
			cqlQuery.setQuery(query);
			result = cqlQuery.execute();
		} catch (Exception e) {
			logger.error("An error occured while quering Keyspace:"
					+ e.getMessage());
			System.out.println(e);
		}

		if (result != null && result.get() != null
				&& result.get().getList() != null) {
			List<Row<RK, K, V>> list = result.get().getList();
			for (Row<RK, K, V> row : list) {
				columValueMap = new HashMap<K, V>();
				keyColumnMap.put(row.getKey(), (HashMap<K, V>) columValueMap);
				for (HColumn<K, V> col : row.getColumnSlice().getColumns()) {
					key = col.getName();
					value = col.getValue();
					columValueMap.put(key, value);
				}
			}
		}
		return keyColumnMap;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.hin.hl7messaging.cassandra.ICassandraConnector#
	 * retrieveStandardColumnFamily(java.lang.String, java.lang.String,
	 * java.lang.String)
	 */
	public Map<String, HashMap<String, String>> retrieveStandardColumnFamily(
			String columnFamily, String columnName, String columnValue,
			String organizationId) {
		Serializer<String> stringSerializer = StringSerializer.get();
		Map<String, HashMap<String, String>> resultMap = new HashMap<String, HashMap<String, String>>();
		if (columnName != null && !columnName.equals("") && columnValue != null
				&& !columnValue.equals("")) {
			resultMap = queryKeySpace("select * from '" + columnFamily
					+ "' where " + columnName + " = '" + columnValue + "'",
					stringSerializer, stringSerializer, stringSerializer,
					organizationId);
		}
		return resultMap;
	}

	/*
 * 
 */
	public Map<String, HashMap<String, String>> retrieveStandardColumnFamily(
			String columnFamily, String key, String organizationId) {
		Serializer<String> stringSerializer = StringSerializer.get();
		Map<String, HashMap<String, String>> resultMap = new HashMap<String, HashMap<String, String>>();
		if (key == null || key.equals("")) {
			resultMap = queryKeySpace("select * from '" + columnFamily + "'",
					stringSerializer, stringSerializer, stringSerializer,
					organizationId);
		} else {
			resultMap = queryKeySpace("select * from '" + columnFamily
					+ "' where key = '" + key + "'", stringSerializer,
					stringSerializer, stringSerializer, organizationId);
		}
		return resultMap;
	}

	/*
	 * 
	 */
	public Map<String, HashMap<String, String>> retrieveStandardColumnFamilyForCondition(
			String columnFamily, String condition, String organizationId) {
		Map<String, HashMap<String, String>> resultMap = new HashMap<String, HashMap<String, String>>();
		Serializer<String> stringSerializer = StringSerializer.get();
		resultMap = queryKeySpace("select * from '" + columnFamily + "' where "
				+ condition, stringSerializer, stringSerializer,
				stringSerializer, organizationId);
		return resultMap;
	}

	/*
	 * 
	 */
	public Map<String, HashMap<String, String>> retrieveStandardColumnFamily(
			String columnFamily, HashMap<String, String> condtitionMap,
			String OrganizationId) {
		Map<String, HashMap<String, String>> resultMap = new HashMap<String, HashMap<String, String>>();
		String query = "";
		Serializer<String> stringSerializer = StringSerializer.get();
		Iterator iterator = condtitionMap.entrySet().iterator();
		while (iterator.hasNext()) {
			Map.Entry conditionEntry = (Map.Entry) iterator.next();
			String columnName = (String) conditionEntry.getKey();
			String columnValue = (String) conditionEntry.getValue();
			if (columnName != null && !columnName.equals("")
					&& columnValue != null && !columnValue.equals("")) {
				if (query.equals(""))
					query = "select * from '" + columnFamily + "' where ";
				else
					query = query + " and ";
				query = query + columnName + " = '" + columnValue + "'";

			}
		}
		resultMap = queryKeySpace(query, stringSerializer, stringSerializer,
				stringSerializer, OrganizationId);
		return resultMap;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.hin.hl7messaging.cassandra.ICassandraConnector#getColumnValue(java
	 * .lang.String, java.lang.String, java.lang.String, java.lang.String)
	 */
	public String getColumnValue(String columnFamily, String rowKey,
			String column, String organizationId) {
		String columnName = "";
		Map<String, HashMap<String, String>> resultMap = retrieveStandardColumnFamily(
				columnFamily, rowKey, organizationId);
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
}
