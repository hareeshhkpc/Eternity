/**
 * 
 */
package com.hin.hl7messaging.cassandra;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import javax.annotation.PostConstruct;

import me.prettyprint.cassandra.model.ConfigurableConsistencyLevel;
import me.prettyprint.cassandra.model.CqlQuery;
import me.prettyprint.cassandra.model.CqlRows;
import me.prettyprint.cassandra.model.HColumnImpl;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.cassandra.service.CassandraHostConfigurator;
import me.prettyprint.hector.api.Cluster;
import me.prettyprint.hector.api.HConsistencyLevel;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.Serializer;
import me.prettyprint.hector.api.beans.HColumn;
import me.prettyprint.hector.api.beans.Row;
import me.prettyprint.hector.api.ddl.ColumnFamilyDefinition;
import me.prettyprint.hector.api.ddl.ComparatorType;
import me.prettyprint.hector.api.ddl.KeyspaceDefinition;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;
import me.prettyprint.hector.api.query.QueryResult;

import org.apache.cassandra.db.marshal.UTF8Type;
import org.apache.cassandra.locator.NetworkTopologyStrategy;
import org.apache.cassandra.thrift.Cassandra;
import org.apache.cassandra.thrift.CfDef;
import org.apache.cassandra.thrift.Column;
import org.apache.cassandra.thrift.ColumnDef;
import org.apache.cassandra.thrift.ColumnOrSuperColumn;
import org.apache.cassandra.thrift.ColumnOrSuperColumn._Fields;
import org.apache.cassandra.thrift.ColumnParent;
import org.apache.cassandra.thrift.ColumnPath;
import org.apache.cassandra.thrift.Compression;
import org.apache.cassandra.thrift.ConsistencyLevel;
import org.apache.cassandra.thrift.InvalidRequestException;
import org.apache.cassandra.thrift.KeyRange;
import org.apache.cassandra.thrift.KeySlice;
import org.apache.cassandra.thrift.KsDef;
import org.apache.cassandra.thrift.NotFoundException;
import org.apache.cassandra.thrift.SchemaDisagreementException;
import org.apache.cassandra.thrift.SlicePredicate;
import org.apache.cassandra.thrift.SliceRange;
import org.apache.cassandra.thrift.SuperColumn;
import org.apache.cassandra.thrift.TimedOutException;
import org.apache.cassandra.thrift.UnavailableException;
import org.apache.cassandra.utils.FBUtilities;
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

import com.hin.domain.config.HL7MessageConfiguration;

import me.prettyprint.cassandra.serializers.LongSerializer;
import me.prettyprint.cassandra.serializers.ObjectSerializer;
import me.prettyprint.cassandra.serializers.StringSerializer;

/**
 * @author abdul.kahar
 * 
 */
@Repository(value = "cassandraClient")
public class CassandraClient {

	private Cluster cluster;
	private Keyspace keyspace;

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

	private Boolean connected;
	Cassandra.Client client;
	private TTransport transport;

	private static Logger logger = Logger.getLogger(CassandraClient.class
			.getName());

	public CassandraClient() {

	}

	/**
	 * @return the isThrift
	 */
	public Boolean getIsThrift() {
		return isThrift;
	}

	/**
	 * @param isThrift
	 *            the isThrift to set
	 */
	public void setIsThrift(Boolean isThrift) {
		this.isThrift = isThrift;
	}

	/**
	 * @return the keyspaceName
	 */
	public String getKeyspaceName() {
		return keyspaceName;
	}

	/**
	 * @param keyspaceName
	 *            the keyspaceName to set
	 */
	public void setKeyspaceName(String keyspaceName) {
		this.keyspaceName = keyspaceName;
	}

	/**
	 * @param clusterName
	 *            the clusterName to set
	 */
	public void setClusterName(String clusterName) {
		this.clusterName = clusterName;
	}

	/**
	 * @param host
	 *            the host to set
	 */
	public void setHost(String host) {
		this.host = host;
	}

	/**
	 * @param port
	 *            the port to set
	 */
	public void setPort(Integer port) {
		this.port = port;
	}

	public static void main(String... strings) {
		CassandraClient client = new CassandraClient();
		client.connect("172.25.250.165", 9160);
		try {
			client.createKeySpaceUsingCql("HelloWorld", 1,
					NetworkTopologyStrategy.class.getName());
		} catch (Exception e) {
			logger.error("An error occured while creating Keyspace:"
					+ e.getMessage());
		}

		try {
			client.selectKeySpace("HelloWorld");
		} catch (Exception e) {
			logger.error("An error occured while selecting Keyspace:"
					+ e.getMessage());
		}

		Serializer<String> serializer = StringSerializer.get();
		try {
			client.queryKeySpace(
					"create columnfamily hello (key varchar primary key)  with comparator = UTF8Type",
					serializer, serializer, serializer);
		} catch (Exception e) {
			logger.error("An error occured while creating columnfamily:"
					+ e.getMessage());
		}

		client.queryKeySpace(
				"create keyspace TestKS WITH replication_factor = '1' AND strategy_class = 'NetworkTopologyStrategy'",
				serializer, serializer, serializer);

		client.disconnect();
	}

	/*
	 * @SuppressWarnings("rawtypes") public void
	 * saveStandardColumnFamily(HashMap<String, String> columnValueMap,String
	 * columnFamily) { String columnName ="", value=""; ColumnParent parent =
	 * new ColumnParent(columnFamily); Column column=new Column();
	 * 
	 * Iterator iterator = columnValueMap.entrySet().iterator(); while
	 * (iterator.hasNext()) { Map.Entry columnMapEntry = (Map.Entry)
	 * iterator.next(); if(!(columnMapEntry.getKey().equals("ROWKEY"))){
	 * 
	 * columnName = (String) columnMapEntry.getKey(); value = (String)
	 * columnMapEntry.getValue(); column.setName(columnName.getBytes());
	 * column.setValue(value.getBytes());
	 * column.setTimestamp(System.currentTimeMillis()); try {
	 * client.insert(ByteBuffer.wrap(columnValueMap.get("ROWKEY").getBytes()),
	 * parent, column, ConsistencyLevel.ONE);
	 * 
	 * } catch (InvalidRequestException e) { e.printStackTrace(); } catch
	 * (UnavailableException e) { e.printStackTrace(); } catch
	 * (TimedOutException e) { e.printStackTrace(); } catch (TException e) {
	 * e.printStackTrace(); } } } }
	 */

	public <K, V> void saveStandardColumnFamily(HashMap<K, V> columnValueMap,
			String columnFamily) {
		try {
			Mutator<String> mutator = HFactory.createMutator(keyspace,
					StringSerializer.get());
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
					client.insert(ByteBuffer.wrap(((String) columnValueMap
							.get("ROWKEY")).getBytes()), parent, column,
							ConsistencyLevel.ONE);
					// mutator.insert((String)columnValueMap.get("ROWKEY"),
					// columnFamily,
					// HFactory.createColumn(key,value,getSerializer(key) ,
					// getSerializer(value)));
				}
			}
		} catch (Exception e) {
			logger.error("An error occured while inserting into columnfamily through mutator:"
					+ e.getMessage());
			System.out.println(e);
		}
	}

	public Serializer getSerializer(Object type) {
		if (type instanceof String)
			return StringSerializer.get();
		else if (type instanceof Long)
			return LongSerializer.get();
		return StringSerializer.get();
	}

	/**
	 * Insert a new row to a super column family.
	 * 
	 * @param columnFamily
	 *            Name of the column family
	 * @param rowKey
	 *            Row Key to be used
	 * @param superColumnName
	 *            Name of the super column
	 * @param columnValueMap
	 *            A map containing column names and values. The column name and
	 *            value can be of any type.
	 * @param superColumnNameSerializer
	 *            The serializer used to serialize the super column name
	 * @param keySerializer
	 *            The serializer for the columns in the columnValueMap
	 * @param valueSerializer
	 *            The serializer for the values in the columnValueMap
	 */
	public <SC, K, V> void insertIntoSuperColumnFamily(String columnFamily,
			String rowKey, SC superColumnName, HashMap<K, V> columnValueMap,
			Serializer<SC> superColumnNameSerializer,
			Serializer<K> keySerializer, Serializer<V> valueSerializer) {

		try {
			List<HColumn<K, V>> columnValues = new ArrayList<HColumn<K, V>>();

			Set<?> setMap = columnValueMap.entrySet();
			Iterator<?> iterator = setMap.iterator();

			while (iterator.hasNext()) {
				HColumn<K, V> col = new HColumnImpl<K, V>(keySerializer,
						valueSerializer);
				@SuppressWarnings("unchecked")
				Map.Entry<K, V> entryMap = (Entry<K, V>) iterator.next();
				K key = entryMap.getKey();
				V value = entryMap.getValue();
				col.setName(key);
				col.setValue(value);
				col.setClock(System.currentTimeMillis());
				columnValues.add(col);
			}

			insertSuperSingleRow(columnValues, columnFamily, rowKey,
					superColumnName, superColumnNameSerializer, keySerializer,
					valueSerializer);

		} catch (Exception e) {
			logger.error("An error occured while inserting rows into columfamily:"
					+ e.getMessage());
			System.out.println(e);
		}
	}

	/**
	 * Insert a new row to a standard column family.
	 * 
	 * @param columnFamily
	 *            Name of the column family
	 * @param rowKey
	 *            Row Key to be used
	 * @param columnValueMap
	 *            A map containing column names and values. The column name and
	 *            value can be of any type.
	 * @param keySerializer
	 *            The serializer for the columns in the columnValueMap
	 * @param valueSerializer
	 *            The serializer for the values in the columnValueMap
	 */
	public <K, V> void insertIntoStandardColumnFamily(String columnFamily,
			String rowKey, HashMap<K, V> columnValueMap,
			Serializer<K> keySerializer, Serializer<V> valueSerializer) {
		try {
			Mutator<String> mutator = HFactory.createMutator(keyspace,
					StringSerializer.get());
			Set<?> setMap = columnValueMap.entrySet();
			Iterator<?> iterator = setMap.iterator();

			while (iterator.hasNext()) {
				@SuppressWarnings("unchecked")
				Map.Entry<K, V> entryMap = (Entry<K, V>) iterator.next();
				K key = entryMap.getKey();
				V value = entryMap.getValue();
				if (!key.equals("ROWKEY")) {
					mutator.insert(rowKey, columnFamily, HFactory.createColumn(
							key, value, keySerializer, valueSerializer));
				}
			}
		} catch (Exception e) {
			logger.error("An error occured while inserting into columnfamily through mutator:"
					+ e.getMessage());
			System.out.println(e);
		}
	}

	/**
	 * Queries a Standard column family using CQL query and returns HashMap<K,
	 * CN, V> where K - Row Key CN - Column Name V - Column Value All values are
	 * converted to string, ie., Row Key, Column Name and Values are returned as
	 * strings
	 * 
	 * @param query
	 *            A CQL query as per the Cassandra specification
	 * @return Map&lt;String, Map&lt;String, String&gt;&gt;
	 */
	public <RK, K, V> Map<RK, HashMap<K, V>> queryKeySpace(String query,
			Serializer<RK> rowKeySerializer, Serializer<K> keySerializer,
			Serializer<V> valueSerializer) {
		Map<RK, HashMap<K, V>> keyColumnMap = new HashMap<RK, HashMap<K, V>>();
		Map<K, V> columValueMap = null;
		K key = null;
		V value = null;

		QueryResult<CqlRows<RK, K, V>> result = null;
		try {
			CqlQuery<RK, K, V> cqlQuery = new CqlQuery<RK, K, V>(keyspace,
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
					// System.out.println(col.getName() + ", " +
					// col.getValue());
					key = col.getName();
					value = col.getValue();
					columValueMap.put(key, value);
				}
			}
		}

		return keyColumnMap;
	}

	public void createKeySpaceUsingCql(String keySpaceName,
			Integer replicationFactor, String strategeyClass)
			throws InvalidRequestException, UnavailableException,
			TimedOutException, SchemaDisagreementException, TException {
		TTransport tr = new TFramedTransport(new TSocket(this.host, this.port));
		TProtocol proto = new TBinaryProtocol(tr);
		Cassandra.Client client = new Cassandra.Client(proto);
		tr.open();
		String cql = "CREATE keyspace " + keySpaceName
				+ " WITH strategy_options:replication_factor = '"
				+ replicationFactor + "' " + " AND strategy_class = '"
				+ strategeyClass + "'";
		// create our test keyspace to use
		client.execute_cql_query(ByteBuffer.wrap(cql.getBytes()),
				Compression.NONE);
		tr.close();
		// System.out.println("Keyspace created: " + keySpaceName);
	}

	public <SN, N, V> void insertSuperSingleRow(
			List<HColumn<N, V>> columnValues, String colFam, String rowKey,
			SN superCol, Serializer<SN> superNameSerializer,
			Serializer<N> nameSerializer, Serializer<V> valueSerializer) {
		Mutator<String> mutator = HFactory.createMutator(keyspace,
				StringSerializer.get());
		mutator.insert(rowKey, colFam, HFactory.createSuperColumn(superCol,
				columnValues, superNameSerializer, nameSerializer,
				valueSerializer));
	}

	public void disconnect() {
		if (cluster != null) {
			HFactory.shutdownCluster(cluster);
		}
		if (client != null && transport != null && transport.isOpen()) {
			transport.close();
		}
	}

	public void connect(String host, Integer port) {
		try {
			createThriftAndNonThriftConnections(host, port);
		} catch (TTransportException e) {
			logger.error("An error occured in connection:" + e.getMessage());
		}
	}

	public void connect(String host, Integer port, Boolean isThrift)
			throws TTransportException {
		createThriftAndNonThriftConnections(host, port);
		/*
		 * if (!isThrift) { connect(host, port); } else { transport = new
		 * TFramedTransport(new TSocket(host, port)); TProtocol proto = new
		 * TBinaryProtocol(transport); transport.open(); client = new
		 * Cassandra.Client(proto); }
		 */
	}

	@PostConstruct
	public void initClient() throws Exception {
		connect(host, port, isThrift);
		selectKeySpace(keyspaceName, isThrift);
	}

	private void createThriftAndNonThriftConnections(String host, Integer port)
			throws TTransportException {
		CassandraHostConfigurator config = new CassandraHostConfigurator(host
				+ ":" + port);
		/*
		 * config.setMaxActive(20); config.setMaxIdle(5);
		 * config.setCassandraThriftSocketTimeout(3000);
		 * config.setMaxWaitTimeWhenExhausted(4000);
		 */

		cluster = HFactory.getOrCreateCluster(this.clusterName, config);

		this.host = host;
		this.port = port;

		connected = Boolean.TRUE;

		transport = new TFramedTransport(new TSocket(host, port));
		TProtocol proto = new TBinaryProtocol(transport);
		transport.open();
		client = new Cassandra.Client(proto);
	}

	public void dropKeySpace(String keyspaceName) throws Exception {
		if (this.cluster == null) {
			throw new Exception("Cluster is not created.");
		}
		if (cluster.describeKeyspace(keyspaceName) != null) {
			cluster.dropKeyspace(keyspaceName);
		}
	}

	public void selectKeySpace(String keyspaceName, Boolean isThrift)
			throws Exception {
		selectKeyspaceCommon(keyspaceName);

		/*
		 * if (isThrift) { client.set_keyspace(keyspaceName); //
		 * client.describe_keyspace(keyspaceName); } else {
		 * selectKeySpace(keyspaceName); }
		 */
	}

	public void selectKeySpace(String keyspaceName) throws Exception {
		selectKeyspaceCommon(keyspaceName);

		/*
		 * if (this.cluster == null) { throw new
		 * Exception("Cluster is not created."); }
		 * 
		 * // Create a customized Consistency Level ConfigurableConsistencyLevel
		 * configurableConsistencyLevel = new ConfigurableConsistencyLevel();
		 * 
		 * configurableConsistencyLevel
		 * .setDefaultWriteConsistencyLevel(HConsistencyLevel.ANY);
		 * configurableConsistencyLevel
		 * .setDefaultReadConsistencyLevel(HConsistencyLevel.ANY);
		 * 
		 * this.keyspace = HFactory.createKeyspace(keyspaceName, this.cluster,
		 * configurableConsistencyLevel);
		 * 
		 * if (this.cluster.describeKeyspace(keyspaceName) == null) { throw new
		 * Exception("Keyspace '" + keyspaceName + "' does not exist."); }
		 */
	}

	private void selectKeyspaceCommon(String keyspaceName) throws Exception {
		if (client == null) {
			throw new Exception("Cassandra.Client is not created.");
		}

		client.set_keyspace(keyspaceName);

		if (this.cluster == null) {
			throw new Exception("Cluster is not created.");
		}

		// Create a customized Consistency Level
		ConfigurableConsistencyLevel configurableConsistencyLevel = new ConfigurableConsistencyLevel();

		configurableConsistencyLevel
				.setDefaultWriteConsistencyLevel(HConsistencyLevel.ANY);
		configurableConsistencyLevel
				.setDefaultReadConsistencyLevel(HConsistencyLevel.ANY);

		this.keyspace = HFactory.createKeyspace(keyspaceName, this.cluster,
				configurableConsistencyLevel);

		if (this.cluster.describeKeyspace(keyspaceName) == null) {
			throw new Exception("Keyspace '" + keyspaceName
					+ "' does not exist.");
		}
	}

	/**
	 * Retrieving multiple Rows from a super column family using Key range,
	 * Column range, Row limit and Column limit
	 * 
	 * @param startKey
	 *            starting rowKey of the range.
	 * @param endKey
	 * @param superColumnNames
	 * @param columnFamily
	 *            Name of the column family.
	 * @param startColumn
	 * @param endColumn
	 * @param rowLimit
	 *            The number of rows to return, setting 0 will return all rows.
	 * @param columnLimit
	 *            The number of columns to return, setting 0 will return all
	 *            columns.
	 * @return A Map&lt;String, Map&lt;String, String&gt;&gt;
	 * @throws Exception
	 */
	public Map<String, Map<String, Map<String, String>>> querySuperColumnFamily(
			String startKey, String endKey, List<String> superColumnNames,
			String columnFamily, String startColumn, String endColumn,
			int rowLimit, int columnLimit) throws Exception {

		Map<String, Map<String, Map<String, String>>> mainMap = new HashMap<String, Map<String, Map<String, String>>>();
		Map<String, Map<String, String>> superColumnMap = new HashMap<String, Map<String, String>>();
		HashMap<String, String> columnMap = new HashMap<String, String>();
		String columnName = "", value = "", rowKey = "";

		SlicePredicate predicate = new SlicePredicate();
		SliceRange sliceRange = new SliceRange();

		if (startColumn.equals("")) {
			sliceRange.setStart("".getBytes());
		} else {
			Long start = Long.parseLong(startColumn);
			ByteBuffer columnBytes = ByteBuffer.wrap(startColumn.getBytes());
			sliceRange.setStart(columnBytes);

		}

		if (endColumn.equals("")) {
			sliceRange.setFinish("".getBytes());

		} else {
			Long end = Long.parseLong(endColumn);
			ByteBuffer columnBytes1 = ByteBuffer.wrap(endColumn.getBytes());
			sliceRange.setFinish(columnBytes1);

		}
		predicate.setSlice_range(sliceRange);

		if (columnLimit > 0) {
			sliceRange.setCount(columnLimit);
		}

		KeyRange range = new KeyRange();
		range.start_key = ByteBuffer.wrap(startKey.getBytes());
		range.end_key = ByteBuffer.wrap(endKey.getBytes());

		if (rowLimit > 0) {
			range.setCount(rowLimit);
		}
		ColumnParent parent = new ColumnParent(columnFamily);
		predicate.setSlice_range(sliceRange);

		for (String element : superColumnNames) {
			List<KeySlice> results = client.get_range_slices(
					parent.setSuper_column(element.getBytes()), predicate,
					range, ConsistencyLevel.ONE);
			for (KeySlice result : results) {
				// System.out.println("RowKey: " +
				// StringSerializer.get().fromBytes(result.getKey()));
				List<ColumnOrSuperColumn> columns = result.getColumns();
				rowKey = StringSerializer.get().fromBytes(result.getKey());
				if (columns != null && !columns.isEmpty()) {
					columnMap = new HashMap<String, String>();
					for (ColumnOrSuperColumn col : columns) {
						if (col.getFieldValue(_Fields.COLUMN) != null) {
							Column c = (Column) col
									.getFieldValue(_Fields.COLUMN);
							columnName = StringSerializer.get()
									.fromBytes(c.getName()).toString();
							value = StringSerializer.get().fromBytes(
									c.getValue());
							columnMap.put(columnName, value);
						}
					}
					superColumnMap.put(element, columnMap);
					mainMap.put(rowKey, superColumnMap);
				}
			}
		}
		return mainMap;
	}

	public void createColumnFamilies(
			List<ColumnFamilyDefinition> columnFamilyDefinitionList) {

		ColumnFamilyDefinition cfDef = null;
		KeyspaceDefinition keyspaceDefinition = cluster
				.describeKeyspace("HIN_ETERNITY");
		boolean flag = true;
		Iterator<ColumnFamilyDefinition> iterator = columnFamilyDefinitionList
				.iterator();
		while (iterator.hasNext()) {
			cfDef = (ColumnFamilyDefinition) iterator.next();
			for (ColumnFamilyDefinition columnFamilyDefinition : keyspaceDefinition
					.getCfDefs()) {
				if (columnFamilyDefinition.getName().equals(cfDef.getName())) {
					// System.out.println(cfDef.getName() +
					// " Column Family Exists");
					flag = false;
				}
			}
			if (flag) {
				cfDef.setComparatorType(ComparatorType.UTF8TYPE);
				cfDef.setDefaultValidationClass(UTF8Type.class.getName());
				cfDef.setKeyValidationClass(UTF8Type.class.getName());
				// System.out.println(cfDef.getColumnType());
				if (cfDef.getColumnType().name().equals("SUPER"))
					cfDef.setSubComparatorType(ComparatorType.UTF8TYPE);
				cluster.addColumnFamily(cfDef);

			}
			flag = true;
		}
		// System.out.println("ColumnFamily Created");
	}

	public void createColumnFamily(HL7MessageConfiguration messageConfiguration)
			throws InvalidRequestException, SchemaDisagreementException,
			TException {
		CfDef cfDef = new CfDef();// HFactory.createColumnFamilyDefinition("HIN_ETERNITY",
									// messageConfiguration.getMetaInfo().getArtifactID(),
									// ComparatorType.UTF8TYPE);
		cfDef.setKeyspace("HIN_ETERNITY");
		cfDef.setName(messageConfiguration.getMetaInfo().getArtifactID());
		cfDef.setComparator_type(UTF8Type.class.getName());
		cfDef.setDefault_validation_class(UTF8Type.class.getName());
		cfDef.setKey_validation_class(UTF8Type.class.getName());
		List<ColumnDef> columnDefs = new ArrayList<ColumnDef>();

		for (int i = 0; i < messageConfiguration.getConfigArchive()
				.getAttributes().size(); i++) {
			ColumnDef columnDef = new ColumnDef();
			columnDef.setName(messageConfiguration.getConfigArchive()
					.getAttributes().get(i).getName().getBytes());
			columnDef.setValidation_class(UTF8Type.class.getName());
			columnDefs.add(columnDef);
		}

		cfDef.setColumn_metadata(columnDefs);
		if (cfDef.getColumn_type().equals("SUPER")) {
			cfDef.setSubcomparator_type(UTF8Type.class.getName());
		}
		client.system_add_column_family(cfDef);

		// cluster.addColumnFamily((ColumnFamilyDefinition) cfDef);
	}

	public boolean checkcolumnFamily(String columnFamily) {
		boolean flag = true;
		KeyspaceDefinition keyspaceDefinition = cluster
				.describeKeyspace("HIN_ETERNITY");
		for (ColumnFamilyDefinition columnFamilyDefinition : keyspaceDefinition
				.getCfDefs()) {
			if (columnFamilyDefinition.getName().equals(columnFamily)) {
				flag = false;
				break;
			}
		}
		return flag;
	}

	public List<String> getKeyspaces() {
		List<KsDef> defs = null;
		List<String> ksNames = new ArrayList<String>();
		try {
			if (client == null)
				throw new TException("Client not connected");

			defs = client.describe_keyspaces();

			if (defs == null)
				throw new TException("No keyspace definitions available");
			for (KsDef def : defs) {
				ksNames.add(def.name);
			}
			return ksNames;
		} catch (InvalidRequestException e) {
			logger.error("An error occured in connection:" + e.getMessage());
		} catch (TException e) {
			logger.error("An error occured while describing Keyspace:"
					+ e.getMessage());
		}
		return null;
	}

	public List<String> getColumnFamilies(String keyspaceName) {
		List<CfDef> defs = null;
		List<String> cfNames = new ArrayList<String>();
		try {
			if (client == null)
				throw new TException("Client not connected");

			KsDef def = client.describe_keyspace(keyspaceName);

			if (def == null)
				throw new TException("No column family definitions available");

			defs = def.getCf_defs();

			for (CfDef cdef : defs) {
				cfNames.add(cdef.name);
			}
			return cfNames;
		} catch (InvalidRequestException e) {
			logger.error("An error occured in Connection:" + e.getMessage());
		} catch (TException e) {
			logger.error("An error occured while describing Keyspace:"
					+ e.getMessage());
		} catch (NotFoundException e) {
			logger.error("An error occured while getting columnfamilies:"
					+ e.getMessage());
		}
		return null;
	}

	public ColumnFamily getColumnFamilyDefinition(String keyspaceName,
			String cfName) {
		try {
			ColumnFamily family = new ColumnFamily();
			if (client == null)
				throw new TException("Client not connected");

			KsDef def = client.describe_keyspace(keyspaceName);

			if (def == null)
				throw new TException("No column family definitions available");

			List<CfDef> defs = def.getCf_defs();
			CfDef selectedCfDef = null;

			for (CfDef cdef : defs) {
				if (cdef.name.equals(cfName)) {
					selectedCfDef = cdef;
				}
			}
			if (selectedCfDef != null) {
				family.setColumnFamilyName(selectedCfDef.getName());
				family.setColumnFamilyType(selectedCfDef.getColumn_type());
				family.setComment(selectedCfDef.getComment());
				family.setComparatorType(selectedCfDef.getComparator_type());
				family.setDefaultValidationClass(selectedCfDef
						.getDefault_validation_class());
				family.setKeySpaceName(selectedCfDef.getKeyspace());
				family.setKeyValidationClass(selectedCfDef
						.getKey_validation_class());
				family.setSubComparatorType(selectedCfDef
						.getSubcomparator_type());
			}
			return family;
		} catch (InvalidRequestException e) {
			logger.error("An error occured in connection:" + e.getMessage());
		} catch (TException e) {
			logger.error("An error occured while describing Keyspace:"
					+ e.getMessage());
		} catch (NotFoundException e) {
			logger.error("An error occured while getting columnfamilies:"
					+ e.getMessage());
		}
		return null;
	}

	public List<CassandraColumn> getColumnDefinitions(String keyspaceName,
			String cfName) {
		List<CassandraColumn> columns = new ArrayList<CassandraColumn>();
		try {
			if (client == null)
				throw new TException("Client not connected");

			KsDef def = client.describe_keyspace(keyspaceName);

			if (def == null)
				throw new TException("No column family definitions available");

			List<CfDef> cfDefs = def.getCf_defs();
			CfDef selectedCfDef = null;

			for (CfDef cfDef : cfDefs) {
				if (cfDef.name.equals(cfName)) {
					selectedCfDef = cfDef;
				}
			}
			if (selectedCfDef != null) {
				List<ColumnDef> colMetaList = selectedCfDef
						.getColumn_metadata();
				for (ColumnDef cDef : colMetaList) {
					CassandraColumn column = new CassandraColumn();
					column.setName(cDef.name);
					column.setIndexName(cDef.index_name);
					column.setIndexType(cDef.index_type.name());
					column.setValidationClass(cDef.getValidation_class());
					columns.add(column);
				}
			}
			return columns;
		} catch (InvalidRequestException e) {
			logger.error("An error occured in connection:" + e.getMessage());
		} catch (TException e) {
			logger.error("An error occured while describing Keyspace:"
					+ e.getMessage());
		} catch (NotFoundException e) {
			logger.error("An error occured while getting columnfamilies:"
					+ e.getMessage());
		}
		return null;
	}

	public HashMap<byte[], HashMap<byte[], Object>> getData(String keyspace,
			String column_family, byte[] rowKey) {
		HashMap<byte[], HashMap<byte[], Object>> data = new HashMap<byte[], HashMap<byte[], Object>>();
		try {
			client.set_keyspace(keyspace);
			SlicePredicate sp = new SlicePredicate();
			SliceRange sr = new SliceRange(ByteBuffer.wrap("".getBytes()),
					ByteBuffer.wrap("".getBytes()), false, 100);
			sp.setSlice_range(sr);

			KeyRange kr = new KeyRange();
			kr.start_key = ByteBuffer.wrap(rowKey);
			kr.end_key = ByteBuffer.wrap(rowKey);
			List<KeySlice> slices = client.get_range_slices(new ColumnParent(
					column_family), sp, kr, ConsistencyLevel.ONE);
			for (KeySlice slice : slices) {
				HashMap<byte[], Object> row = new HashMap<byte[], Object>();
				byte[] key = slice.getKey();
				data.put(key, row);
				for (ColumnOrSuperColumn colOrSupCol : slice.getColumns()) {
					HashMap<byte[], byte[]> superCol = new HashMap<byte[], byte[]>();
					if (colOrSupCol.isSetSuper_column()) {
						SuperColumn supCol = colOrSupCol.getSuper_column();
						row.put(supCol.getName(), superCol);
						for (Column col : supCol.getColumns()) {
							superCol.put(col.getName(), col.getValue());
						}
					} else {
						Column col = colOrSupCol.getColumn();
						row.put(col.getName(), col.getValue());
					}
				}
			}
			return data;
		} catch (InvalidRequestException e) {
			logger.error("An error occured in connection:" + e.getMessage());
		} catch (TException e) {
			logger.error("An error occured while setting keyspace:"
					+ e.getMessage());
		} catch (UnavailableException e) {
			logger.error("An error occured while getting range slice:"
					+ e.getMessage());
		} catch (TimedOutException e) {
			System.out.println(e);
		}

		return null;
	}

	public List<byte[]> getKeys(String keyspace, String column_family) {
		List<byte[]> data = new ArrayList<byte[]>();
		try {
			client.set_keyspace(keyspace);
			SlicePredicate sp = new SlicePredicate();
			SliceRange sr = new SliceRange(ByteBuffer.wrap("".getBytes()),
					ByteBuffer.wrap("".getBytes()), false, 0);
			sp.setSlice_range(sr);

			KeyRange kr = new KeyRange();
			kr.start_key = ByteBuffer.wrap("".getBytes());
			kr.end_key = ByteBuffer.wrap("".getBytes());
			List<KeySlice> slices = client.get_range_slices(new ColumnParent(
					column_family), sp, kr, ConsistencyLevel.ONE);
			for (KeySlice slice : slices) {
				byte[] key = slice.getKey();
				data.add(key);
			}
			return data;
		} catch (InvalidRequestException e) {
			logger.error("An error occured in connection:" + e.getMessage());
		} catch (TException e) {
			logger.error("An error occured while setting keyspace:"
					+ e.getMessage());
		} catch (UnavailableException e) {
			logger.error("An error occured while getting range slice:"
					+ e.getMessage());
		} catch (TimedOutException e) {
			System.out.println(e);
		}

		return null;
	}

	/**
	 * @return the cluster
	 */
	public Cluster getCluster() {
		return cluster;
	}

	/**
	 * @return the keyspace
	 */
	public Keyspace getKeyspace() {
		return keyspace;
	}

	/**
	 * @return the clusterName
	 */
	public String getClusterName() {
		return clusterName;
	}

	/**
	 * @return the host
	 */
	public String getHost() {
		return host;
	}

	/**
	 * @return the port
	 */
	public Integer getPort() {
		return port;
	}

	/**
	 * @return the connected
	 */
	public Boolean getConnected() {
		return connected;
	}

	/**
	 * @return the client
	 */
	public Cassandra.Client getClient() {
		return client;
	}

	/*
	 * (non-Javadoc) /* (non-Javadoc)
	 * 
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "CassandraClient [clusterName=" + clusterName + ", host=" + host
				+ ", port=" + port + ", connected=" + connected + "]";
	}

	public void createMessageTypeStore(String columnFamilyName)
			throws InvalidRequestException, SchemaDisagreementException,
			TException {
		if (!checkcolumnFamily(columnFamilyName)) {
			return;
		}
		CfDef cfDef = new CfDef();// HFactory.createColumnFamilyDefinition("HIN_ETERNITY",
									// messageConfiguration.getMetaInfo().getArtifactID(),
									// ComparatorType.UTF8TYPE);
		cfDef.setKeyspace(keyspaceName);
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
		client.system_add_column_family(cfDef);
	}

	public void deleteColumn(String columnFamilyName, String rowKey,
			String columnName) {
		try {
			byte[] byteArray = rowKey.getBytes();
			ByteBuffer byteBuffer = ByteBuffer.wrap(byteArray);
			ColumnPath columnPath = new ColumnPath(columnFamilyName);
			columnPath.setColumn(columnName.getBytes());
			long timeStamp = System.currentTimeMillis();
			ConsistencyLevel consistencyLevel = ConsistencyLevel.ONE;
			client.remove(byteBuffer, columnPath, timeStamp, consistencyLevel);
		} catch (InvalidRequestException e) {
			e.printStackTrace();
		} catch (UnavailableException e) {
			e.printStackTrace();
		} catch (TimedOutException e) {
			e.printStackTrace();
		} catch (TException e) {
			e.printStackTrace();
		}
	}

	public void deleteRow(String columnFamily, String rowKey) {
		try {
			byte[] byteArray = rowKey.getBytes();
			ByteBuffer byteBuffer = ByteBuffer.wrap(byteArray);
			ColumnPath columnPath = new ColumnPath(columnFamily);
			long timeStamp = System.currentTimeMillis();
			ConsistencyLevel consistencyLevel = ConsistencyLevel.ONE;
			client.remove(byteBuffer, columnPath, timeStamp, consistencyLevel);
		} catch (InvalidRequestException e) {
			e.printStackTrace();
		} catch (UnavailableException e) {
			e.printStackTrace();
		} catch (TimedOutException e) {
			e.printStackTrace();
		} catch (TException e) {
			e.printStackTrace();
		}
	}

}
