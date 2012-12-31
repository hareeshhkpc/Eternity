package com.hin.service.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hin.domain.MessageParticipants;
import com.hin.hl7messaging.cassandra.ICassandraConnector;
import com.hin.hl7messaging.identity.repository.IdentityMessageRepository;
import com.hin.service.IMessageParticipantService;

@Service(value = "messageParticipantService")
public class MessageParticipantService implements IMessageParticipantService {
	
	
	//@Autowired
	//private IdentityMessageRepository messageService;
	
	@Autowired
	private ICassandraConnector cassandraConnector;
	
	public void saveMessageParticipant(List<String> participants,
			String messageId,String organizationId)  throws Exception{
		HashMap<String, Object> map = new HashMap<String, Object>();

		for (String userId : participants) {
			map.put("ROWKEY", getNewMessageParticipantKey());
			map.put("USERID", userId);
			map.put("MESSAGEID", messageId);
			cassandraConnector.saveStandardColumnFamily(map, "MESSAGE_PARTICIPANT",organizationId);
		}
	
			
		
	}
	public void saveMessageParticipant(String userId,
			String messageId,String organizationId) throws Exception{
		List<String> participants=new ArrayList<String>();
		participants.add(userId);
		saveMessageParticipant(participants,messageId,organizationId);
		
	}
	
	public List<String> getMessageParticipants(String messageId,String organizationId){
		Map<String, HashMap<String, String>> resultMessageMap = cassandraConnector.retrieveStandardColumnFamily("MESSAGE_PARTICIPANT","MESSAGEID",messageId,organizationId);
		HashMap<String, List<String>> columnValues = new HashMap<String, List<String>>();
		List<String> columnList = new ArrayList<String>();
		columnList.add("USERID");
		List<String> userList=new ArrayList<String>();
		Iterator iterator = resultMessageMap.entrySet().iterator();
		while (iterator.hasNext()) {
	    	Map.Entry subscriberIdEntry = (Map.Entry) iterator.next();
			columnValues=getColumnValues(columnList,subscriberIdEntry);
			userList.add(columnValues.get("USERID").get(0).toString());
		}
		return userList;
	}
	public List<String> getUserMessages(String userId,String organizationId){
		Map<String, HashMap<String, String>> resultMessageMap =cassandraConnector.retrieveStandardColumnFamily("MESSAGE_PARTICIPANT","USERID",userId,organizationId);
		HashMap<String, List<String>> columnValues = new HashMap<String, List<String>>();
		List<String> columnList = new ArrayList<String>();
		columnList.add("MESSAGEID");
		List<String> messageList=new ArrayList<String>();
		Iterator iterator = resultMessageMap.entrySet().iterator();
		while (iterator.hasNext()) {
	    	Map.Entry subscriberIdEntry = (Map.Entry) iterator.next();
			columnValues=getColumnValues(columnList,subscriberIdEntry);
			messageList.add(columnValues.get("MESSAGEID").get(0).toString());
		}
		return messageList;
	}
	 private HashMap<String, List<String>>  getColumnValues(List<String> column,Map.Entry subscriberIdEntry){
	    	String columnName = "";
			List<String> msgIdList;
	    	HashMap<String, String> columnValueMap = new HashMap<String, String>();
			HashMap<String, List<String>> columnValues = new HashMap<String, List<String>>();

			columnValueMap = (HashMap<String, String>) subscriberIdEntry
					.getValue();
			Iterator columnValueIterator = columnValueMap.entrySet().iterator();
			while (columnValueIterator.hasNext()) {
				Map.Entry columnValueEntry = (Map.Entry) columnValueIterator
						.next();
				columnName = (String) columnValueEntry.getKey();
				if (column.contains(columnName)) {
					if (columnValues.containsKey(columnName))
						msgIdList = columnValues.get(columnName);
					else {
						msgIdList = new ArrayList<String>();
						columnValues.put(columnName, msgIdList);
					}

					msgIdList.add(columnValueEntry.getValue().toString());
				}
			}
			return columnValues;
	    }
	   private boolean isUserParticipantOfMessage(String userId, String messageId) {
			
			return false;
		}
	   private String getNewMessageParticipantKey() {

			//Date date = new Date();
/*			try {
				Thread.currentThread().sleep(1000);
			} catch (InterruptedException e) {
				//logger.error("Failure in getting NewMessageKey: " + e.getMessage());
			}*/
			//SimpleDateFormat smpd = new SimpleDateFormat("yyyyMMddHHmmss");

			 return UUID.randomUUID().toString();
		}
}
