package com.hin.hl7messaging;

import java.util.ArrayList;
import java.util.List;

public class HinUserProfile {

	private String Key;

	private String password;

	private String department;

	private String role;

	private String location;

	private String userName;

	private String message;

	private String workFlowCriteria;
	
	private boolean isOrganistaion;
	
	private String emailId;

	public String getMessageId() {
		return messageId;
	}

	public void setMessageId(String messageId) {
		this.messageId = messageId;
	}

	private List<HinOrgUserProfile> hinOrgUserProfileList = new ArrayList<HinOrgUserProfile>();

//	private HinOrgUserProfile hinOrgUserProfile;
	
	private String messageId;

	public String getKey() {
		return Key;
	}

	public void setKey(String key) {
		Key = key;
	}

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	/*public HinOrgUserProfile getHinOrgUserProfile() {
		return hinOrgUserProfile;
	}

	public void setHinOrgUserProfile(HinOrgUserProfile hinOrgUserProfile) {
		this.hinOrgUserProfile = hinOrgUserProfile;
	}*/

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getWorkFlowCriteria() {
		return workFlowCriteria;
	}

	public void setWorkFlowCriteria(String workFlowCriteria) {
		this.workFlowCriteria = workFlowCriteria;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public boolean isOrganistaion() {
		return isOrganistaion;
	}

	public void setOrganistaion(boolean isOrganistaion) {
		this.isOrganistaion = isOrganistaion;
	}

	public List<HinOrgUserProfile> getHinOrgUserProfileList() {
		return hinOrgUserProfileList;
	}

	public void setHinOrgUserProfileList(
			List<HinOrgUserProfile> hinOrgUserProfileList) {
		this.hinOrgUserProfileList = hinOrgUserProfileList;
	}
	public HinOrgUserProfile getHinOrgUserProfile(String orgId){
		for(HinOrgUserProfile hinOrgUserProfile:hinOrgUserProfileList){
			if(hinOrgUserProfile.getKey().equals(orgId)){
				return hinOrgUserProfile;
			}
		}
		return null;
	}

	public String getEmailId() {
		return emailId;
	}

	public void setEmailId(String emailId) {
		this.emailId = emailId;
	}
}
