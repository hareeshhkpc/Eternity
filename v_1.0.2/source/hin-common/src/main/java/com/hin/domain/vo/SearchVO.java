/**
 * 
 */
package com.hin.domain.vo;

import java.util.ArrayList;
import java.util.List;

import com.hin.domain.ListItem;

/**
 * @author krishna.lr
 * 
 */
public class SearchVO {

	private String value = "";
	private int min = 3;
	private int max = 4;
	private String type = "";
	private String serverURI = "";
	private List<String> patientId = new ArrayList<String>();
	private String patientId1 = "";
	private List<String> testName = new ArrayList<String>();
	private List<String> testId = new ArrayList<String>();
	private String messageType = "";
	private String fromDate = "";
	private String toDate = "";
	private String artifactId = "";
	private String role = "";
	private List<ListItem> conditionMaps = null;
	private List<String> parameterList= new ArrayList<String>();
	private String indexFolder="";
	private String queryString="";
	private String filterColumn="";
	private String assigningOrganizationID = "";
	private String searchServiceClass="SearchService";
	
	public List<String> getPatientId() {
		return patientId;
	}

	public void setPatientId(List<String> patientId) {
		this.patientId = patientId;
	}

	public List<String> getTestId() {
		return testId;
	}

	public void setTestId(List<String> testId) {
		this.testId = testId;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public int getMin() {
		return min;
	}

	public void setMin(int min) {
		this.min = min;
	}

	public int getMax() {
		return max;
	}

	public void setMax(int max) {
		this.max = max;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getServerURI() {
		return serverURI;
	}

	public void setServerURI(String serverURI) {
		this.serverURI = serverURI;
	}

	public String getMessageType() {
		return messageType;
	}

	public void setMessageType(String messageType) {
		this.messageType = messageType;
	}

	public List<String> getTestName() {
		return testName;
	}

	public void setTestName(List<String> testName) {
		this.testName = testName;
	}

	@Override
	public String toString() {
		return "SearchVO [value=" + value + ", min=" + min + ", max=" + max
				+ ", type=" + type + ", serverURI=" + serverURI + "]";
	}

	public String getFromDate() {
		return fromDate;
	}

	public void setFromDate(String fromDate) {
		this.fromDate = fromDate;
	}

	public String getToDate() {
		return toDate;
	}

	public void setToDate(String toDate) {
		this.toDate = toDate;
	}

	public String getArtifactId() {
		return artifactId;
	}

	public void setArtifactId(String artifactId) {
		this.artifactId = artifactId;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public List<ListItem> getConditionMaps() {
		return conditionMaps;
	}

	public void setConditionMaps(List<ListItem> conditionMaps) {
		this.conditionMaps = conditionMaps;
	}

	public List<String> getParameterList() {
		return parameterList;
	}

	public void setParameterList(List<String> parameterList) {
		this.parameterList = parameterList;
	}

	public String getIndexFolder() {
		return indexFolder;
	}

	public void setIndexFolder(String indexFolder) {
		this.indexFolder = indexFolder;
	}

	public String getQueryString() {
		return queryString;
	}

	public void setQueryString(String queryString) {
		this.queryString = queryString;
	}

	public String getFilterColumn() {
		return filterColumn;
	}

	public void setFilterColumn(String filterColumn) {
		this.filterColumn = filterColumn;
	}

	public String getPatientId1() {
		return patientId1;
	}

	public void setPatientId1(String patientId1) {
		this.patientId1 = patientId1;
	}

	public String getAssigningOrganizationID() {
		return assigningOrganizationID;
	}

	public void setAssigningOrganizationID(String assigningOrganizationID) {
		this.assigningOrganizationID = assigningOrganizationID;
	}

	public String getSearchServiceClass() {
		return searchServiceClass;
	}

	public void setSearchServiceClass(String searchServiceClass) {
		this.searchServiceClass = searchServiceClass;
	}

}
