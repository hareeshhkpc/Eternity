/**
 * 
 */
package com.hin.hl7messaging.cassandra;
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.annotation.PostConstruct;

import org.apache.cassandra.thrift.Cassandra;
import org.apache.cassandra.thrift.CfDef;
import org.apache.cassandra.thrift.Column;
import org.apache.cassandra.thrift.ColumnDef;
import org.apache.cassandra.thrift.ColumnOrSuperColumn;
import org.apache.cassandra.thrift.ColumnParent;
import org.apache.cassandra.thrift.ConsistencyLevel;
import org.apache.cassandra.thrift.InvalidRequestException;
import org.apache.cassandra.thrift.KeyRange;
import org.apache.cassandra.thrift.KeySlice;
import org.apache.cassandra.thrift.KsDef;
import org.apache.cassandra.thrift.NotFoundException;
import org.apache.cassandra.thrift.SlicePredicate;
import org.apache.cassandra.thrift.SliceRange;
import org.apache.cassandra.thrift.SuperColumn;
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

/**
 * @author abdul.kahar
 * 
 */
@Repository(value="cassandraDriver")
public class CassandraDriver {

	@Value("${cassandra.DB_CLUSTER_NAME}")
	private String clusterName;
	
	@Value("${cassandra.DB_HOST}")
	private String host;
	
	@Value("${cassandra.DB_PORT}")
	private Integer port;
	
	@Value("${cassandra.DB_KEYSPACE_NAME}")
	private String keyspaceName;
	
	private Boolean connected;
	Cassandra.Client client;
	private TTransport transport;
	
	private static Logger logger = Logger.getLogger(CassandraDriver.class.getName());

	public CassandraDriver() {
		
	}

	/**
	 * @return the keyspaceName
	 */
	public String getKeyspaceName() {
		return keyspaceName;
	}

	/**
	 * @param keyspaceName the keyspaceName to set
	 */
	public void setKeyspaceName(String keyspaceName) {
		this.keyspaceName = keyspaceName;
	}

	/**
	 * @param clusterName the clusterName to set
	 */
	public void setClusterName(String clusterName) {
		this.clusterName = clusterName;
	}

	/**
	 * @param host the host to set
	 */
	public void setHost(String host) {
		this.host = host;
	}

	/**
	 * @param port the port to set
	 */
	public void setPort(Integer port) {
		this.port = port;
	}

	public static void main(String... strings) {
		/*CassandraDriver client = new CassandraDriver();
		client.connect("172.25.250.165", 9160);
		try {
			client.createKeySpaceUsingCql("HelloWorld", 1,
					NetworkTopologyStrategy.class.getName());
		} catch (Exception e) {
			logger.error("An error occured while creating Keyspace:"+e.getMessage());
		}

		try {
			client.selectKeySpace("HelloWorld");
		} catch (Exception e) {
			logger.error("An error occured while selecting Keyspace:"+e.getMessage());
		}

		Serializer<String> serializer = StringSerializer.get();
		try {
			client.queryKeySpace(
					"create columnfamily hello (key varchar primary key)  with comparator = UTF8Type",
					serializer, serializer, serializer);
		} catch (Exception e) {
			logger.error("An error occured while creating columnfamily:"+e.getMessage());
		}

		client.queryKeySpace(
				"create keyspace TestKS WITH replication_factor = '1' AND strategy_class = 'NetworkTopologyStrategy'",
				serializer, serializer, serializer);

		client.disconnect();*/
	}

	public void disconnect() {
		if(client != null && transport != null && transport.isOpen()){
			transport.close();
		}
	}

	public void connect(String host, Integer port) {
		try {
			createThriftAndNonThriftConnections(host, port);
		} catch (TTransportException e) {
			logger.error("An error occured in connection:"+e.getMessage());
		}
	}
	
	@PostConstruct
	public void initClient() throws Exception{
		connect(host, port);
		selectKeyspace(keyspaceName);
	}
	
	private void createThriftAndNonThriftConnections(String host, Integer port) throws TTransportException{
		this.host = host;
		this.port = port;

		connected = Boolean.TRUE;
		
		
		transport = new TFramedTransport(new TSocket(host, port));
		TProtocol proto = new TBinaryProtocol(transport);
		transport.open();
		client = new Cassandra.Client(proto);	
	}

	
	private void selectKeyspace(String keyspaceName) throws Exception{
		client.set_keyspace(keyspaceName);
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
			logger.error("An error occured in connection:"+e.getMessage());
		} catch (TException e) {
			logger.error("An error occured while describing Keyspace:"+e.getMessage());
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
			logger.error("An error occured in Connection:"+e.getMessage());
		} catch (TException e) {
			logger.error("An error occured while describing Keyspace:"+e.getMessage());
		} catch (NotFoundException e) {
			logger.error("An error occured while getting columnfamilies:"+e.getMessage());
		}
		return null;
	}

	public ColumnFamily getColumnFamilyDefinition(String keyspaceName, String cfName) {
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
				family.setDefaultValidationClass(selectedCfDef.getDefault_validation_class());
				family.setKeySpaceName(selectedCfDef.getKeyspace());
				family.setKeyValidationClass(selectedCfDef.getKey_validation_class());
				family.setSubComparatorType(selectedCfDef.getSubcomparator_type());
			}
			return family;
		} catch (InvalidRequestException e) {
			logger.error("An error occured in connection:"+e.getMessage());
		} catch (TException e) {
			logger.error("An error occured while describing Keyspace:"+e.getMessage());
		} catch (NotFoundException e) {
			logger.error("An error occured while getting columnfamilies:"+e.getMessage());
		}
		return null;
	}

	public List<CassandraColumn> getColumnDefinitions(String keyspaceName, String cfName) {
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
			logger.error("An error occured in connection:"+e.getMessage());
		} catch (TException e) {
			logger.error("An error occured while describing Keyspace:"+e.getMessage());
		} catch (NotFoundException e) {
			logger.error("An error occured while getting columnfamilies:"+e.getMessage());
		}
		return null;
	}

	public HashMap<byte[], HashMap<byte[], Object>> getData(String keyspace, String column_family, byte[] rowKey) {
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
			List<KeySlice> slices = client.get_range_slices(new ColumnParent(column_family), sp, kr, ConsistencyLevel.ONE);
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
			logger.error("An error occured in connection:"+e.getMessage());
		} catch (TException e) {
			logger.error("An error occured while setting keyspace:"+e.getMessage());
		} catch (UnavailableException e) {
			logger.error("An error occured while getting range slice:"+e.getMessage());
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
			logger.error("An error occured in connection:"+e.getMessage());
		} catch (TException e) {
			logger.error("An error occured while setting keyspace:"+e.getMessage());
		} catch (UnavailableException e) {
			logger.error("An error occured while getting range slice:"+e.getMessage());
		} catch (TimedOutException e) {
			System.out.println(e);
		}

		return null;
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

	/* (non-Javadoc)
	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "CassandraClient [clusterName=" + clusterName + ", host=" + host
				+ ", port=" + port + ", connected=" + connected + "]";
	}

}
