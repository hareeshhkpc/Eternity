/**
 * 
 */
package com.hin.domain.vo;

import java.util.HashMap;
import java.util.List;

/**
 * @author shilpa.rao
 * 
 */
public class DocumentsVO {

	private String startYear;
	//HashMap<String, List<String>> yearData;
	private List<String> legends;
	private List<String> monthData;
	private String documentDate="";
	private String documentName="";
	private String documentType="";
	private Long documentFileSize = 0l;
	private String subscriberId="";
	private String documentFileType="";
	private String messageId="";
	private String documentFromDate="";
	private String documentToDate="";
	private String patientId="";
	private String organizationId="";
	

	/**
	 * @return the organizationId
	 */
	public String getOrganizationId() {
		return organizationId;
	}
	/**
	 * @param organizationId the organizationId to set
	 */
	public void setOrganizationId(String organizationId) {
		this.organizationId = organizationId;
	}
	/**
	 * @return the legends
	 */
	public List<String> getLegends() {
		return legends;
	}
	/**
	 * @param legends the legends to set
	 */
	public void setLegends(List<String> legends) {
		this.legends = legends;
	}
	/**
	 * @return the monthData
	 */
	public List<String> getMonthData() {
		return monthData;
	}
	/**
	 * @param monthData the monthData to set
	 */
	public void setMonthData(List<String> monthData) {
		this.monthData = monthData;
	}
	/**
	 * @return the yearData
	 *//*
	public HashMap<String, List<String>> getYearData() {
		return yearData;
	}
	*//**
	 * @param yearData the yearData to set
	 *//*
	public void setYearData(HashMap<String, List<String>> yearData) {
		this.yearData = yearData;
	}*/
	
	/**
	 * @return the startYear
	 */
	public String getStartYear() {
		return startYear;
	}
	/**
	 * @param startYear the startYear to set
	 */
	public void setStartYear(String startYear) {
		this.startYear = startYear;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	public String getDocumentDate() {
		return documentDate;
	}
	public void setDocumentDate(String documentDate) {
		this.documentDate = documentDate;
	}
	public String getDocumentName() {
		return documentName;
	}
	public void setDocumentName(String documentName) {
		this.documentName = documentName;
	}
	public String getDocumentType() {
		return documentType;
	}
	public void setDocumentType(String documentType) {
		this.documentType = documentType;
	}
	public Long getDocumentFileSize() {
		return documentFileSize;
	}
	public void setDocumentFileSize(Long documentFileSize) {
		this.documentFileSize = documentFileSize;
	}
	public String getSubscriberId() {
		return subscriberId;
	}
	public void setSubscriberId(String subscriberId) {
		this.subscriberId = subscriberId;
	}
	public String getDocumentFileType() {
		return documentFileType;
	}
	public void setDocumentFileType(String documentFileType) {
		this.documentFileType = documentFileType;
	}
	public String getMessageId() {
		return messageId;
	}
	public void setMessageId(String messageId) {
		this.messageId = messageId;
	}
	public String getDocumentFromDate() {
		return documentFromDate;
	}
	public void setDocumentFromDate(String documentFromDate) {
		this.documentFromDate = documentFromDate;
	}
	public String getDocumentToDate() {
		return documentToDate;
	}
	public void setDocumentToDate(String documentToDate) {
		this.documentToDate = documentToDate;
	}
	public String getPatientId() {
		return patientId;
	}
	public void setPatientId(String patientId) {
		this.patientId = patientId;
	}
	@Override
	public String toString() {
		return "DocumentsVO [startYear=" + startYear + ", legends=" + legends
				+ ", monthData=" + monthData + ", documentDate=" + documentDate
				+ ", documentName=" + documentName + ", documentType="
				+ documentType + ", documentFileSize=" + documentFileSize
				+ ", subscriberId=" + subscriberId + ", documentFileType="
				+ documentFileType + ", messageId=" + messageId
				+ ", documentFromDate=" + documentFromDate
				+ ", documentToDate=" + documentToDate + ", patientId="
				+ patientId + "]";
	}
	
	
}
