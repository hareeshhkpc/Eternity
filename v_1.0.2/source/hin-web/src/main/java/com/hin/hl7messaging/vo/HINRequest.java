package com.hin.hl7messaging.vo;

import com.hin.hl7messaging.utils.Action;
import com.hin.hl7messaging.utils.MessageType;

public class HINRequest {

	private String password, message, requestType, profileID, errorDesc,
			userName, messageID, messageType, artifactID, lookupName,
			lookupType, assignedToWhom, assignedToOrg, taskId, outCome,
			assigneType, statisticsKey, selectedProfileID, friendRequestBy,
			friendRequestKey, statisticsArtifactID, contactType, xPath,orgId;

	private Action action;
	private MessageType type;

	/**
	 * @return the password
	 */
	public String getPassword() {
		return password;
	}

	public String getAssignedToWhom() {
		return assignedToWhom;
	}

	public String getAssignedToOrg() {
		return assignedToOrg;
	}

	public void setAssignedToWhom(String assignedToWhom) {
		this.assignedToWhom = assignedToWhom;
	}

	public void setAssignedToOrg(String assignedToOrg) {
		this.assignedToOrg = assignedToOrg;
	}

	/**
	 * @param password
	 *            the password to set
	 */
	public void setPassword(String password) {
		this.password = password;
	}

	/**
	 * @return the message
	 */
	public String getMessage() {
		return message;
	}

	/**
	 * @param message
	 *            the message to set
	 */
	public void setMessage(String message) {
		this.message = message;
	}

	/**
	 * @return the requestType
	 */
	public String getRequestType() {
		return requestType;
	}

	/**
	 * @param requestType
	 *            the requestType to set
	 */
	public void setRequestType(String requestType) {
		this.requestType = requestType;
	}

	/**
	 * @return the profileID
	 */
	public String getProfileID() {
		return profileID;
	}

	/**
	 * @param profileID
	 *            the profileID to set
	 */
	public void setProfileID(String profileID) {
		this.profileID = profileID;
	}

	/**
	 * @return the errorDesc
	 */
	public String getErrorDesc() {
		return errorDesc;
	}

	/**
	 * @param errorDesc
	 *            the errorDesc to set
	 */
	public void setErrorDesc(String errorDesc) {
		this.errorDesc = errorDesc;
	}

	/**
	 * @return the userName
	 */
	public String getUserName() {
		return userName;
	}

	/**
	 * @param userName
	 *            the userName to set
	 */
	public void setUserName(String userName) {
		this.userName = userName;
	}

	/**
	 * @return the messageID
	 */
	public String getMessageID() {
		return messageID;
	}

	/**
	 * @param messageID
	 *            the messageID to set
	 */
	public void setMessageID(String messageID) {
		this.messageID = messageID;
	}

	/**
	 * @return the action
	 */
	public Action getAction() {
		return Action.fromString(getRequestType());
	}

	/**
	 * @param action
	 *            the action to set
	 */
	protected void setAction(Action action) {
		this.action = action;
	}

	/**
	 * @return the messageType
	 */
	public String getMessageType() {
		return messageType;
	}

	/**
	 * @param messageType
	 *            the messageType to set
	 */
	public void setMessageType(String messageType) {
		this.messageType = messageType;
	}

	/**
	 * @return the type
	 */
	public MessageType getType() {
		return MessageType.fromString(getMessageType());
	}

	/**
	 * @param type
	 *            the type to set
	 */
	public void setType(MessageType type) {
		this.type = type;
	}

	/**
	 * @return the artifactID
	 */
	public String getArtifactID() {
		return artifactID;
	}

	/**
	 * @param artifactID
	 *            the artifactID to set
	 */
	public void setArtifactID(String artifactID) {
		this.artifactID = artifactID;
	}

	public String getLookupName() {
		return lookupName;
	}

	public void setLookupName(String lookupName) {
		this.lookupName = lookupName;
	}

	public String getLookupType() {
		return lookupType;
	}

	public void setLookupType(String lookupType) {
		this.lookupType = lookupType;
	}

	@Override
	public String toString() {
		return "HINRequest [password=" + password + ", message=" + message
				+ ", requestType=" + requestType + ", profileID=" + profileID
				+ ", errorDesc=" + errorDesc + ", userName=" + userName
				+ ", messageID=" + messageID + ", messageType=" + messageType
				+ ", artifactID=" + artifactID + ", lookupName=" + lookupName
				+ ", lookupType=" + lookupType + ", assignedToWhom="
				+ assignedToWhom + ", assignedToOrg=" + assignedToOrg
				+ ", taskId=" + taskId + ", outCome=" + outCome
				+ ", assigneType=" + assigneType + ", statisticsKey="
				+ statisticsKey + ", selectedProfileID=" + selectedProfileID
				+ ", friendRequestBy=" + friendRequestBy
				+ ", friendRequestKey=" + friendRequestKey + ", action="
				+ action + ", type=" + type + ", statisticsArtifactID="
				+ statisticsArtifactID + "]";
	}

	public String getStatisticsArtifactID() {
		return statisticsArtifactID;
	}

	public void setStatisticsArtifactID(String statisticsArtifactID) {
		this.statisticsArtifactID = statisticsArtifactID;
	}

	public String getTaskId() {
		return taskId;
	}

	public String getOutCome() {
		return outCome;
	}

	public String getAssigneType() {
		return assigneType;
	}

	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}

	public void setOutCome(String outCome) {
		this.outCome = outCome;
	}

	public void setAssigneType(String assigneType) {
		this.assigneType = assigneType;
	}

	public String getStatisticsKey() {
		return statisticsKey;
	}

	public void setStatisticsKey(String statisticsKey) {
		this.statisticsKey = statisticsKey;
	}

	public String getSelectedProfileID() {
		return selectedProfileID;
	}

	public void setSelectedProfileID(String selectedProfileID) {
		this.selectedProfileID = selectedProfileID;
	}

	/**
	 * @return the friendRequestBy
	 */
	public String getFriendRequestBy() {
		return friendRequestBy;
	}

	/**
	 * @param friendRequestBy
	 *            the friendRequestBy to set
	 */
	public void setFriendRequestBy(String friendRequestBy) {
		this.friendRequestBy = friendRequestBy;
	}

	/**
	 * @return the friendRequestKey
	 */
	public String getFriendRequestKey() {
		return friendRequestKey;
	}

	/**
	 * @param friendRequestKey
	 *            the friendRequestKey to set
	 */
	public void setFriendRequestKey(String friendRequestKey) {
		this.friendRequestKey = friendRequestKey;
	}

	/**
	 * @return the contactType
	 */
	public String getContactType() {
		return contactType;
	}

	/**
	 * @param contactType the contactType to set
	 */
	public void setContactType(String contactType) {
		this.contactType = contactType;
	}

	public String getXPath() {
		return xPath;
	}

	public void setXPath(String path) {
		xPath = path;
	}

	public String getOrgId() {
		return orgId;
	}

	public void setOrgId(String orgId) {
		this.orgId = orgId;
	}

}
