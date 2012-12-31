package com.hin.hl7messaging;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;

import javax.xml.xpath.XPathConstants;

import org.apache.cassandra.thrift.InvalidRequestException;
import org.apache.cassandra.thrift.SchemaDisagreementException;
import org.apache.thrift.TException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.hin.domain.config.HL7MessageConfiguration;
import com.hin.domain.vo.ArchiveIndexFieldsVO;
import com.hin.domain.vo.MessageVO;
import com.hin.hl7messaging.api.IArchiveMessageService;
import com.hin.hl7messaging.api.IStatisticsService;
import com.hin.hl7messaging.cassandra.CassandraClient;
import com.hin.hl7messaging.cassandra.CassandraConnector;
import com.hin.hl7messaging.utils.XMLHelper;
import com.thoughtworks.xstream.XStream;

@Service(value = "ArchiveMessageService")
public class ArchiveMessageService implements IArchiveMessageService{
	
	@Value("${messageConfig.dirPath}")
	private String messageConfigDirPath;
	
/*	@Autowired
	private CassandraClient client;*/
	
	@Autowired
	private CassandraConnector cassandraConnector;
	
	private HL7MessageConfiguration messageConfiguration;
	
	private XStream streamSerializer;
	
	@Autowired
	IStatisticsService statisticsService;
	
	public ArchiveMessageService() {
		super();
		streamSerializer = new XStream();
	}
	
	public void archiveMessage(MessageVO messageVO,String programName) throws Exception{
		String rowKey = "";
		String messageXML=messageVO.getMessage();
		streamSerializer.processAnnotations(HL7MessageConfiguration.class);
		Document messageDocument = XMLHelper.getXMLDocument(messageXML);
		
		File configureFile = getConfigurationMessage(messageXML);
		
		createColumnFamily(configureFile,messageVO.getOrganizationId());
		
		List<ArchiveIndexFieldsVO> indexFields = getArchiveIndexFields(messageDocument,configureFile);
		
		Iterator<ArchiveIndexFieldsVO> iterator = indexFields.iterator();
		while (iterator.hasNext()) {
			ArchiveIndexFieldsVO indexFieldsVO = iterator.next();
			if (indexFieldsVO.getType().equals("ROWKEY")) {
				rowKey = indexFieldsVO.getValue();
			}
		}
		saveArchiveMessage(rowKey,messageVO,indexFields);
	}
	
	//CREATE COLUMN FAMILY IF NOT EXISTS
	private void createColumnFamily(File configureFile,String organizationId) throws InvalidRequestException, SchemaDisagreementException, TException,Exception{
		boolean flag;
		messageConfiguration = (HL7MessageConfiguration) streamSerializer.fromXML(configureFile);
		flag = cassandraConnector.checkcolumnFamily(messageConfiguration.getMetaInfo().getArtifactID(),organizationId);
		if(flag){
			cassandraConnector.createColumnFamily(messageConfiguration.getMetaInfo().getArtifactID(),organizationId);
		}
	}
	
	private File getConfigurationMessage(String messageXML){
		Document messageDocument = XMLHelper.getXMLDocument(messageXML);
		String documentType = messageDocument.getDocumentElement().getAttribute("config");
		File configureFile = new File(messageConfigDirPath + File.separator	+ documentType + ".xml");
		return configureFile;
	}
	
	//FETCH FIELDS FROM MESSAGE TO BE INDEX IN LUCENE
	private List<ArchiveIndexFieldsVO> getArchiveIndexFields(Document messageDocument,File configureFile){
		Document configureDocument = XMLHelper.getXMLDocument(configureFile);
		List<ArchiveIndexFieldsVO> indexFields = new ArrayList<ArchiveIndexFieldsVO>();
		NodeList indexNodeList = (NodeList) XMLHelper.read(configureDocument,"//HL7MessageConfiguration/ArchiveConfiguration/Field",XPathConstants.NODESET);
		for (int i = 0; i < indexNodeList.getLength(); i++) {
			Node node = indexNodeList.item(i);
			Element element = (Element) node;
			String name = element.getAttribute("name");
			String indexed = element.getAttribute("indexed");
			String type = element.getAttribute("type");
			String value = (String) XMLHelper.read(messageDocument,	element.getAttribute("xpath"), XPathConstants.STRING);
			indexFields.add(new ArchiveIndexFieldsVO(name, indexed, "", value, type));
		}
		return indexFields;
	}
	
	//SAVE ARCHIVE MESSAGE IN CASSANDRA
	private void saveArchiveMessage(String rowKey, MessageVO messageVO,List<ArchiveIndexFieldsVO> indexFields) throws Exception{
		String messageXML=messageVO.getMessage();
		HashMap<String, String> columnValueMap = new HashMap<String, String>();
		String messageId = "",responsiblePartyName = "",program = "";
		columnValueMap.put("ROWKEY", rowKey);
		columnValueMap.put("MESSAGE", messageXML);
		Iterator<ArchiveIndexFieldsVO> iterator = indexFields.iterator();
		while (iterator.hasNext()) {
			ArchiveIndexFieldsVO indexFieldsVO = iterator.next();
			if(indexFieldsVO.getName().equals("program"))
				{
					program=indexFieldsVO.getValue();
				}
			else if(indexFieldsVO.getName().equals("responsiblePartyName")){
				responsiblePartyName = indexFieldsVO.getValue(); 
			}
			columnValueMap.put(indexFieldsVO.getName(), indexFieldsVO.getValue());
		}
		cassandraConnector.saveStandardColumnFamily(columnValueMap, messageConfiguration.getMetaInfo().getArtifactID(),messageVO.getOrganizationId());
		statisticsService.insertIntoIndex(messageXML,rowKey,program,responsiblePartyName);
	}
}
