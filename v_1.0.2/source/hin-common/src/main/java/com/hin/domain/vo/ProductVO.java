/**
 * 
 */
package com.hin.domain.vo;

/**
 * @author krishna.lr
 * 
 */
public class ProductVO {
	private String messageId;
	private String messageTitle;
	private String messageStatus;
	private String createdDate;
	private String isActive;
	private String message;
	/**
	 * @return the messageId
	 */
	public String getMessageId() {
		return messageId;
	}
	/**
	 * @param messageId the messageId to set
	 */
	public void setMessageId(String messageId) {
		this.messageId = messageId;
	}
	/**
	 * @return the messageTitle
	 */
	public String getMessageTitle() {
		return messageTitle;
	}
	/**
	 * @param messageTitle the messageTitle to set
	 */
	public void setMessageTitle(String messageTitle) {
		this.messageTitle = messageTitle;
	}
	/**
	 * @return the messageStatus
	 */
	public String getMessageStatus() {
		return messageStatus;
	}
	/**
	 * @param messageStatus the messageStatus to set
	 */
	public void setMessageStatus(String messageStatus) {
		this.messageStatus = messageStatus;
	}
	/**
	 * @return the createdDate
	 */
	public String getCreatedDate() {
		return createdDate;
	}
	/**
	 * @param createdDate the createdDate to set
	 */
	public void setCreatedDate(String createdDate) {
		this.createdDate = createdDate;
	}
	/**
	 * @return the isActive
	 */
	public String getIsActive() {
		return isActive;
	}
	/**
	 * @param isActive the isActive to set
	 */
	public void setIsActive(String isActive) {
		this.isActive = isActive;
	}
	/**
	 * @return the message
	 */
	public String getMessage() {
		return message;
	}
	/**
	 * @param message the message to set
	 */
	public void setMessage(String message) {
		this.message = message;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "ProductVO [messageId=" + messageId + ", messageTitle="
				+ messageTitle + ", messageStatus=" + messageStatus
				+ ", createdDate=" + createdDate + ", isActive=" + isActive
				+ ", message=" + message + "]";
	}
}
