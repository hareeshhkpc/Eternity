package com.hin.hl7messaging.web.service.api;

import java.io.ByteArrayInputStream;
import java.util.HashMap;
import java.util.List;

import com.hin.hl7messaging.service.IWorkFlowTask;

public interface IWorkFlowManagerService {
	public List<IWorkFlowTask> getUserTask(String userName);
	//public IWorkFlowTask createNewTask(String userId,String messageId,String message);
	public void taskDone(String taskId,String input,String AsigneeType,String asigneeName) ;
	//public IWorkFlowTask createNewTask(String userId,String messageId,String message,String orgId,String orgUserId) ;
	public IWorkFlowTask createNewTask(String userId,String message,String orgId,String messageType);
	public List<IWorkFlowTask> getOrganisationUserMessages(String userId,String orgId);
	public List<IWorkFlowTask> getAllUserMessages(String userId) throws Exception;
	public void taskDone(String orgId,String userId,String messageId,String message,String taskId,String input,String AsigneeType,String asigneeName);
	public IWorkFlowTask createNewTask(String userId, String message,String orgId, String messageType,HashMap<String, String> parameterList);
	public void createFriendRequestTask(String loginUserId,String friendUserId, String message,String relationship) throws Exception;
	public void handleFriendRequestTask(String loginUserId,String friendUserId,String friendRequestKey,String taskId,String message,String input,String relationship) throws Exception;
	public List<IWorkFlowTask> getOrganisationUserMessages(String userId)throws Exception;
	public ByteArrayInputStream getWorkFlowProcessImage(String orgId,String workFlowProcess);
}
