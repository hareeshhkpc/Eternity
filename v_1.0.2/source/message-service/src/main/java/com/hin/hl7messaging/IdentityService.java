package com.hin.hl7messaging;

import java.util.HashMap;

import javax.xml.xpath.XPathConstants;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.w3c.dom.Document;

import com.hin.domain.vo.MessageVO;
import com.hin.hl7messaging.api.IIdentityService;
import com.hin.hl7messaging.cassandra.CassandraConnector;
import com.hin.hl7messaging.utils.XMLHelper;

@Repository(value = "identityService")
public class IdentityService implements IIdentityService{

	@Autowired
	private CassandraConnector cassandraConnector;
	
	@Override
	public void createRoleDefinition(MessageVO messageVO) {
		// TODO Auto-generated method stub
		HashMap<String, Object> roleDefinitionIndexMap = new HashMap<String, Object>();
		String messageXML = messageVO.getMessage();
		Document messageDocument = XMLHelper.getXMLDocument(messageXML);
		String roleName = (String) XMLHelper.read(messageDocument,
				"//message/ROLE_DEFINITION/roleName/thumbnail",
				XPathConstants.STRING);
		roleDefinitionIndexMap.put("ROWKEY", roleName);
		roleDefinitionIndexMap.put("ROLE_NAME", roleName);
		cassandraConnector.saveStandardColumnFamily(roleDefinitionIndexMap,
				"ROLE_DEFINITION1",messageVO.getOrganizationId());
	}

	@Override
	public void createSubscriber(MessageVO messageVO) {
		// TODO Auto-generated method stub
		HashMap<String, String> columnValueMap = new HashMap<String, String>();
		columnValueMap.put("ROWKEY", messageVO.getId());
		columnValueMap.put("MESSAGE", messageVO.getMessage());
		columnValueMap.put("USERNAME", messageVO.getName());
		columnValueMap.put("PASSWORD",  messageVO.getPassword());
		cassandraConnector.saveStandardColumnFamily(columnValueMap, "SUBSCRIBER_PROFILE",messageVO.getOrganizationId());
	}

}
