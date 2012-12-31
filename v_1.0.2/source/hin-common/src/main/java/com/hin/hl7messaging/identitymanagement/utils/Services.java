package com.hin.hl7messaging.identitymanagement.utils;

public class Services {
	private String subscriber_RoleId;
	private String serviceId;
	public String getSubscriber_RoleId() {
		return subscriber_RoleId;
	}
	public String getServiceId() {
		return serviceId;
	}
	public void setSubscriber_RoleId(String subscriber_RoleId) {
		this.subscriber_RoleId = subscriber_RoleId;
	}
	public void setServiceId(String serviceId) {
		this.serviceId = serviceId;
	}
	@Override
	public String toString() {
		return "Services [subscriber_RoleId=" + subscriber_RoleId
				+ ", serviceId=" + serviceId + "]";
	}

}
