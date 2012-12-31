package com.hin.domain;

import java.util.ArrayList;
import java.util.List;

public class Message {

	int messageIndex;
	String messageId;
	String message;
	String messageStatus;
	String messageType;
	String messageForm;
	String groupName;
	String title;
	String header;
	boolean empty;
	String transactionType = "";
	// boolean finished = false;
	boolean formView = true;
	boolean partOfPackage = false;
	int packageId;
	int messageProcessCompeletionStatus = 0;
	boolean addNew = false;
	boolean initializeScriptExecuted = false;
	List<Message> dependendMessages = new ArrayList<Message>();
	boolean dependendMessageProcessed = false;
	String financeType = null;
	boolean readOnly = false;
	boolean deletable = false;

	public String getMessageId() {
		return messageId;
	}

	public void setMessageId(String messageId) {
		this.messageId = messageId;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getMessageStatus() {
		return messageStatus;
	}

	public void setMessageStatus(String messageStatus) {
		this.messageStatus = messageStatus;
	}

	public String getMessageType() {
		return messageType;
	}

	public void setMessageType(String messageType) {
		this.messageType = messageType;
	}

	/**
	 * @return the messageForm
	 */
	public String getMessageForm() {
		return messageForm;
	}

	/**
	 * @param messageForm
	 *            the messageForm to set
	 */
	public void setMessageForm(String messageForm) {
		this.messageForm = messageForm;
	}

	/**
	 * @return the messageIndex
	 */
	public int getMessageIndex() {
		return messageIndex;
	}

	/**
	 * @param messageIndex
	 *            the messageIndex to set
	 */
	public void setMessageIndex(int messageIndex) {
		this.messageIndex = messageIndex;
	}

	/**
	 * @return the groupName
	 */
	public String getGroupName() {
		return groupName;
	}

	/**
	 * @param groupName
	 *            the groupName to set
	 */
	public void setGroupName(String groupName) {
		this.groupName = groupName;
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
	 * @return the header
	 */
	public String getHeader() {
		return header;
	}

	/**
	 * @param header
	 *            the header to set
	 */
	public void setHeader(String header) {
		this.header = header;
	}

	/**
	 * @return the empty
	 */
	public boolean isEmpty() {
		return empty;
	}

	/**
	 * @param empty
	 *            the empty to set
	 */
	public void setEmpty(boolean empty) {
		this.empty = empty;
	}

	public String getTransactionType() {
		return transactionType;
	}

	public void setTransactionType(String transactionType) {
		this.transactionType = transactionType;
	}

	/**
	 * @return the dependendMessages
	 */
	public List<Message> getDependendMessages() {
		return dependendMessages;
	}

	/**
	 * @param dependendMessages
	 *            the dependendMessages to set
	 */
	public void setDependendMessages(List<Message> dependendMessages) {
		this.dependendMessages = dependendMessages;
	}

	/**
	 * @return the dependendMessageProcessed
	 */
	public boolean isDependendMessageProcessed() {
		return dependendMessageProcessed;
	}

	/**
	 * @param dependendMessageProcessed
	 *            the dependendMessageProcessed to set
	 */
	public void setDependendMessageProcessed(boolean dependendMessageProcessed) {
		this.dependendMessageProcessed = dependendMessageProcessed;
	}

	/**
	 * @return the partOfPackage
	 */
	public boolean isPartOfPackage() {
		return partOfPackage;
	}

	/**
	 * @param partOfPackage
	 *            the partOfPackage to set
	 */
	public void setPartOfPackage(boolean partOfPackage) {
		this.partOfPackage = partOfPackage;
	}

	public int getMessageProcessCompeletionStatus() {
		return messageProcessCompeletionStatus;
	}

	public void setMessageProcessCompeletionStatus(
			int messageProcessCompeletionStatus) {
		this.messageProcessCompeletionStatus = messageProcessCompeletionStatus;
	}

	/**
	 * @return the finished
	 */
	/*
	 * public boolean isFinished() { return finished; }
	 *//**
	 * @param finished
	 *            the finished to set
	 */
	/*
	 * public void setFinished(boolean finished) { this.finished = finished; }
	 */
	/**
	 * @return the formView
	 */
	public boolean isFormView() {
		return formView;
	}

	/**
	 * @param formView
	 *            the formView to set
	 */
	public void setFormView(boolean formView) {
		this.formView = formView;
	}

	/**
	 * @return the addNew
	 */
	public boolean isAddNew() {
		return addNew;
	}

	/**
	 * @param addNew
	 *            the addNew to set
	 */
	public void setAddNew(boolean addNew) {
		this.addNew = addNew;
	}

	/**
	 * @return the packageId
	 */
	public int getPackageId() {
		return packageId;
	}

	/**
	 * @param packageId
	 *            the packageId to set
	 */
	public void setPackageId(int packageId) {
		this.packageId = packageId;
	}

	/**
	 * @return the financeType
	 */
	public String getFinanceType() {
		return financeType;
	}

	/**
	 * @param financeType
	 *            the financeType to set
	 */
	public void setFinanceType(String financeType) {
		this.financeType = financeType;
	}

	/**
	 * @return the initializeScriptExecuted
	 */
	public boolean isInitializeScriptExecuted() {
		return initializeScriptExecuted;
	}

	/**
	 * @param initializeScriptExecuted
	 *            the initializeScriptExecuted to set
	 */
	public void setInitializeScriptExecuted(boolean initializeScriptExecuted) {
		this.initializeScriptExecuted = initializeScriptExecuted;
	}

	/**
	 * @return the readOnly
	 */
	public boolean isReadOnly() {
		return readOnly;
	}

	/**
	 * @param readOnly
	 *            the readOnly to set
	 */
	public void setReadOnly(boolean readOnly) {
		this.readOnly = readOnly;
	}

	/**
	 * @return the deletable
	 */
	public boolean isDeletable() {
		return deletable;
	}

	/**
	 * @param deletable the deletable to set
	 */
	public void setDeletable(boolean deletable) {
		this.deletable = deletable;
	}

}
