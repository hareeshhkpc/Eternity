/**
 * 
 */
package com.hin.domain.vo;

/**
 * @author krishna.lr
 * 
 */
public class AppointmentNotification extends Notification {
	private Organization organization;

	public Organization getOrganization() {
		return organization;
	}

	public void setOrganization(Organization organizationVO) {
		this.organization = organizationVO;
	}
}
