/**
 * 
 */
package com.hin.domain.vo;

/**
 * @author krishna.lr
 * 
 */
public class Receiver {
	private String subscriberId;
	private String name;
	private String organizationId;

	public String getSubscriberId() {
		return subscriberId;
	}

	public void setSubscriberId(String subscriberId) {
		this.subscriberId = subscriberId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getOrganizationId() {
		return organizationId;
	}

	public void setOrganizationId(String organizationId) {
		this.organizationId = organizationId;
	}
}
