package com.hin.hl7messaging.identitymanagement.utils;

public class SubscriberProfile {
	private String subscriberId;
	private String message;
	private String userName;
	private String password;
	private String subscriberType;
	private String securityQuestion;
	private String securityAnswer;
	private String identification;
	private String email;
	private String fullName;
	private String active;
	private String createdTime;
	private String createdBy;
	private String lastModifiedTime;
	private String modifiedBy;
	private String link;
	private String organization;
	
	public String getOrganization() {
		return organization;
	}
	public void setOrganization(String organization) {
		this.organization = organization;
	}
	public String getLink() {
		return link;
	}
	public void setLink(String link) {
		this.link = link;
	}
	public String getSubscriberId() {
		return subscriberId;
	}
	public String getMessage() {
		return message;
	}
	public String getUserName() {
		return userName;
	}
	public String getPassword() {
		return password;
	}
	public String getSubscriberType() {
		return subscriberType;
	}
	public String getSecurityQuestion() {
		return securityQuestion;
	}
	public String getSecurityAnswer() {
		return securityAnswer;
	}
	public String getIdentification() {
		return identification;
	}
	public String getEmail() {
		return email;
	}
	public String getFullName() {
		return fullName;
	}
	public String getActive() {
		return active;
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
	public void setSubscriberId(String subscriberId) {
		this.subscriberId = subscriberId;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public void setSubscriberType(String subscriberType) {
		this.subscriberType = subscriberType;
	}
	public void setSecurityQuestion(String securityQuestion) {
		this.securityQuestion = securityQuestion;
	}
	public void setSecurityAnswer(String securityAnswer) {
		this.securityAnswer = securityAnswer;
	}
	public void setIdentification(String identification) {
		this.identification = identification;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public void setFullName(String fullName) {
		this.fullName = fullName;
	}
	public void setActive(String active) {
		this.active = active;
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
	@Override
	public String toString() {
		return "SubscriberProfile [subscriberId=" + subscriberId + ", message="
				+ message + ", userName=" + userName + ", password=" + password
				+ ", subscriberType=" + subscriberType + ", securityQuestion="
				+ securityQuestion + ", securityAnswer=" + securityAnswer
				+ ", identification=" + identification + ", email=" + email
				+ ", fullName=" + fullName + ", active=" + active
				+ ", createdTime=" + createdTime + ", createdBy=" + createdBy
				+ ", lastModifiedTime=" + lastModifiedTime + ", modifiedBy="
				+ modifiedBy + ", link=" + link + ", organization="
				+ organization + "]";
	}
	
	
	
}
