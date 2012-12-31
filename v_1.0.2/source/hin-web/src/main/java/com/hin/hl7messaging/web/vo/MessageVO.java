/**
 * 
 */
package com.hin.hl7messaging.web.vo;

/**
 * @author krishna.lr
 * 
 */
public class MessageVO {

	/**
	 * @param patientId 
	 * @param patientName 
	 * @param pidtid 
	 * @param testId 
	 * @param testDate 
	 * @param testName 
	 * @param subscriberId
	 * @param name
	 */
	public MessageVO(String patientId, String patientName, String pidtid, String messageId, String testDate, String testName) {
		super();
		this.patientId = patientId;
		this.patientName = patientName;
		this.pidtid = pidtid;
		this.messageId = messageId;
		this.testDate = testDate;
		this.setTestName(testName);
	}
	
	public MessageVO() {
		super();
	}

	private String patientId;
	private String patientName;
	private String pidtid;
	private String messageId;
	private String testDate;
	private String testName;
	public String getPatientId() {
		return patientId;
	}
	public void setPatientId(String patientId) {
		this.patientId = patientId;
	}
	public String getPatientName() {
		return patientName;
	}
	public void setPatientName(String patientName) {
		this.patientName = patientName;
	}
	public String getPidtid() {
		return pidtid;
	}
	public void setPidtid(String pidtid) {
		this.pidtid = pidtid;
	}
	public String getMessageId() {
		return messageId;
	}
	public void setMessageId(String messageId) {
		this.messageId = messageId;
	}
	public String getTestDate() {
		return testDate;
	}
	public void setTestDate(String testDate) {
		this.testDate = testDate;
	}

	public String getTestName() {
		return testName;
	}

	public void setTestName(String testName) {
		this.testName = testName;
	}

	

}
