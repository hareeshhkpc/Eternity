package com.hin.hl7messaging.vo;

public class RolesVO {
	private String roleId = null;
	private String roleName = null;
	private String permission = null;
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
	
}
