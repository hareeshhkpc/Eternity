package com.hin.domain;

import java.util.ArrayList;
import java.util.List;

import com.hin.domain.core.BaseDomain;

public class Step extends BaseDomain {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	public String stepName;
	public String groupName;
	public String shortDescription;
	public String longDescription;
	public List<MessageType> messageTypes = new ArrayList<MessageType>();
	public String formHtml;
	public String initializeScript = new String();
	public String order;
	public String navigateStep;
	public Boolean stepStatusInfo = true;
	public String state="unread";

	/*
	 * public List<Message> messages = new ArrayList<Message>();
	 */public List<MessageType> getMessageTypes() {
		return messageTypes;
	}

	public void setMessageTypes(List<MessageType> messageTypes) {
		this.messageTypes = messageTypes;
	}

	public String getStepName() {
		return stepName;
	}

	public void setStepName(String stepName) {
		this.stepName = stepName;
	}

	public String getGroupName() {
		return groupName;
	}

	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}

	public String getShortDescription() {
		return shortDescription;
	}

	public void setShortDescription(String shortDescription) {
		this.shortDescription = shortDescription;
	}

	public String getLongDescription() {
		return longDescription;
	}

	public void setLongDescription(String longDescription) {
		this.longDescription = longDescription;
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

	/*
	 * public void addMessage(Message message) { messages.add(message); }
	 */
	public void addMessageType(MessageType messageType) {
		this.messageTypes.add(messageType);
	}

	public void addMsgType(MessageType messageType) {
		messageTypes.add(messageType);

	}

	public boolean removeMsgType(String id) {
		List<MessageType> messageTypes = getMessageTypes();
		for (MessageType messageType : messageTypes) {
			if (messageType.getId().equals(id)) {
				return messageTypes.remove(messageType);
			}
		}
		return false;

	}

	public MessageType getMessageTypeById(String id) {
		List<MessageType> messageTypes = getMessageTypes();
		for (MessageType messageType : messageTypes) {
			if (messageType.getId().equals(id)) {
				return messageType;
			}
		}
		return null;

	}

	/**
	 * @return the initializeScript
	 */
	public String getInitializeScript() {
		return initializeScript;
	}

	/**
	 * @param initializeScript
	 *            the initializeScript to set
	 */
	public void setInitializeScript(String initializeScript) {
		this.initializeScript = initializeScript;
	}

	/**
	 * @return the order
	 */
	public String getOrder() {
		return order;
	}

	/**
	 * @param order
	 *            the order to set
	 */
	public void setOrder(String order) {
		this.order = order;
	}

	/**
	 * @return the navigateStep
	 */
	public String getNavigateStep() {
		return navigateStep;
	}

	/**
	 * @param navigateStep
	 *            the navigateStep to set
	 */
	public void setNavigateStep(String navigateStep) {
		this.navigateStep = navigateStep;
	}

	@Override
	public String toString() {
		return "Step [stepName=" + stepName + ", groupName=" + groupName
				+ ", shortDescription=" + shortDescription
				+ ", longDescription=" + longDescription + ", messageTypes="
				+ messageTypes + ", formHtml=" + formHtml
				+ ", initializeScript=" + initializeScript + ", order=" + order
				+ ", navigateStep=" + navigateStep + "]";
	}

	/**
	 * @return the stepStatusInfo
	 */
	public Boolean getStepStatusInfo() {
		return stepStatusInfo;
	}

	/**
	 * @param stepStatusInfo the stepStatusInfo to set
	 */
	public void setStepStatusInfo(Boolean stepStatusInfo) {
		this.stepStatusInfo = stepStatusInfo;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	
	/**
	 * @return the messages
	 */
	/*
	 * public List<Message> getMessages() { return messages; }
	 *//**
	 * @param messages
	 *            the messages to set
	 */
	/*
	 * public void setMessages(List<Message> messages) { this.messages =
	 * messages; }
	 */
}
