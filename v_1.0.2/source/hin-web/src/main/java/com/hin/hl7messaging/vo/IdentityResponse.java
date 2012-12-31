package com.hin.hl7messaging.vo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.hin.hl7messaging.utils.RolesVO;

public class IdentityResponse {
	private String subscriberId, userName, messageXML, messageCount, notificationCount, unreadInbox, roleName, htmlDom, roleCount;
	List<String> roleList = new ArrayList<String>();
	List<String> roleIdList = new ArrayList<String>();
	HashMap<String, String> inboxMessageMap = new HashMap<String, String>();
	List<RolesVO> roleListVO = new ArrayList<RolesVO>();
	
	public String getHtmlDom() {
		return htmlDom;
	}

	public void setHtmlDom(String htmlDom) {
		this.htmlDom = htmlDom;
	}

	/**
	 * @return the inboxMessageMap
	 */
	public HashMap<String, String> getInboxMessageMap() {
		return inboxMessageMap;
	}

	/**
	 * @param inboxMessageMap the inboxMessageMap to set
	 */
	public void setInboxMessageMap(HashMap<String, String> inboxMessageMap) {
		this.inboxMessageMap = inboxMessageMap;
	}

	/**
	 * @return the unreadInbox
	 */
	public String getUnreadInbox() {
		return unreadInbox;
	}

	/**
	 * @param unreadInbox the unreadInbox to set
	 */
	public void setUnreadInbox(String unreadInbox) {
		this.unreadInbox = unreadInbox;
	}

	/**
	 * @return the subscriberId
	 */
	public String getSubscriberId() {
		return subscriberId;
	}

	/**
	 * @return the roleList
	 */
	public List<String> getRoleList() {
		return roleList;
	}

	/**
	 * @param roleList the roleList to set
	 */
	public void setRoleList(List<String> roleList) {
		this.roleList = roleList;
	}

	/**
	 * @param subscriberId the subscriberId to set
	 */
	public void setSubscriberId(String subscriberId) {
		this.subscriberId = subscriberId;
	}

	/**
	 * @return the messageCount
	 */
	public String getMessageCount() {
		return messageCount;
	}

	/**
	 * @param messageCount the messageCount to set
	 */
	public void setMessageCount(String messageCount) {
		this.messageCount = messageCount;
	}

	/**
	 * @return the notificationCount
	 */
	public String getNotificationCount() {
		return notificationCount;
	}

	/**
	 * @param notificationCount the notificationCount to set
	 */
	public void setNotificationCount(String notificationCount) {
		this.notificationCount = notificationCount;
	}

	/**
	 * @return the userName
	 */
	public String getUserName() {
		return userName;
	}

	/**
	 * @param userName the userName to set
	 */
	public void setUserName(String userName) {
		this.userName = userName;
	}

	/**
	 * @return the messageXML
	 */
	public String getMessageXML() {
		return messageXML;
	}

	/**
	 * @param messageXML the messageXML to set
	 */
	public void setMessageXML(String messageXML) {
		this.messageXML = messageXML;
	}

	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}

	public List<RolesVO> getRoleListVO() {
		return roleListVO;
	}

	public void setRoleListVO(List<RolesVO> roleListVO) {
		this.roleListVO = roleListVO;
	}

	

	public String getRoleCount() {
		return roleCount;
	}

	public void setRoleCount(String roleCount) {
		this.roleCount = roleCount;
	}

	public List<String> getRoleIdList() {
		return roleIdList;
	}

	public void setRoleIdList(List<String> roleIdList) {
		this.roleIdList = roleIdList;
	}

	@Override
	public String toString() {
		return "IdentityResponse [subscriberId=" + subscriberId + ", userName="
				+ userName + ", messageXML=" + messageXML + ", messageCount="
				+ messageCount + ", notificationCount=" + notificationCount
				+ ", unreadInbox=" + unreadInbox + ", roleName=" + roleName
				+ ", htmlDom=" + htmlDom + ", roleCount=" + roleCount
				+ ", roleList=" + roleList + ", roleIdList=" + roleIdList
				+ ", inboxMessageMap=" + inboxMessageMap + ", roleListVO="
				+ roleListVO + "]";
	}

}
