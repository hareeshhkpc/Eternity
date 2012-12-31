package com.hin.hl7messaging;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;



import org.apache.cassandra.thrift.InvalidRequestException;
import org.apache.cassandra.thrift.SchemaDisagreementException;
import org.apache.thrift.TException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hin.domain.vo.MessageVO;
import com.hin.hl7messaging.api.IOrganizationService;
import com.hin.hl7messaging.cassandra.CassandaraConnection;
import com.hin.hl7messaging.cassandra.ICassandraConnector;


@Service(value = "organizationService")
public class OrganizationService implements IOrganizationService {
	@Autowired
	private ICassandraConnector cassandraConnector;

	// @Value("${cassandra.masterKeySpace}")
	private String masterKeySpace = "HINORG";

	private void updateOrganizationListInMasterKeyspace(MessageVO messageVO) {
		HashMap<String, String> columnValueMap = new HashMap<String, String>();
		columnValueMap.put("ROWKEY", messageVO.getId());
		columnValueMap.put("CLUSTERNAME", messageVO.getMessage());
		columnValueMap.put("HOST", messageVO.getName());
		columnValueMap.put("ISTHRIFT", messageVO.getPassword());
		columnValueMap.put("KEYSPACENAME", messageVO.getPassword());
		columnValueMap.put("PORT", messageVO.getPassword());
		cassandraConnector.saveStandardColumnFamily(columnValueMap,
				"ORGANIZATION_LIST", masterKeySpace);
	}

	public void createOrganizationKeySpace(MessageVO messageVO)
			throws Exception {
		if (!cassandraConnector.isConnectionAvailableForOrganization(messageVO
				.getSubscriberId())) {
			CassandaraConnection cassandaraConnection = new CassandaraConnection();
			cassandraConnector
					.setDefaultConnectionParameter(cassandaraConnection);
			cassandaraConnection.setKeyspaceName(messageVO
					.getOrganizationName());
			cassandaraConnection.setReplicationFactor(1);
			cassandaraConnection.setStrategeyClass("SimpleStrategy");
			cassandraConnector.createNewConnectionForOrganization(
					messageVO.getSubscriberId(), cassandaraConnection);
			createDefaultColumnFamily(messageVO);
		}
	}

	private void createDefaultColumnFamily(MessageVO messageVO)
			throws InvalidRequestException, SchemaDisagreementException,
			TException, Exception {
		Map<String, HashMap<String, String>> resultMessageMap = cassandraConnector
				.retrieveStandardColumnFamily("DEFAULT_VALUE", "COLUMNFAMILY",
						masterKeySpace);
		List<String> columnFamilyList = new ArrayList<String>();
		Iterator iterator = resultMessageMap.entrySet().iterator();
		while (iterator.hasNext()) {
			Map.Entry mapEntry = (Map.Entry) iterator.next();
			columnFamilyList = cassandraConnector.getKeys(mapEntry);
			for (String columnFamilyName : columnFamilyList) {
				if (!columnFamilyName.equals("KEY") && columnFamilyName != null
						&& columnFamilyName.length() > 1) {
					cassandraConnector.createColumnFamily(columnFamilyName,
							messageVO.getSubscriberId());
				}
			}
		}
	}
}
