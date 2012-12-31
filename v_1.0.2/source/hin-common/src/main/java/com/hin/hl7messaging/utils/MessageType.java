/**
 * 
 */
package com.hin.hl7messaging.utils;

/**
 * @author shilpa.rao
 * 
 */
public enum MessageType {
	ACT("ACT"), ENTITY("ENTITY");

	private final String value;

	private MessageType(String value) {
		this.value = value;
	}

	/**
	 * @return the value
	 */
	public String getValue() {
		return value;
	}

	public static MessageType fromString(String value) {
		if (value != null) {
			for (MessageType messageType : MessageType.values()) {
				if (value.equalsIgnoreCase(messageType.value)) {
					return messageType;
				}
			}
		}
		return null;
	}

}
