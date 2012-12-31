package com.hin.domain;

import com.hin.domain.core.BaseDomain;

public class MessageParticipants extends BaseDomain {
	String messageId;
	String participantId;

	public String getMessageId() {
		return messageId;
	}

	public void setMessageId(String messageId) {
		this.messageId = messageId;
	}

	public String getParticipantId() {
		return participantId;
	}

	public void setParticipantId(String participantId) {
		this.participantId = participantId;
	}
}
