package com.hin.hl7messaging;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

//import org.jbpm.api.task.Task;

import com.hin.hl7messaging.service.IWorkFlowTask;

public class WorkFlowTask implements IWorkFlowTask,Serializable{
	
	private int asigneeType=WorkFlowConstants.INDIVIDUAL;
    private String asigneeName="";
    private boolean autoAssign=Boolean.FALSE;
    private String outCome="";
   // private Task taskAssigned;
    private Object parameters;
    private String userProcessKey="";
    private String processName="";
    private String message="";
    private String workFlowProcessKey="";
    private String taskId;
    private HashMap<String, Object> filterConditions=new HashMap<String, Object>(); 
    private Set<String> taskOutComes;
    private String orgId;
    private boolean completed=false;
    private HashMap<String, String> assignablePeople=new HashMap<String, String>();
    private String  newTaskName="";
    private String messageType="";
    private HashMap<String,String> parameterList=new HashMap<String, String>();
    
	public int getAsigneeType() {
		return asigneeType;
	}
	public void setAsigneeType(int asigneeType) {
		this.asigneeType = asigneeType;
	}
	public String getAsigneeName() {
		return asigneeName;
	}
	public void setAsigneeName(String asigneeName) {
		this.asigneeName = asigneeName;
	}
	public boolean isAutoAssign() {
		return autoAssign;
	}
	public void setAutoAssign(boolean autoAssign) {
		this.autoAssign = autoAssign;
	}
	public String getOutCome() {
		return outCome;
	}
	public void setOutCome(String outCome) {
		this.outCome = outCome;
	}
/*	public Task getTaskAssigned() {
		return taskAssigned;
	}
	public void setTaskAssigned(Task taskAssigned) {
		this.taskAssigned = taskAssigned;
	}*/
	public Object getParameters() {
		return parameters;
	}
	public void setParameters(Object parameters) {
		this.parameters = parameters;
	}
	public String getUserProcessKey() {
		return userProcessKey;
	}
	public void setUserProcessKey(String processKey) {
		this.userProcessKey = processKey;
	}
	public String getProcessName() {
		return processName;
	}
	public void setProcessName(String processName) {
		this.processName = processName;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		if(message!=null && message.length()>0){
			message = message.replaceAll("--del--", "\n");
			message = message.replaceAll("\\\\", "'");
		}
		this.message = message;
	}
	public String getWorkFlowProcessKey() {
		return workFlowProcessKey;
	}
	public void setWorkFlowProcessKey(String workFlowProcessKey) {
		this.workFlowProcessKey = workFlowProcessKey;
	}
	public HashMap<String, Object> getFilterConditions() {
		return filterConditions;
	}
	public void setFilterConditions(HashMap<String, Object> filterConditions) {
		this.filterConditions = filterConditions;
	}
	public void addFilterCondition(String key,Object value){
		filterConditions.put(key, value);
	}
	public String getTaskId() {
		return taskId;
	}
	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}
	public Set<String> getTaskOutComes() {
		return taskOutComes;
	}
	public void setTaskOutComes(Set<String> taskOutComes) {
		this.taskOutComes = taskOutComes;
	}
	public String getOrgId() {
		return orgId;
	}
	public void setOrgId(String orgId) {
		this.orgId = orgId;
	}
	public boolean isCompleted() {
		return completed;
	}
	public void setCompleted(boolean completed) {
		this.completed = completed;
	}
	public HashMap<String, String> getAssignablePeople() {
		return assignablePeople;
	}
	public void setAssignablePeople(HashMap<String, String> assignablePeople) {
		this.assignablePeople = assignablePeople;
	}
	public void startNewTask(String newTaskName){
		this.newTaskName=newTaskName;
	}
	public String getNewTask(){
		return this.newTaskName;
	}
	public String getMessageType() {
		return messageType;
	}
	public void setMessageType(String messageType) {
		this.messageType = messageType;
	}
	public HashMap<String, String> getParameterList() {
		return parameterList;
	}
	public void setParameterList(HashMap<String, String> parameterList) {
		this.parameterList = parameterList;
	}
}
