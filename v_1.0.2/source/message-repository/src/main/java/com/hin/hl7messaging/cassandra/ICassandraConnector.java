package com.hin.hl7messaging.cassandra;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.cassandra.thrift.InvalidRequestException;
import org.apache.cassandra.thrift.SchemaDisagreementException;
import org.apache.thrift.TException;

import me.prettyprint.hector.api.Serializer;

public interface ICassandraConnector {
	
	public Boolean isConnectionAvailableForOrganization(String organizationId) throws Exception;
	
	public void createNewConnectionForOrganization(String organizationId,CassandaraConnection cassandaraConnection) throws Exception;
	
	public CassandaraConnection setDefaultConnectionParameter(CassandaraConnection cassandaraConnection);

	/************************************************** Reading data from cassandra ******************************************************************************************************/
	public <RK, K, V> Map<RK, HashMap<K, V>> queryKeySpace(String query,
			Serializer<RK> rowKeySerializer, Serializer<K> keySerializer,
			Serializer<V> valueSerializer, String organizationId);

	public String getColumnValue(String columnFamily, String rowKey,
			String column, String organizationId);

	public Map<String, HashMap<String, String>> retrieveStandardColumnFamilyForCondition(
			String columnFamily, String condition, String organizationId);

	public Map<String, HashMap<String, String>> retrieveStandardColumnFamily(
			String columnFamily, HashMap<String, String> condtitionMap,
			String OrganizationId);

	public Map<String, HashMap<String, String>> retrieveStandardColumnFamily(
			String columnFamily, String key, String organizationId);
	
	public Map<String, HashMap<String, String>> retrieveStandardColumnFamily(
			String columnFamily, String columnName, String columnValue,String organizationId) ;

	/************************************************** Saving data to cassandra ******************************************************************************************************/

	public <K, V> void saveStandardColumnFamily(HashMap<K, V> columnValueMap,
			String columnFamily, String organizationId);

	/************************************************************* Utility methods ************************************************************************************************************************************/
	public List<String> getColumnValue(
			Map<String, HashMap<String, String>> resultMap, String column);

	public HashMap<String, List<String>> getColumnValues(List<String> column,
			Map.Entry mapEntry);
	
	public  List<String> getKeys(
			Map.Entry mapEntry) ;

	/************************************************** Creating new column family in cassandra **********************************************************************************************************/
	public void createMessageTypeStore(String columnFamilyName,
			String organizationId) throws Exception, InvalidRequestException,
			SchemaDisagreementException, TException;

	public void createColumnFamily(String columnFamilyName, String OrganizationId)
			throws Exception, InvalidRequestException,
			SchemaDisagreementException, TException;
}
