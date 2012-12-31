/**
 * 
 */
package com.hin.domain;

import java.util.ArrayList;
import java.util.List;

import com.hin.domain.vo.ObservationValue;

/**
 * @author vinaykumar.gk
 * 
 */
public class ObservationVO {
	private String patientId;
	private String messageType;
	private String organizationId;

	private List<ObservationTest> observationTests = new ArrayList<ObservationTest>();

	private String testName;
	private double testValue = 0d;

	public List<ObservationValue> observationValue = new ArrayList<ObservationValue>();

	public String getPatientId() {
		return patientId;
	}

	public void setPatientId(String patientId) {
		this.patientId = patientId;
	}

	public String getMessageType() {
		return messageType;
	}

	public void setMessageType(String messageType) {
		this.messageType = messageType;
	}

	public List<ObservationValue> getObservationVO() {
		return observationValue;
	}

	public void setObservationVO(List<ObservationValue> observationValue) {
		this.observationValue = observationValue;
	}

	public List<ObservationTest> getObservationTests() {
		return observationTests;
	}

	public void setObservationTests(List<ObservationTest> observationTests) {
		this.observationTests = observationTests;
	}

	public List<ObservationValue> getObservationValue() {
		return observationValue;
	}

	public void setObservationValue(List<ObservationValue> observationValue) {
		this.observationValue = observationValue;
	}

	public String getTestName() {
		return testName;
	}

	public void setTestName(String testName) {
		this.testName = testName;
	}

	public double getTestValue() {
		return testValue;
	}

	public void setTestValue(double testValue) {
		this.testValue = testValue;
	}

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

}
