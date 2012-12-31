package com.hin.domain;

import java.util.ArrayList;
import java.util.List;

import com.hin.domain.core.BaseDomain;
import com.hin.domain.vo.IndexFieldsVO;

public class MessageType extends BaseDomain {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	public String state;
	public String type;
	public String typeName;
	public String formHtml;
	public String title;
	public String queryString;
	public String category;
	public String msgTypeOrder;
	public String transactionType;
	public String indexFolder;
	public boolean finished;
	public String configurationMessage;
	public List<IndexFieldsVO> indexFieldsVOs = new ArrayList<IndexFieldsVO>();
	
	
	public List<IndexFieldsVO> getIndexFieldsVOs() {
		return indexFieldsVOs;
	}

	public void setIndexFieldsVOs(List<IndexFieldsVO> indexFieldsVOs) {
		this.indexFieldsVOs = indexFieldsVOs;
	}

	public List<Message> messages = new ArrayList<Message>();

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public List<Message> getMessages() {
		return messages;
	}

	public void setMessages(List<Message> messages) {
		this.messages = messages;
	}

	public void addMessage(Message message) {
		// this.messages.add(message);
	}

	/**
	 * @return the typeName
	 */
	public String getTypeName() {
		return typeName;
	}

	/**
	 * @param typeName
	 *            the typeName to set
	 */
	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}

	/**
	 * @return the formHtml
	 */
	public String getFormHtml() {
		return formHtml;
	}

	/**
	 * @param formHtml
	 *            the formHtml to set
	 */
	public void setFormHtml(String formHtml) {
		this.formHtml = formHtml;
	}

	/**
	 * @return the title
	 */
	public String getTitle() {
		return title;
	}

	/**
	 * @param title
	 *            the title to set
	 */
	public void setTitle(String title) {
		this.title = title;
	}

	/**
	 * @return the queryString
	 */
	public String getQueryString() {
		return queryString;
	}

	/**
	 * @param queryString the queryString to set
	 */
	public void setQueryString(String queryString) {
		this.queryString = queryString;
	}

	/**
	 * @return the category
	 */
	public String getCategory() {
		return category;
	}

	/**
	 * @param category the category to set
	 */
	public void setCategory(String category) {
		this.category = category;
	}

	/**
	 * @return the msgTypeOrder
	 */
	public String getMsgTypeOrder() {
		return msgTypeOrder;
	}

	/**
	 * @param msgTypeOrder the msgTypeOrder to set
	 */
	public void setMsgTypeOrder(String msgTypeOrder) {
		this.msgTypeOrder = msgTypeOrder;
	}

	/**
	 * @return the transactionType
	 */
	public String getTransactionType() {
		return transactionType;
	}

	/**
	 * @param transactionType the transactionType to set
	 */
	public void setTransactionType(String transactionType) {
		this.transactionType = transactionType;
	}

	@Override
	public String toString() {
		return "MessageType [state=" + state + ", type=" + type + ", typeName="
				+ typeName + ", formHtml=" + formHtml + ", title=" + title
				+ ", queryString=" + queryString + ", category=" + category
				+ ", msgTypeOrder=" + msgTypeOrder + ", transactionType="
				+ transactionType + ", messages=" + messages + "]";
	}

	public boolean isFinished() {
		return finished;
	}

	public void setFinished(boolean finished) {
		this.finished = finished;
	}

	/**
	 * @return the indexFolder
	 */
	public String getIndexFolder() {
		return indexFolder;
	}

	/**
	 * @param indexFolder the indexFolder to set
	 */
	public void setIndexFolder(String indexFolder) {
		this.indexFolder = indexFolder;
	}

	public String getConfigurationMessage() {
		return configurationMessage;
	}

	public void setConfigurationMessage(String configurationMessage) {
		this.configurationMessage = configurationMessage;
	}



}
