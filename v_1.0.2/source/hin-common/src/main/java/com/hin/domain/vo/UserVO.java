/**
 * 
 */
package com.hin.domain.vo;

import java.util.*;

/**
 * @author shilpa.rao
 * 
 */
public class UserVO {

	private String userName;
	private String password;
	private String subscriberId;
	private List<String> roles;
	private List<String> roleID;
	private List<String> privileges;
	private String message;
	private String profileProcessInstanceID="";
	private String organizationId;

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
	 * @return the password
	 */
	public String getPassword() {
		return password;
	}

	/**
	 * @param password
	 *            the password to set
	 */
	public void setPassword(String password) {
		this.password = password;
	}

	/**
	 * @return the subscriberId
	 */
	public String getSubscriberId() {
		return subscriberId;
	}

	/**
	 * @param subscriberId
	 *            the subscriberId to set
	 */
	public void setSubscriberId(String subscriberId) {
		this.subscriberId = subscriberId;
	}

	/**
	 * @return the roles
	 */
	public List<String> getRoles() {
		return roles;
	}

	/**
	 * @param roles
	 *            the roles to set
	 */
	public void setRoles(List<String> roles) {
		this.roles = roles;
	}

	/**
	 * @return the privileges
	 */
	public List<String> getPrivileges() {
		return privileges;
	}

	/**
	 * @param privileges
	 *            the privileges to set
	 */
	public void setPrivileges(List<String> privileges) {
		this.privileges = privileges;
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

	public String getProfileProcessInstanceID() {
		return profileProcessInstanceID;
	}

	public void setProfileProcessInstanceID(String profileProcessInstanceID) {
		this.profileProcessInstanceID = profileProcessInstanceID;
	}

	public List<String> getRoleID() {
		return roleID;
	}

	public void setRoleID(List<String> roleID) {
		this.roleID = roleID;
	}

	public String getOrganizationId() {
		return organizationId;
	}

	public void setOrganizationId(String organizationId) {
		this.organizationId = organizationId;
	}

}
