package com.hin.domain.vo;

import java.util.HashMap;
import java.util.Set;

public class TaskVO {
	public String taskId = "";
	public String messageID = "";
	public String message="";
	public Set<String> taskOutComes;
	public HashMap<String, String> assignablePeople;

	public String getTaskId() {
		return taskId;
	}

	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}

	public String getMessageID() {
		return messageID;
	}

	public void setMessageID(String messageID) {
		this.messageID = messageID;
	}

	public Set<String> getTaskOutComes() {
		return taskOutComes;
	}

	public void setTaskOutComes(Set<String> taskOutComes) {
		this.taskOutComes = taskOutComes;
	}

	public HashMap<String, String> getAssignablePeople() {
		return assignablePeople;
	}

	public void setAssignablePeople(HashMap<String, String> assignablePeople) {
		this.assignablePeople = assignablePeople;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
}
