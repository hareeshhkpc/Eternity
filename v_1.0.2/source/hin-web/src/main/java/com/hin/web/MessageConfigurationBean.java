/**
 * 
 */
package com.hin.web;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.richfaces.event.FileUploadEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.xml.sax.InputSource;

import com.hin.domain.MessageType;
import com.hin.domain.vo.IndexFieldsVO;
import com.hin.service.impl.MessageConfigurationService;
import com.hin.web.base.BaseBean;

/**
 * @author krishna.lr
 * 
 */
@Component("messageConfigurationBean")
@Scope("session")
public class MessageConfigurationBean extends BaseBean {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Autowired
	MessageConfigurationService messageConfigurationService;

	private List<MessageType> messageTypes = new ArrayList<MessageType>();
	private MessageType messageType = new MessageType();
	private List<IndexFieldsVO> indexFieldsVOs = new ArrayList<IndexFieldsVO>();
	private IndexFieldsVO indexFieldsVO = new IndexFieldsVO();
	private Document document = null;
	private boolean newMessageType = true;
	private boolean newIndexField = true;
	private String organizationId = "HINORG";

	public String viewMessageTypes() {
		List<MessageType> messageTypes = messageConfigurationService
				.fetchMessageTypes(organizationId);
		this.setMessageTypes(messageTypes);
		return "viewMessageTypes";
	}

	public String viewMessageType() {
		this.newMessageType = false;
		return "viewMessageType";
	}

	public String createNewMessageType(){
		this.messageType = new MessageType();
		this.newMessageType = true;
		return "viewMessageType";
	}
	
	public String viewIndexField() {
		return "viewIndexField";
	}

	public void fileUploaded(FileUploadEvent event) {
		try {
			InputStream inputStream = event.getUploadedFile().getInputStream();
			DocumentBuilderFactory factory = null;
			DocumentBuilder builder = null;
			Document document = null;

			factory = DocumentBuilderFactory.newInstance();
			builder = factory.newDocumentBuilder();
			document = builder.parse(new InputSource(inputStream));
			this.messageType = messageConfigurationService
					.extractFieldsFromDocument(document);
			this.newMessageType = false;
		} catch (Exception e) {
		}
	}

	public String addToIndexFieldsList(){
		addToMessageType(this.indexFieldsVO,this.messageType);
		return "viewMessageType";
	}
	
	public void addToMessageType(IndexFieldsVO indexFieldsVO,MessageType messageType ){
		if(indexFieldsVO.getId() != null && indexFieldsVO.getId().length() > 0){
			
		}else{
			int id = messageType.getIndexFieldsVOs().size()+1;
			indexFieldsVO.setId(messageType.getId()+ "_" + indexFieldsVO.getName()+"_"+id);
		}
	}
	
	public String saveMessageType(){
		messageConfigurationService.saveMessageType(this.messageType,organizationId);
		List<MessageType> messageTypes = messageConfigurationService
				.fetchMessageTypes("HINORG");
		this.setMessageTypes(messageTypes);
		return "viewMessageTypes";
	}
	
	public List<MessageType> getMessageTypes() {
		return messageTypes;
	}

	public void setMessageTypes(List<MessageType> messageTypes) {
		this.messageTypes = messageTypes;
	}

	public MessageType getMessageType() {
		return messageType;
	}

	public void setMessageType(MessageType messageType) {
		this.messageType = messageType;
	}

	public List<IndexFieldsVO> getIndexFieldsVOs() {
		return indexFieldsVOs;
	}

	public void setIndexFieldsVOs(List<IndexFieldsVO> indexFieldsVOs) {
		this.indexFieldsVOs = indexFieldsVOs;
	}

	public IndexFieldsVO getIndexFieldsVO() {
		return indexFieldsVO;
	}

	public void setIndexFieldsVO(IndexFieldsVO indexFieldsVO) {
		this.indexFieldsVO = indexFieldsVO;
	}

	public Document getDocument() {
		return document;
	}

	public void setDocument(Document document) {
		this.document = document;
	}

	public boolean isNewMessageType() {
		return newMessageType;
	}

	public void setNewMessageType(boolean newMessageType) {
		this.newMessageType = newMessageType;
	}

	public boolean isNewIndexField() {
		return newIndexField;
	}

	public void setNewIndexField(boolean newIndexField) {
		this.newIndexField = newIndexField;
	}
}
