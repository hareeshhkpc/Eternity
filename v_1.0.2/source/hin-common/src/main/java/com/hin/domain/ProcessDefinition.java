package com.hin.domain;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.hin.domain.core.BaseDomain;

public class ProcessDefinition extends BaseDomain {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	public String processName;
	public String processDefinitionId;
	public String description;
	public String initializeScript = new String();
	public List<String> scripts = new ArrayList<String>();
	public List<Step> steps = new ArrayList<Step>();
    public boolean finised=false;
    public String organizationId="HINORG";
    
	public ProcessDefinition() {

	}

	public ProcessDefinition(String processName) {
		this.processName = processName;
	}

	public List<String> getScripts() {
		return scripts;
	}

	public void setScripts(List<String> scripts) {
		this.scripts = scripts;
	}

	public List<Step> getSteps() {
		return steps;
	}

	public void setSteps(List<Step> steps) {
		this.steps = steps;
	}

	public String getProcessName() {
		return processName;
	}

	public void setProcessName(String processName) {
		this.processName = processName;
	}

	public void addStep(Step step) {
		steps.add(step);
	}
	
	public String getProcessDefinitionId() {
		return processDefinitionId;
	}

	public void setProcessDefinitionId(String processDefinitionId) {
		this.processDefinitionId = processDefinitionId;
	}

	public Step getStepByStepId(String stepName) {
		List<Step> steps = getSteps();
		for (Step step : steps) {
			if (step.stepName.equals(stepName)) {
				return step;
			}
		}
		return null;
	}

	public boolean removeStep(String stepName) {
		List<Step> steps = getSteps();
		for (Step step : steps) {
			if (step.stepName.equals(stepName)) {
				return steps.remove(step);
			}
		}
		return false;
	}

	/**
	 * @return the initializeScript
	 */
	public String getInitializeScript() {
		return initializeScript;
	}

	/**
	 * @param initializeScript
	 *            the initializeScript to set
	 */
	public void setInitializeScript(String initializeScript) {
		this.initializeScript = initializeScript;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	
	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "ProcessDefinition [processName=" + processName + ", steps="
				+ steps + "]";
	}

	public boolean isFinised() {
		return finised;
	}

	public void setFinised(boolean finised) {
		this.finised = finised;
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
