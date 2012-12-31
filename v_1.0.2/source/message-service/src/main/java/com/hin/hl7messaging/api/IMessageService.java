package com.hin.hl7messaging.api;

import java.util.List;

import com.hin.domain.vo.DocumentsVO;
import com.hin.domain.vo.MessageVO;

import com.hin.domain.Message;

import com.hin.domain.ProcessMessageFilterCondition;

public interface IMessageService {

	public void saveMessage(MessageVO messageVO)  throws Exception ;

	public MessageVO getMessage(MessageVO messageVO) throws Exception;
	
	public void createUser(MessageVO messageVO) throws Exception;
	
	public MessageVO createMessageVO(String messageXml) throws Exception;
	
	public List<Message> getUserMessagesForCondition(String userId,String messageType,String condtion,boolean messageRequired) throws Exception;
	
	public List<Message> getUserMessagesForCondition(String userId,ProcessMessageFilterCondition processMessageFilterCondition,boolean messageRequired,String organizationId) throws Exception;
	
	public String getMessage(String messageId,String organizationId) throws Exception;
	
	public List<Message> getMessages(List<String> messageIdList,boolean messageRequired) throws Exception;
	
	public String getCouchLastSequence() throws Exception;
	
	public void updateCouchLastSequence(String sequence) throws Exception;
	
	public String getNewPatientCode(String organizationId);
	
	public void 	 updateMessage(MessageVO messageVO) ;
	
	public String getMessageStatus(String messageId,String organizationId) ;
	
	public void updateMessageStatus(MessageVO messageVO);
	
	public DocumentsVO createDocumentsVO(String messageXml);
	
	public void removeMessage(MessageVO messageVO) throws Exception;
	
	public String getNewInvoiceCode(String organizationId) throws Exception;
	
	public String getNewReceiptCode(String organizationId) throws Exception;

	 public String getNewLicenseeInvoiceCode(String organizationId) throws Exception;

	/*
	 * public void saveProfileMessage(String userName, String message);
	 * 
	 * public void saveInboxMessage(String profileID, String messageID, String
	 * message, MessageType messageType);
	 * 
	 * public HashMap<String, Object> retrieveProfile(String profileID);
	 * 
	 * public HashMap<String, Object> retrieveMessageByTime(String profID, Long
	 * start, Long end);
	 * 
	 * public void saveMessage(String message);
	 * 
	 * public void deidentification(Document message);
	 * 
	 * public String extractArtifactID(Document doc);
	 * 
	 * public void saveMessage(String profileId, String messageId, String
	 * message);
	 * 
	 * public HashMap<String, Object> retrieveIndexInbox(String profileID,
	 * String messageID);
	 * 
	 * public HashMap<String, Object> retrieveInbox(String profileID);
	 * 
	 * 
	 * public void archieveMessage(String profileID, String message,
	 * HashMap<String,String> variable);
	 * 
	 * public Map<String, HashMap<String, String>> getMessages(String rowKey,
	 * String artifactID) throws Exception;
	 * 
	 * public Map<String, Map<String, Map<String, String>>>
	 * retrieveProfileDetails(String profileID);
	 * 
	 * public Map<String, Map<String, Map<String, String>>> getStatistics(String
	 * rowKey, List<String> artifactIdList) throws Exception;
	 * 
	 * public void calenderEvents(String profileID, CalendarVO calendarVO);
	 * 
	 * public Map<String, HashMap<String, String>>
	 * retrieveStandardColumnFamily(String columnFamily, String profileID);
	 */

}
