package com.hin.hl7messaging.web.mobile;

import java.util.*;

public class RegResponse {
	private String userName;
	private String password;
	private String subscriberType;
	private String profileXml;
	private String userCredentials;
	private String linkMessage;
	private String linkedProfileMsg;
	private String subscriberID;
	private List<String> roleList = new  ArrayList<String>();
	
	public List<String> getRoleList() {
		return roleList;
	}
	public void setRoleList(List<String> roleList) {
		this.roleList = roleList;
	}
	public String getSubscriberID() {
		return subscriberID;
	}
	public void setSubscriberID(String subscriberID) {
		this.subscriberID = subscriberID;
	}
	public String getLinkedProfileMsg() {
		return linkedProfileMsg;
	}
	public void setLinkedProfileMsg(String linkedProfileMsg) {
		this.linkedProfileMsg = linkedProfileMsg;
	}
	
	public String getLinkMessage() {
		return linkMessage;
	}
	public void setLinkMessage(String linkMessage) {
		this.linkMessage = linkMessage;
	}
	public String getUserCredentials() {
		return userCredentials;
	}
	public void setUserCredentials(String userCredentials) {
		this.userCredentials = userCredentials;
	}
	public String getProfileXml() {
		return profileXml;
	}
	public void setProfileXml(String profileXml) {
		System.out.println("first XML     "+profileXml);
		this.profileXml = profileXml;
		System.out.println("XML     "+this.profileXml);
	}
	
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	
	public String getSubscriberType() {
		return subscriberType;
	}
	public void setSubscriberType(String subscriberType) {
		this.subscriberType = subscriberType;
	}
	
}
