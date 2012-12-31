package com.hin.messaging;

import java.util.List;

import com.hin.domain.vo.MessageVO;
import com.hin.hl7messaging.service.IWorkFlowTask;


public interface IWorkFlowProvider {
	public boolean deployWorkFlowDefinition() throws Exception;
	public IWorkFlowTask createNewTask(String userId,  MessageVO messageVO)  throws Exception ;
	public List<IWorkFlowTask> getUserTask(String userID)  throws Exception;
	public boolean taskDone(String taskId, String outCome,String AssigneId,String message)  throws Exception;
//	public String getMessageStatus(String messageId);
	public String getNewMessageKey();
	public IWorkFlowTask getUserTask(String userId,String MessageId)  throws Exception;
//	public void updateMessage(MessageVO messageVO);
	public IWorkFlowTask getWorkFlowTask(String TaskId);
	public String finishTask(MessageVO messageVO) throws Exception;
}
