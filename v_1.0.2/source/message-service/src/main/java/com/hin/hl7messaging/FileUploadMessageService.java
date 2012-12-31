/**
 * 
 */
package com.hin.hl7messaging;


import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathConstants;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import com.hin.domain.vo.FileUploadMessageVO;
import com.hin.hl7.messaging.api.IIdentityRepository;
import com.hin.hl7messaging.api.IFileUploadMessageService;
import com.hin.hl7messaging.cassandra.CassandraConnector;
import com.hin.hl7messaging.configuration.generator.XMLHelper;

/**
 * @author thanveer.aqthar
 * 
 */
@Service(value = "fileUploadMessageService")
public class FileUploadMessageService implements IFileUploadMessageService {
	/*Function for creating File Upload Message*/
	
/*	@Resource(name = "identityMessageRepository")
	private IIdentityRepository identityRepository;*/
	
	@Autowired
	private CassandraConnector cassandraConnector;
	
	@Override
	public String createFileUploadMessage(
			FileUploadMessageVO fileUploadMessageVO, String messageId,
			String patientId, String effectiveDate, String fileExtension) {
		// TODO Auto-generated method stub
		// creating RootElement

		String createdMessage = "";
		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
		DocumentBuilder db = null;
		try {
			db = dbf.newDocumentBuilder();
		} catch (ParserConfigurationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		Document document = db.newDocument();
		Document documentFull = createElement(document, messageId,
				fileUploadMessageVO, patientId, effectiveDate, fileExtension);
		createdMessage = XMLHelper.getXMLDocumentAsString(documentFull);
		return createdMessage;
		/* System.out.println(XMLHelper.getXMLDocumentAsString(documentFull)); */
	}

	public Document createElement(Document document, String messageId,
			FileUploadMessageVO fileUploadMessageVO, String patientId,
			String effectiveDate, String fileExtension) {

		Element rootElement = document.createElement("message");
		rootElement.setAttribute("config", "POCD_MT000040UV_FileAttachment");
		Element POCD_MT000040UV_FileAttachment = document
				.createElement("POCD_MT000040UV_FileAttachment");

		rootElement.appendChild(POCD_MT000040UV_FileAttachment);
		Element id = document.createElement("id");

		Element root = document.createElement("root");
		root.setTextContent("HIN_MSG_ID");
		id.appendChild(root);
		
		Element extension = document.createElement("extension");
		extension.setTextContent(messageId);
		id.appendChild(extension);

		POCD_MT000040UV_FileAttachment.appendChild(id);
		
		//ID FOR FORM_NAME
		Element idFormName = document.createElement("id");

		Element rootFormName = document.createElement("root");
		rootFormName.setTextContent("FORM_NAME");
		idFormName.appendChild(rootFormName);
		
		Element extensionFormName = document.createElement("extension");
		extensionFormName.setTextContent(fileUploadMessageVO.getFormName());
		idFormName.appendChild(extensionFormName);
		POCD_MT000040UV_FileAttachment.appendChild(idFormName);
		
		//ID FOR DOCUMENT_TYPE
		Element idDocumentType = document.createElement("id");

		Element rootDocumentType = document.createElement("root");
		rootDocumentType.setTextContent("DOCUMENT_TYPE");
		idDocumentType.appendChild(rootDocumentType);
		
		Element extensionDocumentType = document.createElement("extension");
		extensionDocumentType.setTextContent(fileUploadMessageVO.getDocumentType());
		idDocumentType.appendChild(extensionDocumentType);
		POCD_MT000040UV_FileAttachment.appendChild(idDocumentType);
		
		
		Element title = document.createElement("title");
		Element value = document.createElement("value");
		value.setTextContent(fileUploadMessageVO.getFileName());
		title.appendChild(value);
		POCD_MT000040UV_FileAttachment.appendChild(title);
		Element effectiveTime = document.createElement("effectiveTime");

		Element timeValue = document.createElement("value");
		timeValue.setTextContent(effectiveDate);
		effectiveTime.appendChild(timeValue);

		POCD_MT000040UV_FileAttachment.appendChild(effectiveTime);
		Element recordTarget = document.createElement("recordTarget");
		POCD_MT000040UV_FileAttachment.appendChild(recordTarget);
		Element patientRole = document.createElement("patientRole");
		POCD_MT000040UV_FileAttachment.appendChild(recordTarget);
		Element patient = document.createElement("patient");
		patientRole.appendChild(patient);
		Element subscriberId = document.createElement("id");

		Element patientRoot = document.createElement("root");
		patientRoot.setTextContent("SUBSCRIBER_ID");
		subscriberId.appendChild(patientRoot);

		Element patientExtension = document.createElement("extension");
		patientExtension.setTextContent(patientId);
		subscriberId.appendChild(patientExtension);

		subscriberId.appendChild(patientRoot);
		patient.appendChild(subscriberId);
		Element patientName = document.createElement("name");
		patient.appendChild(patientName);

		Element mainComponent = document.createElement("component");
		POCD_MT000040UV_FileAttachment.appendChild(mainComponent);
		Element structuredBody = document.createElement("structuredBody");
		mainComponent.appendChild(structuredBody);
		Element component = document.createElement("component");
		structuredBody.appendChild(component);

		Element section = document.createElement("section");
		component.appendChild(section);

		Element text = document.createElement("text");
		section.appendChild(text);

		Element mediaType = document.createElement("mediaType");
		mediaType.setTextContent(fileUploadMessageVO.getFileType());
		text.appendChild(mediaType);

		Element language = document.createElement("language");
		language.setTextContent(fileExtension);
		text.appendChild(language);

		recordTarget.appendChild(patientRole);
		document.appendChild(rootElement);
		System.out.println(document);
		return document;
	}
	
	public FileUploadMessageVO createMessageVO(String messageXml){
		FileUploadMessageVO fileUploadMessageVO = new FileUploadMessageVO();
		
		Document document = XMLHelper.getXMLDocument(messageXml);
		System.out.println(document);
		String contentType = (String) XMLHelper.read(document,
				   "//component/structuredBody/component/section/text/mediaType", XPathConstants.STRING);
		String fileExtension = (String) XMLHelper.read(document,
				   "//component/structuredBody/component/section/text/language", XPathConstants.STRING);
		String patientId = (String) XMLHelper.read(document,
				   "//recordTarget/patientRole/patient/id[root='SUBSCRIBER_ID']/extension", XPathConstants.STRING);
		fileUploadMessageVO.setFileType(contentType);
		fileUploadMessageVO.setFileExtension(fileExtension);
		fileUploadMessageVO.setPatientId(patientId);
		return fileUploadMessageVO;	
	}

	public String getFileUploadMessage(String messageId,String organizationId){
		String message = "";
		Map<String, HashMap<String, String>> resultMap = cassandraConnector.retrieveStandardColumnFamily("POCD_MT000040UV_FileAttachment", messageId,organizationId);
		
		if(!(resultMap.isEmpty()) || resultMap != null){
			message = cassandraConnector.getColumnValue("POCD_MT000040UV_FileAttachment", messageId, "MESSAGE",organizationId);
		}
		
		return message;
	}
}
