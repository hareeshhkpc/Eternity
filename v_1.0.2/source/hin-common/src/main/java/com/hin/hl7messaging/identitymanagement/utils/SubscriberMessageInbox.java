package com.hin.hl7messaging.identitymanagement.utils;

public class SubscriberMessageInbox {
	private String subscriberId;
	private String message;
	private String status;
	public String getSubscriberId() {
		return subscriberId;
	}
	public String getMessage() {
		return message;
	}
	public String getStatus() {
		return status;
	}
	public void setSubscriberId(String subscriberId) {
		this.subscriberId = subscriberId;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	@Override
	public String toString() {
		return "SubscriberMessageInbox [subscriberId=" + subscriberId
				+ ", message=" + message + ", status=" + status + "]";
	}
}
