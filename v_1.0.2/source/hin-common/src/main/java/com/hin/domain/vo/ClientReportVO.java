/**
 * 
 */
package com.hin.domain.vo;

public class ClientReportVO {
	
	public String svgContent = "";
	public String patientID = "";
	public String messageId = "";
	
	public String getSvgContent() {
		return svgContent;
	}
	public void setSvgContent(String svgContent) {
		this.svgContent = svgContent;
	}
	public String getPatientID() {
		return patientID;
	}
	public void setPatientID(String patientID) {
		this.patientID = patientID;
	}
	public String getMessageId() {
		return messageId;
	}
	public void setMessageId(String messageId) {
		this.messageId = messageId;
	}

}
