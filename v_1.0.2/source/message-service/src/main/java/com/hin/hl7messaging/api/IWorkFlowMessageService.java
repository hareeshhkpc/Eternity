package com.hin.hl7messaging.api;

import java.util.List;

//import com.hin.hl7messaging.service.IWorkFlowTask;



public interface IWorkFlowMessageService {
	public String getMessage(String messageID);
	public void saveMessage(String message,String messageId);
	public  void saveOrganisationUserMessage(String orgId,String userId,String messageId,String taskId,String message);
	//public List<IWorkFlowTask> getOrganisationUserMessages(String orgId, String userId);
	//public List<IWorkFlowTask> getOrganisationUserMessages(String userId) throws Exception;
	public void saveMessageWorkFlow(String messageType, String workFlowName);
	public String getMessageWorkFlow(String messageType);
}
