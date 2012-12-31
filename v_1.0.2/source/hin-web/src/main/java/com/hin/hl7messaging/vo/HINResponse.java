package com.hin.hl7messaging.vo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.hin.hl7messaging.utils.CalendarVO;
import com.hin.hl7messaging.utils.GMap;
import com.hin.hl7messaging.utils.TimeLineVO;

public class HINResponse {

	private String requestType, profileID, messageID, userName, artifactID;
	private HashMap<String, Object> messageMap = new HashMap<String, Object>();
	private String errorDesc;
	private HashMap<String, Object> clientFieldsMap = new HashMap<String, Object>();
	private String htmlForm;
	private String messageXML;
	private List<GMap> markers = new ArrayList<GMap>();
	private List<Object[]> services = new ArrayList<Object[]>();
	private String key;
	private List<Statistics> statistics = new ArrayList<Statistics>();
	private List<StatisticsMessages> statisticsMessages = new ArrayList<StatisticsMessages>();
	
	private String profileViewForm;
	private String endorsementsViewForm;
	private String medicalViewForm;
	private String messagesViewForm;

	private String selectedProfileArtifactID;
	private String selectedProfileViewForm;
	private String selectedEndorsementsViewForm;
	private String selectedMedicalViewForm;
	private String selectedMessagesViewForm;
	private String profilePicture;

	private List<CalendarVO> calendars = new ArrayList<CalendarVO>();
	private List<TimeLineVO> timeLines = new ArrayList<TimeLineVO>();

	
	public List<TimeLineVO> getTimeLines() {
		return timeLines;
	}

	public void setTimeLines(List<TimeLineVO> timeLines) {
		this.timeLines = timeLines;
	}

	/**
	 * @return the statisticsMessages
	 */
	public List<StatisticsMessages> getStatisticsMessages() {
		return statisticsMessages;
	}

	/**
	 * @param statisticsMessages the statisticsMessages to set
	 */
	public void setStatisticsMessages(List<StatisticsMessages> statisticsMessages) {
		this.statisticsMessages = statisticsMessages;
	}

	public List<Statistics> getStatistics() {
		return statistics;
	}

	public void setStatistics(List<Statistics> statistics) {
		this.statistics = statistics;
	}

	public String getProfileID() {
		return profileID;
	}

	public void setProfileID(String profileID) {
		this.profileID = profileID;
	}

	public String getRequestType() {
		return requestType;
	}

	public void setRequestType(String requestType) {
		this.requestType = requestType;
	}

	public HashMap<String, Object> getMessageMap() {
		return messageMap;
	}

	public void setMessageMap(HashMap<String, Object> messageMap) {
		this.messageMap = messageMap;
	}

	public String getErrorDesc() {
		return errorDesc;
	}

	public void setErrorDesc(String errorDesc) {
		this.errorDesc = errorDesc;
	}

	public HashMap<String, Object> getClientFieldsMap() {
		return clientFieldsMap;
	}

	public void setClientFieldsMap(HashMap<String, Object> clientFieldsMap) {
		this.clientFieldsMap = clientFieldsMap;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	/**
	 * @return the htmlForm
	 */
	public String getHtmlForm() {
		return htmlForm;
	}

	/**
	 * @param htmlForm
	 *            the htmlForm to set
	 */
	public void setHtmlForm(String htmlForm) {
		this.htmlForm = htmlForm;
	}

	/**
	 * @return the messageXML
	 */
	public String getMessageXML() {
		return messageXML;
	}

	/**
	 * @param messageXML
	 *            the messageXML to set
	 */
	public void setMessageXML(String messageXML) {
		this.messageXML = messageXML;
	}

	/**
	 * @return the messageID
	 */
	public String getMessageID() {
		return messageID;
	}

	/**
	 * @param messageId
	 *            the messageID to set
	 */
	public void setMessageID(String messageID) {
		this.messageID = messageID;
	}

	public List<GMap> getMarkers() {
		return markers;
	}

	public void setMarkers(List<GMap> markers) {
		this.markers = markers;
	}

	/**
	 * @return the artifactID
	 */
	public String getArtifactID() {
		return artifactID;
	}

	/**
	 * @param artifactID
	 *            the artifactID to set
	 */
	public void setArtifactID(String artifactID) {
		this.artifactID = artifactID;
	}

	
	public List<Object[]> getServices() {
		return services;
	}

	

	@Override
	public String toString() {
		return "HINResponse [requestType=" + requestType + ", profileID="
				+ profileID + ", messageID=" + messageID + ", userName="
				+ userName + ", artifactID=" + artifactID + ", messageMap="
				+ messageMap + ", errorDesc=" + errorDesc
				+ ", clientFieldsMap=" + clientFieldsMap + ", htmlForm="
				+ htmlForm + ", messageXML=" + messageXML + ", markers="
				+ markers + ", services=" + services + ", key=" + key
				+ ", statistics=" + statistics + ", statisticsMessages="
				+ statisticsMessages + ", profileViewForm=" + profileViewForm
				+ ", endorsementsViewForm=" + endorsementsViewForm
				+ ", medicalViewForm=" + medicalViewForm
				+ ", messagesViewForm=" + messagesViewForm
				+ ", selectedProfileArtifactID=" + selectedProfileArtifactID
				+ ", selectedProfileViewForm=" + selectedProfileViewForm
				+ ", selectedEndorsementsViewForm="
				+ selectedEndorsementsViewForm + ", selectedMedicalViewForm="
				+ selectedMedicalViewForm + ", selectedMessagesViewForm="
				+ selectedMessagesViewForm + ", profilePicture="
				+ profilePicture + ", calendars=" + calendars + ", timeLines="
				+ timeLines + "]";
	}

	public void setServices(List<Object[]> services) {
		this.services = services;
	}

	public void setKey(String key) {
		this.key = key;
	}
	public String getKey() {
		return this.key;
	}

	public String getProfileViewForm() {
		return profileViewForm;
	}

	public void setProfileViewForm(String profileViewForm) {
		this.profileViewForm = profileViewForm;
	}

	public String getEndorsementsViewForm() {
		return endorsementsViewForm;
	}

	public void setEndorsementsViewForm(String endorsementsViewForm) {
		this.endorsementsViewForm = endorsementsViewForm;
	}

	public String getMedicalViewForm() {
		return medicalViewForm;
	}

	public void setMedicalViewForm(String medicalViewForm) {
		this.medicalViewForm = medicalViewForm;
	}

	/**
	 * @return the calendars
	 */
	public List<CalendarVO> getCalendars() {
		return calendars;
	}

	/**
	 * @param calendars
	 *            the calendars to set
	 */
	public void setCalendars(List<CalendarVO> calendars) {
		this.calendars = calendars;
	}

	/**
	 * @return the selectedProfileViewForm
	 */
	public String getSelectedProfileViewForm() {
		return selectedProfileViewForm;
	}

	/**
	 * @param selectedProfileViewForm
	 *            the selectedProfileViewForm to set
	 */
	public void setSelectedProfileViewForm(String selectedProfileViewForm) {
		this.selectedProfileViewForm = selectedProfileViewForm;
	}

	/**
	 * @return the selectedEndorsementsViewForm
	 */
	public String getSelectedEndorsementsViewForm() {
		return selectedEndorsementsViewForm;
	}

	/**
	 * @param selectedEndorsementsViewForm
	 *            the selectedEndorsementsViewForm to set
	 */
	public void setSelectedEndorsementsViewForm(
			String selectedEndorsementsViewForm) {
		this.selectedEndorsementsViewForm = selectedEndorsementsViewForm;
	}

	/**
	 * @return the selectedMedicalViewForm
	 */
	public String getSelectedMedicalViewForm() {
		return selectedMedicalViewForm;
	}

	/**
	 * @param selectedMedicalViewForm
	 *            the selectedMedicalViewForm to set
	 */
	public void setSelectedMedicalViewForm(String selectedMedicalViewForm) {
		this.selectedMedicalViewForm = selectedMedicalViewForm;
	}

	/**
	 * @return the selectedProfileArtifactID
	 */
	public String getSelectedProfileArtifactID() {
		return selectedProfileArtifactID;
	}

	/**
	 * @param selectedProfileArtifactID the selectedProfileArtifactID to set
	 */
	public void setSelectedProfileArtifactID(String selectedProfileArtifactID) {
		this.selectedProfileArtifactID = selectedProfileArtifactID;
	}

		
	/**
	 * @return the messagesViewForm
	 */
	public String getMessagesViewForm() {
		return messagesViewForm;
	}

	/**
	 * @param messagesViewForm the messagesViewForm to set
	 */
	public void setMessagesViewForm(String messagesViewForm) {
		this.messagesViewForm = messagesViewForm;
	}

	/**
	 * @return the selectedMessagesViewForm
	 */
	public String getSelectedMessagesViewForm() {
		return selectedMessagesViewForm;
	}

	/**
	 * @param selectedMessagesViewForm the selectedMessagesViewForm to set
	 */
	public void setSelectedMessagesViewForm(String selectedMessagesViewForm) {
		this.selectedMessagesViewForm = selectedMessagesViewForm;
	}

	public String getProfilePicture() {
		return profilePicture;
	}

	public void setProfilePicture(String profilePicture) {
		this.profilePicture = profilePicture;
	}
}
