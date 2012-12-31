package com.hin.hl7messaging.web.mobile;

import com.hin.hl7messaging.utils.RequestType;

public class RegRequest {
	 private String requestType;
	 private String userName;
	 private String password;
	 private String confirmPwd;
	 private String subscriberType;
	 private String name;
	 private String identity;
	 private String telecom;
	 private String question;
	 private String answer;
	 private String profileXml;
	 private String subscriberID;
	
	 private RequestType action;
	 
	
 public String getSubscriberID() {
		return subscriberID;
	}
	public void setSubscriberID(String subscriberID) {
		this.subscriberID = subscriberID;
	}
	
	public String getProfileXml() {
		return profileXml;
	}
	public void setProfileXml(String profileXml) {
		this.profileXml = profileXml;
	}
	public String getRequestType() {
		return requestType;
	}
	public void setRequestType(String requestType) {
		this.requestType = requestType;
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
	public String getConfirmPwd() {
		return confirmPwd;
	}
	public void setConfirmPwd(String confirmPwd) {
		this.confirmPwd = confirmPwd;
	}
	public String getSubscriberType() {
		return subscriberType;
	}
	public void setSubscriberType(String subscriberType) {
		this.subscriberType = subscriberType;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getIdentity() {
		return identity;
	}
	public void setIdentity(String identity) {
		this.identity = identity;
	}
	public String getTelecom() {
		return telecom;
	}
	public void setTelecom(String telecom) {
		this.telecom = telecom;
	}
	public String getQuestion() {
		return question;
	}
	public void setQuestion(String question) {
		this.question = question;
	}
	public String getAnswer() {
		return answer;
	}
	public void setAnswer(String answer) {
		this.answer = answer;
	}
	public RequestType getAction() {
		return RequestType.fromString(getRequestType());
	}
	public void setAction(RequestType action) {
		this.action = action;
	}
	@Override
	public String toString() {
		return "RegRequest [requestType=" + requestType + ", userName="
				+ userName + ", password=" + password + ", confirmPwd="
				+ confirmPwd + ", subscriberType=" + subscriberType + ", name="
				+ name + ", identity=" + identity + ", telecom=" + telecom
				+ ", question=" + question + ", answer=" + answer
				+ ", profileXml=" + profileXml + ", subscriberID="
				+ subscriberID + ", action=" + action + "]";
	}
	 
}
