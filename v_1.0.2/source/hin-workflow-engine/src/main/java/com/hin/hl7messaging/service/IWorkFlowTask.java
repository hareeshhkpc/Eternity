package com.hin.hl7messaging.service;

import java.util.HashMap;
import java.util.List;
import java.util.Set;

//import org.jbpm.api.task.Task;

import com.hin.hl7messaging.WorkFlowConstants;

public interface IWorkFlowTask {
	public int getAsigneeType();

	public void setAsigneeType(int asigneeType);

	public String getAsigneeName();

	public void setAsigneeName(String asigneeName);

	public boolean isAutoAssign();

	public void setAutoAssign(boolean autoAssign);

	public String getOutCome();

	public void setOutCome(String outCome);

	//public Task getTaskAssigned();

	//public void setTaskAssigned(Task taskAssigned);

	public Object getParameters();

	public void setParameters(Object parameters);

	public String getUserProcessKey();

	public void setUserProcessKey(String peocessKey);

	public String getProcessName();

	public void setProcessName(String processName);

	public String getMessage();

	public void setMessage(String message);

	public String getWorkFlowProcessKey();

	public void setWorkFlowProcessKey(String workFlowProcessKey);

	public HashMap<String, Object> getFilterConditions();

	public void setFilterConditions(HashMap<String, Object> filterConditions);

	public void addFilterCondition(String key,Object value);
	
	public void setTaskId(String taskId) ;
	
	public String getTaskId();
	
	public void setTaskOutComes(Set<String> taskOutComes) ;
	
	public Set<String> getTaskOutComes();
	
	public String getOrgId();
	
	public void setOrgId(String orgId);
	
	public boolean isCompleted();
	
	public void setCompleted(boolean completed);
	
	public HashMap<String, String> getAssignablePeople();
	
	public void setAssignablePeople(HashMap<String, String> assignablePeople) ;
	
	public String getNewTask();
	
	public String getMessageType();
	
	public void setMessageType(String messageType);
	
	public HashMap<String, String> getParameterList();
	
	public void setParameterList(HashMap<String, String> parameterList);
	
}
