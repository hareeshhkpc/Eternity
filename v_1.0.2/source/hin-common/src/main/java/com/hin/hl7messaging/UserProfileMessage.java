/**
 * 
 */
package com.hin.hl7messaging;


/**
 * @author Administrator
 *
 */
public class UserProfileMessage implements Comparable<UserProfileMessage>{

	private String name;
	private String profileMessage;
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getProfileMessage() {
		return profileMessage;
	}
	public void setProfileMessage(String profileMessage) {
		this.profileMessage = profileMessage;
	}
	@Override
	public int compareTo(UserProfileMessage another) {
		return this.name.compareToIgnoreCase(another.name);
	}
	
}
