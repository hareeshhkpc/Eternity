package com.hin.hl7messaging.utils;

public class RolesVO {
	private String roleId = null;
	private String contactSubscriberId = null;
	private String roleName = null;
	private String permission = null;
	private String contact = null;
	private String creationTime=null;
	private String status=null;
	private String blocked=null;
	
	
	public String getBlocked() {
		return blocked;
	}
	public void setBlocked(String blocked) {
		this.blocked = blocked;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getContactSubscriberId() {
		return contactSubscriberId;
	}
	public void setContactSubscriberId(String contactSubscriberId) {
		this.contactSubscriberId = contactSubscriberId;
	}
	public String getCreationTime() {
		return creationTime;
	}
	public void setCreationTime(String creationTime) {
		this.creationTime = creationTime;
	}
	public String getRoleId() {
		return roleId;
	}
	public String getRoleName() {
		return roleName;
	}
	public String getPermission() {
		return permission;
	}
	public void setRoleId(String roleId) {
		this.roleId = roleId;
	}
	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}
	public void setPermission(String permission) {
		this.permission = permission;
	}
	public String getContact() {
		return contact;
	}
	public void setContact(String contact) {
		this.contact = contact;
	}
	
}
