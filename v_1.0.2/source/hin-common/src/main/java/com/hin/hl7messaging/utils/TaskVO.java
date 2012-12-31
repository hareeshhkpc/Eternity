/**
 * 
 */
package com.hin.hl7messaging.utils;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Set;

/**
 * @author sreekumar.s
 * 
 */
public class TaskVO {

	public int asigneeTyp;
	public String asigneeName = "";
	public String outCome = "";
	public String messageID = "";
	/* public Task taskAssigned; */
	public Object parameters = "";
	public String userProcessKey = "";
	public String processName = "";
	public String message = "";
	public String workFlowProcessKey = "";
	public String taskId = "";
	public Set<String> taskOutComes;
	public String orgId = "";
	public boolean completed;
	public HashMap<String, String> assignablePeople;
	public String friendRequestKey = "";
	public String friendId = "";
	private String messageType = "";
	private String contactType = "";

	/**
	 * @return the asigneeTyp
	 */
	public int getAsigneeTyp() {
		return asigneeTyp;
	}

	public String getFriendRequestKey() {
		return friendRequestKey;
	}

	public void setFriendRequestKey(String friendRequestKey) {
		this.friendRequestKey = friendRequestKey;
	}

	public String getFriendId() {
		return friendId;
	}

	public void setFriendId(String friendId) {
		this.friendId = friendId;
	}

	/**
	 * @param asigneeTyp
	 *            the asigneeTyp to set
	 */
	public void setAsigneeTyp(int asigneeTyp) {
		this.asigneeTyp = asigneeTyp;
	}

	/**
	 * @return the asigneeName
	 */
	public String getAsigneeName() {
		return asigneeName;
	}

	/**
	 * @param asigneeName
	 *            the asigneeName to set
	 */
	public void setAsigneeName(String asigneeName) {
		this.asigneeName = asigneeName;
	}

	/**
	 * @return the outCome
	 */
	public String getOutCome() {
		return outCome;
	}

	/**
	 * @param outCome
	 *            the outCome to set
	 */
	public void setOutCome(String outCome) {
		this.outCome = outCome;
	}

	/**
	 * @return the parameters
	 */
	public Object getParameters() {
		return parameters;
	}

	/**
	 * @param parameters
	 *            the parameters to set
	 */
	public void setParameters(Object parameters) {
		this.parameters = parameters;
	}

	/**
	 * @return the userProcessKey
	 */
	public String getUserProcessKey() {
		return userProcessKey;
	}

	/**
	 * @param userProcessKey
	 *            the userProcessKey to set
	 */
	public void setUserProcessKey(String userProcessKey) {
		this.userProcessKey = userProcessKey;
	}

	/**
	 * @return the processName
	 */
	public String getProcessName() {
		return processName;
	}

	/**
	 * @param processName
	 *            the processName to set
	 */
	public void setProcessName(String processName) {
		this.processName = processName;
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
	 * @return the workFlowProcessKey
	 */
	public String getWorkFlowProcessKey() {
		return workFlowProcessKey;
	}

	/**
	 * @param workFlowProcessKey
	 *            the workFlowProcessKey to set
	 */
	public void setWorkFlowProcessKey(String workFlowProcessKey) {
		this.workFlowProcessKey = workFlowProcessKey;
	}

	/**
	 * @return the taskId
	 */
	public String getTaskId() {
		return taskId;
	}

	/**
	 * @param taskId
	 *            the taskId to set
	 */
	public void setTaskId(String taskId) {
		this.taskId = taskId == null ? "" : taskId;
	}

	/**
	 * @return the taskOutComes
	 */
	public Set<String> getTaskOutComes() {
		return taskOutComes;
	}

	/**
	 * @param taskOutComes
	 *            the taskOutComes to set
	 */
	public void setTaskOutComes(Set<String> taskOutComes) {
		this.taskOutComes = taskOutComes;
	}

	/**
	 * @return the orgId
	 */
	public String getOrgId() {
		return orgId;
	}

	/**
	 * @param orgId
	 *            the orgId to set
	 */
	public void setOrgId(String orgId) {
		this.orgId = orgId == null ? "" : orgId;
	}

	/**
	 * @return the completed
	 */
	public boolean isCompleted() {
		return completed;
	}

	/**
	 * @param completed
	 *            the completed to set
	 */
	public void setCompleted(boolean completed) {
		this.completed = completed;
	}

	/**
	 * @return the assignablePeople
	 */
	public HashMap<String, String> getAssignablePeople() {
		return assignablePeople;
	}

	/**
	 * @param assignablePeople
	 *            the assignablePeople to set
	 */
	public void setAssignablePeople(HashMap<String, String> assignablePeople) {
		this.assignablePeople = assignablePeople;
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
		this.messageID = messageID == null ? "" : messageID;
	}

	public String getOutComes() {
		String outcomes = "New,";// "View,";
		if (messageType != null
				&& messageType.equals("IMTAC_CONTACT_SEND_REQUEST")
				|| messageType.equals("IMTAC_CONTACT_GOT_REQUEST")) {
			outcomes = "";
		}
		
		if(messageType!=null && (messageType.startsWith("USERCOPY_"))){//PRPA_IN410001"))){
			outcomes="";//Complete,";
		}
		
		if (getTaskOutComes() == null)
			return outcomes;
		Set<String> set = getTaskOutComes();
		Iterator<String> iterator = set.iterator();
		while (iterator.hasNext()) {
			String outcome = iterator.next();
			if (outcome.equals("New") || outcome.equals("Accept")
					|| outcome.equals("Reject") || outcome.equals("Forward")
					|| outcome.equals("Complete"))
				outcomes = outcomes.concat(outcome).concat(",");
		}
		if (outcomes.length() > 0 && outcomes.lastIndexOf(",") > -1) {
			outcomes = outcomes.substring(0, outcomes.length() - 1);
		}
		return outcomes;
	}

	public String getMessageType() {
		return messageType;
	}

	public void setMessageType(String messageType) {
		this.messageType = messageType;
	}

	/**
	 * @return the contactType
	 */
	public String getContactType() {
		return contactType;
	}

	/**
	 * @param contactType
	 *            the contactType to set
	 */
	public void setContactType(String contactType) {
		this.contactType = contactType;
	}

}
