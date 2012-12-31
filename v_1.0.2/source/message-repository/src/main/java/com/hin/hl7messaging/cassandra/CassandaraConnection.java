package com.hin.hl7messaging.cassandra;

import org.apache.cassandra.thrift.Cassandra;
import org.apache.thrift.transport.TTransport;

import me.prettyprint.hector.api.Cluster;
import me.prettyprint.hector.api.Keyspace;

public class CassandaraConnection {
	
	private String clusterName;
	private String host;
	private Integer port;
	private Boolean isThrift;
	private String keyspaceName;
	private Keyspace keyspace;
	private Cluster cluster;
	private TTransport transport;
	private Cassandra.Client client;
	private String strategeyClass;
	private Integer replicationFactor;
	/**
	 * @return the clusterName
	 */
	public String getClusterName() {
		return clusterName;
	}
	/**
	 * @param clusterName the clusterName to set
	 */
	public void setClusterName(String clusterName) {
		this.clusterName = clusterName;
	}
	/**
	 * @return the host
	 */
	public String getHost() {
		return host;
	}
	/**
	 * @param host the host to set
	 */
	public void setHost(String host) {
		this.host = host;
	}
	/**
	 * @return the port
	 */
	public Integer getPort() {
		return port;
	}
	/**
	 * @param port the port to set
	 */
	public void setPort(Integer port) {
		this.port = port;
	}
	/**
	 * @return the isThrift
	 */
	public Boolean getIsThrift() {
		return isThrift;
	}
	/**
	 * @param isThrift the isThrift to set
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
	 * @param keyspaceName the keyspaceName to set
	 */
	public void setKeyspaceName(String keyspaceName) {
		this.keyspaceName = keyspaceName;
	}
	/**
	 * @return the keyspace
	 */
	public Keyspace getKeyspace() {
		return keyspace;
	}
	/**
	 * @param keyspace the keyspace to set
	 */
	public void setKeyspace(Keyspace keyspace) {
		this.keyspace = keyspace;
	}
	/**
	 * @return the cluster
	 */
	public Cluster getCluster() {
		return cluster;
	}
	/**
	 * @param cluster the cluster to set
	 */
	public void setCluster(Cluster cluster) {
		this.cluster = cluster;
	}
	/**
	 * @return the transport
	 */
	public TTransport getTransport() {
		return transport;
	}
	/**
	 * @param transport the transport to set
	 */
	public void setTransport(TTransport transport) {
		this.transport = transport;
	}
	/**
	 * @return the client
	 */
	public Cassandra.Client getClient() {
		return client;
	}
	/**
	 * @param client the client to set
	 */
	public void setClient(Cassandra.Client client) {
		this.client = client;
	}
	/**
	 * @return the strategeyClass
	 */
	public String getStrategeyClass() {
		return strategeyClass;
	}
	/**
	 * @param strategeyClass the strategeyClass to set
	 */
	public void setStrategeyClass(String strategeyClass) {
		this.strategeyClass = strategeyClass;
	}
	/**
	 * @return the replicationFactor
	 */
	public Integer getReplicationFactor() {
		return replicationFactor;
	}
	/**
	 * @param replicationFactor the replicationFactor to set
	 */
	public void setReplicationFactor(Integer replicationFactor) {
		this.replicationFactor = replicationFactor;
	}
	
	
	
	
}
