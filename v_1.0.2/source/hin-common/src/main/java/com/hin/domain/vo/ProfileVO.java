/**
 * 
 */
package com.hin.domain.vo;

import java.util.Date;

/**
 * @author krishna.lr
 * 
 */
/**
 * @author krishna.lr
 *
 */
/**
 * @author krishna.lr
 *
 */
public class ProfileVO {

	/**
	 * @param subscriberId
	 * @param name
	 */
	public ProfileVO(String subscriberId, String name, String imageBase64) {
		super();
		this.subscriberId = subscriberId;
		this.name = name;
		this.imageBase64 = imageBase64;
	}

	public ProfileVO() {
	
	}

	private String subscriberId;
	private String name;
	private String imageBase64;
	private int age;
	private String gender;
	private String telecom;
	private String state;
	private String timeLapse;
	private String role;
	private String prefixName = "";
	private String givenName = "";
	private String familyName = "";
	private String suffixName = "";
	private String organizationId="";
	private Date createddate;
	private String membershipId = "";

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
	 * @return the name
	 */
	public String getName() {
		return name;
	}

	/**
	 * @param name
	 *            the name to set
	 */
	public void setName(String name) {
		this.name = name;
	}

	/**
	 * @return the imageBase64
	 */
	public String getImageBase64() {
		return imageBase64;
	}

	/**
	 * @param imageBase64
	 *            the imageBase64 to set
	 */
	public void setImageBase64(String imageBase64) {
		this.imageBase64 = imageBase64;
	}

	/**
	 * @return the age
	 */
	public int getAge() {
		return age;
	}

	/**
	 * @param age
	 *            the age to set
	 */
	public void setAge(int age) {
		this.age = age;
	}

	/**
	 * @return the gender
	 */
	public String getGender() {
		return gender;
	}

	/**
	 * @param gender
	 *            the gender to set
	 */
	public void setGender(String gender) {
		this.gender = gender;
	}

	/**
	 * @return the telecom
	 */
	public String getTelecom() {
		return telecom;
	}

	/**
	 * @param telecom
	 *            the telecom to set
	 */
	public void setTelecom(String telecom) {
		this.telecom = telecom;
	}

	/**
	 * @return the state
	 */
	public String getState() {
		return state;
	}

	/**
	 * @param state
	 *            the state to set
	 */
	public void setState(String state) {
		this.state = state;
	}

	/**
	 * @return the timeLapce
	 */
	public String getTimeLapse() {
		return timeLapse;
	}

	/**
	 * @param timeLapce
	 *            the timeLapce to set
	 */
	public void setTimeLapse(String timeLapse) {
		this.timeLapse = timeLapse;
	}

	
	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public String getPrefixName() {
		return prefixName;
	}

	public void setPrefixName(String prefixName) {
		this.prefixName = prefixName;
	}

	public String getGivenName() {
		return givenName;
	}

	public void setGivenName(String givenName) {
		this.givenName = givenName;
	}

	public String getFamilyName() {
		return familyName;
	}

	public void setFamilyName(String familyName) {
		this.familyName = familyName;
	}

	public String getSuffixName() {
		return suffixName;
	}

	public void setSuffixName(String suffixName) {
		this.suffixName = suffixName;
	}
	
	public String getFullName() {
		String fullName = "";
		if (this.prefixName.length() >= 1) {
			fullName = fullName + this.prefixName + " ";
		}
		if (this.givenName.length() >= 1) {
			fullName = fullName + this.givenName + " ";
		}
		if (this.familyName.length() >= 1) {
			fullName = fullName + this.familyName + " ";
		}
		if (this.suffixName.length() >= 1) {
			fullName = fullName + this.suffixName + " ";
		}
		if(fullName.length()>1){
			fullName = fullName.substring(0, fullName.length() - 1);
		}
		return fullName;
	}
	
	@Override
	public String toString() {
		return "ProfileVO [subscriberId=" + subscriberId + ", name=" + name
				+ ", imageBase64=" + imageBase64 + ", age=" + age + ", gender="
				+ gender + ", telecom=" + telecom + ", state=" + state
				+ ", timeLapse=" + timeLapse + ", role=" + role
				+ ", prefixName=" + prefixName + ", givenName=" + givenName
				+ ", familyName=" + familyName + ", suffixName=" + suffixName
				+ "]";
	}

	/**
	 * @return the organizationId
	 */
	public String getOrganizationId() {
		return organizationId;
	}

	/**
	 * @param organizationId the organizationId to set
	 */
	public void setOrganizationId(String organizationId) {
		this.organizationId = organizationId;
	}

	/**
	 * @return the createddate
	 */
	public Date getCreateddate() {
		return createddate;
	}

	/**
	 * @param createddate the createddate to set
	 */
	public void setCreateddate(Date createddate) {
		this.createddate = createddate;
	}

	public String getMembershipId() {
		return membershipId;
	}

	public void setMembershipId(String membershipId) {
		this.membershipId = membershipId;
	}

}
