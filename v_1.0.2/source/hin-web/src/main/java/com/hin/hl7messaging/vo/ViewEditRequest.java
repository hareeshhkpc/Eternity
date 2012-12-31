package com.hin.hl7messaging.vo;


public class ViewEditRequest{
    
    private String requestType;
    private String profileId;
    private String profileXml;
    
    public String getRequestType() {
		return requestType;
	}
	public void setRequestType(String requestType) {
		this.requestType = requestType;
	}
	public String getProfileId() {
		return profileId;
	}
	public void setProfileId(String profileId) {
		this.profileId = profileId;
	}
	public String getProfileXml() {
		return profileXml;
	}
	public void setProfileXml(String profileXml) {
		this.profileXml = profileXml;
	}
	 
}

