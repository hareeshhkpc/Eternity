package com.hin.hl7messaging.vo;

import com.hin.hl7messaging.utils.RequestType;

public class IdentityRequest {
	private String requestType;
	private String selectedRole;
	private String xmlMsg, subscriberId, messageId;
	private String roleId;
	private String permission, roleName, contact, actionType;
	
	
	/**
	 * @return the actionType
	 */
	public String getActionType() {
		return actionType;
	}

	/**
	 * @param actionType the actionType to set
	 */
	public void setActionType(String actionType) {
		this.actionType = actionType;
	}

	private RequestType action;
	
	/**
	 * @return the roleName
	 */
	public String getRoleName() {
		return roleName;
	}

	/**
	 * @return the messageId
	 */
	public String getMessageId() {
		return messageId;
	}

	/**
	 * @param messageId the messageId to set
	 */
	public void setMessageId(String messageId) {
		this.messageId = messageId;
	}

	/**
	 * @param roleName the roleName to set
	 */
	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}

	/**
	 * @return the contact
	 */
	public String getContact() {
		return contact;
	}

	/**
	 * @param contact the contact to set
	 */
	public void setContact(String contact) {
		this.contact = contact;
	}

	/**
	 * @return the xmlMsg
	 */
	public String getXmlMsg() {
		return xmlMsg;
	}

	public String getSubscriberId() {
		return subscriberId;
	}

	public void setSubscriberId(String subscriberId) {
		this.subscriberId = subscriberId;
	}

	/**
	 * @param xmlMsg the xmlMsg to set
	 */
	public void setXmlMsg(String xmlMsg) {
		this.xmlMsg = xmlMsg;
	}

	/**
	 * @return the selectedRole
	 */
	public String getSelectedRole() {
		return selectedRole;
	}

	/**
	 * @param selectedRole the selectedRole to set
	 */
	public void setSelectedRole(String selectedRole) {
		this.selectedRole = selectedRole;
	}

	
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "IdentityRequest [requestType=" + requestType
				+ ", selectedRole=" + selectedRole + ", xmlMsg=" + xmlMsg
				+ ", subscriberId=" + subscriberId + ", messageId=" + messageId
				+ ", roleId=" + roleId + ", permission=" + permission
				+ ", roleName=" + roleName + ", contact=" + contact
				+ ", actionType=" + actionType + ", action=" + action + "]";
	}

	public String getRoleId() {
		return roleId;
	}

	public String getPermission() {
		return permission;
	}

	public void setRoleId(String roleId) {
		this.roleId = roleId;
	}

	public void setPermission(String permission) {
		this.permission = permission;
	}

	public RequestType getAction() {
		return RequestType.fromString(getRequestType());
	}

	public void setRequestType(String requestType) {
		this.requestType = requestType;
	}

	public void setAction(RequestType action) {
		this.action = action;
	}

	public String getRequestType() {
		return requestType;
	}

}
