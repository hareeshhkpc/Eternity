package com.hin.hl7messaging.identitymanagement.utils;

public class Role {
	private String subscriber_roleId;
	private String message;
	private String roleName;
	private String roleId;
	private String role_status;
	private String playerOrScoper;
	private String createdTime;
	private String createdBy;
	private String lastModifiedTime;
	private String modifiedBy;
	private String contact;
	
	public String getRole_status() {
		return role_status;
	}

	public void setRole_status(String role_status) {
		this.role_status = role_status;
	}

	public String getContact() {
		return contact;
	}
	
	public void setContact(String contact) {
		this.contact = contact;
	}
	public String getSubscriber_roleId() {
		return subscriber_roleId;
	}
	public String getMessage() {
		return message;
	}
	public String getRoleName() {
		return roleName;
	}
	public String getPlayerOrScoper() {
		return playerOrScoper;
	}
	public String getCreatedTime() {
		return createdTime;
	}
	public String getCreatedBy() {
		return createdBy;
	}
	public String getLastModifiedTime() {
		return lastModifiedTime;
	}
	public String getModifiedBy() {
		return modifiedBy;
	}
	public void setSubscriber_roleId(String subscriber_roleId) {
		this.subscriber_roleId = subscriber_roleId;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}
	public void setPlayerOrScoper(String playerOrScoper) {
		this.playerOrScoper = playerOrScoper;
	}
	public void setCreatedTime(String createdTime) {
		this.createdTime = createdTime;
	}
	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}
	public void setLastModifiedTime(String lastModifiedTime) {
		this.lastModifiedTime = lastModifiedTime;
	}
	public void setModifiedBy(String modifiedBy) {
		this.modifiedBy = modifiedBy;
	}
	
	public String getRoleId() {
		return roleId;
	}
	public void setRoleId(String roleId) {
		this.roleId = roleId;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "Role [subscriber_roleId=" + subscriber_roleId + ", message="
				+ message + ", roleName=" + roleName + ", roleId=" + roleId
				+ ", role_status=" + role_status + ", playerOrScoper="
				+ playerOrScoper + ", createdTime=" + createdTime
				+ ", createdBy=" + createdBy + ", lastModifiedTime="
				+ lastModifiedTime + ", modifiedBy=" + modifiedBy
				+ ", contact=" + contact + "]";
	}
	
}
