/**
 * 
 */
package com.hin.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.xpath.XPathConstants;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.hin.domain.MessageType;
import com.hin.domain.vo.IndexFieldsVO;
import com.hin.hl7messaging.cassandra.CassandraConnector;
import com.hin.hl7messaging.utils.XMLHelper;
import com.hin.service.IMessageConfigurationService;

/**
 * @author krishna.lr
 * 
 */
@Service(value = "messageConfigurationService")
public class MessageConfigurationService implements
		IMessageConfigurationService {
	@Autowired
	private CassandraConnector cassandraConnector;

	@Override
	public List<MessageType> fetchMessageTypes(String organizationId) {
		String columnFamily = "MESSAGE_CONFIGURATION";
		List<MessageType> messageTypes = new ArrayList<MessageType>();
		Map<String, HashMap<String, String>> maps = cassandraConnector.retrieveStandardColumnFamily(columnFamily, "",organizationId);
		String messageXMl = null;
		if(maps != null && maps.size() > 0){
			for(Map.Entry<String, HashMap<String, String>> entry : maps.entrySet()){
				MessageType messageType = new MessageType();
				for(Map.Entry<String, String> stateEntry : entry.getValue().entrySet()){
					if(stateEntry.getKey().equals("KEY")){
						continue;
					}else if(stateEntry.getKey().equals("MESSAGE")){
						messageXMl = stateEntry.getValue();
					}
				}
				Document document = XMLHelper.getXMLDocument(messageXMl);
				messageType = extractFieldsFromDocument(document);
				messageTypes.add(messageType);
			}
		}
		return messageTypes;
	}

	@Override
	public void saveMessageType(MessageType messageType,String organizationId) {
		String columnFamily = "MESSAGE_CONFIGURATION";
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("ROWKEY", messageType.getType());
		map.put("TYPE", messageType.getType());
		map.put("TITLE", messageType.getTitle());
		map.put("MESSAGE", updateXMLConfigurationFile(messageType));
		map.put("INDEXFOLDER", messageType.getIndexFolder());
		cassandraConnector.saveStandardColumnFamily(map, columnFamily,organizationId);
	}

	@Override
	public MessageType extractFieldsFromDocument(Document configureDocument) {
		MessageType messageType = new MessageType();
		List<IndexFieldsVO> indexFields = new ArrayList<IndexFieldsVO>();
		String messageXML = XMLHelper.getXMLDocumentAsString(configureDocument);
		NodeList indexNodeList = (NodeList) XMLHelper.read(configureDocument,
				"//HL7MessageConfiguration/IndexConfiguration/Field",
				XPathConstants.NODESET);

		for (int i = 0; i < indexNodeList.getLength(); i++) {
			IndexFieldsVO indexFieldsVO = new IndexFieldsVO();
			Node node = indexNodeList.item(i);
			Element element = (Element) node;
			indexFieldsVO.setName(element.getAttribute("name"));
			indexFieldsVO.setAnalyzed(element.getAttribute("analyzed"));
			indexFieldsVO.setIndexed(element.getAttribute("indexed"));
			indexFieldsVO.setType(element.getAttribute("type"));
			indexFieldsVO.setXpath(element.getAttribute("xpath"));
			indexFields.add(indexFieldsVO);
		}
		messageType.setIndexFieldsVOs(indexFields);

		indexNodeList = (NodeList) XMLHelper.read(configureDocument,
				"//HL7MessageConfiguration/IndexConfiguration",
				XPathConstants.NODESET);
		String indexFolder = "";
		for (int i = 0; i < indexNodeList.getLength(); i++) {
			Node node = indexNodeList.item(i);
			Element element = (Element) node;
			indexFolder = element.getAttribute("indexName");
		}
		messageType.setIndexFolder(indexFolder);

		NodeList metaInfoNodeList = (NodeList) XMLHelper.read(
				configureDocument, "//HL7MessageConfiguration/MetaInfo",
				XPathConstants.NODESET);
		String artifactId = "";
		for (int i = 0; i < metaInfoNodeList.getLength(); i++) {
			Node node = metaInfoNodeList.item(i);
			Element element = (Element) node;
			artifactId = element.getAttribute("artifactID");
		}
		messageType.setType(artifactId);
		messageType.setConfigurationMessage(messageXML);
		return messageType;
	}

	private String updateXMLConfigurationFile(MessageType messageType) {
		String messageXml = messageType.getConfigurationMessage();
		Document document = XMLHelper.getXMLDocument(messageXml);
		Element element = document.getDocumentElement();
		Element oldNode = (Element) element.getElementsByTagName("IndexConfiguration").item(0);
		Element upDatedNode  = removeChildNodes(oldNode);
		upDatedNode = updateChildNodesForIndexConfiguration(upDatedNode,messageType.getIndexFieldsVOs(),document);
		upDatedNode.setAttribute("indexName", messageType.getIndexFolder());
		element.replaceChild(oldNode, upDatedNode);
		messageXml = XMLHelper.getXMLDocumentAsString(document);
		System.out.println(messageXml);
		return messageXml;
	}

	private Element removeChildNodes(Element parentNode){
		while(parentNode.hasChildNodes()){
			parentNode.removeChild(parentNode.getFirstChild());
		}
		return parentNode;
	}
	
	private Element updateChildNodesForIndexConfiguration(Element node,List<IndexFieldsVO> indexFieldsVOs,Document document){
		for(IndexFieldsVO indexFieldsVO:indexFieldsVOs){
			Element childElement = document.createElement("Field");
			childElement.setAttribute("name", indexFieldsVO.getName());
			childElement.setAttribute("indexed", indexFieldsVO.getIndexed());
			childElement.setAttribute("analyzed", indexFieldsVO.getAnalyzed());
			childElement.setAttribute("type", indexFieldsVO.getType());
			childElement.setAttribute("xpath", indexFieldsVO.getXpath());
			node.appendChild(childElement);
		}
		return node;
	}


	
	
}
