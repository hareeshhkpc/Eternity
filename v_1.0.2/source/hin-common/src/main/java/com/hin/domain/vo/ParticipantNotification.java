/**
 * 
 */
package com.hin.domain.vo;

import com.hin.domain.MessageType;

/**
 * @author krishna.lr
 * 
 */
public class ParticipantNotification extends Notification {
	private Organization organization;
	private String changes;
	private MessageType messageType;
	private String messageId;

	public Organization getOrganization() {
		return organization;
	}

	public void setOrganization(Organization organization) {
		this.organization = organization;
	}

	public String getChanges() {
		return changes;
	}

	public void setChanges(String changes) {
		this.changes = changes;
	}

	public MessageType getMessageType() {
		return messageType;
	}

	public void setMessageType(MessageType messageType) {
		this.messageType = messageType;
	}

	public String getMessageId() {
		return messageId;
	}

	public void setMessageId(String messageId) {
		this.messageId = messageId;
	}

}
