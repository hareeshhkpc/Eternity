package com.hin.hl7messaging.web.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hin.domain.ChatContent;
import com.hin.hl7.messaging.api.IIdentityRepository;
import com.hin.hl7messaging.MessageService;
import com.hin.hl7messaging.cassandra.CassandraConnector;
import com.hin.hl7messaging.utils.WorkFlowContants;
import com.hin.hl7messaging.web.service.api.IChatService;

@Service(value = "chatService")
public class ChatService implements IChatService {

	private Logger logger = Logger.getLogger(ChatService.class.getName());
	
	@Autowired
	private CassandraConnector cassandraConnector;
	
	@Override
	public void saveChatContent(ChatContent chatContent) throws Exception {
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("SENDERID",chatContent.getSender());
		map.put("RECEIVERID", chatContent.getReceiver());
		map.put("READSTATUS", "UNREAD");
		map.put("CONTENT",chatContent.getContent());
		map.put("SENDTIME",chatContent.getSendTime());
		map.put("READTIME", chatContent.getReadTime());
		map.put("INSTANCEID", chatContent.getInstanceId());
		map.put("ISACTIVE", "TRUE");
		if(chatContent.getSaveType().equals("both") || chatContent.getSaveType().equals("sender") ){
		map.put("ROWKEY", chatContent.getSender());
		cassandraConnector.saveStandardColumnFamily(map, "CHAT_SEND_MESSAGES",chatContent.getOrganizationId());
		}
		if(chatContent.getSaveType().equals("both") || chatContent.getSaveType().equals("receiver") ){
			map.put("ROWKEY", chatContent.getReceiver());
			cassandraConnector.saveStandardColumnFamily(map, "CHAT_RECEIVED_MESSAGES",chatContent.getOrganizationId());
		}
		logger.info("Saved chat details. Sender :"+ chatContent.getSender() +" Receciver : "+chatContent.getReceiver());
	}

	@Override
	public List<ChatContent> getChatContent(String userId,String organizationId) throws Exception {
		// TODO Auto-generated method stub
		List<ChatContent> chatContents=new ArrayList<ChatContent>();
		HashMap<String, List<String>> columnValues = new HashMap<String, List<String>>();
		Map<String, HashMap<String, String>> resultMessageMap=	cassandraConnector.retrieveStandardColumnFamilyForCondition("CHAT_RECEIVED_MESSAGES", " key="+userId + " and READSTATUS=UNREAD",organizationId);
		Iterator iterator = resultMessageMap.entrySet().iterator();
		List<String> columnList = new ArrayList<String>();
		columnList.add("SENDERID");
		columnList.add("RECEIVERID");
		columnList.add("CONTENT");
		columnList.add("READSTATUS");
		columnList.add("SENDTIME");
		columnList.add("READTIME");
		columnList.add("INSTANCEID");
		while (iterator.hasNext()) {
			ChatContent chatContent=new ChatContent();
	    	Map.Entry subscriberIdEntry = (Map.Entry) iterator.next();
			columnValues=cassandraConnector.getColumnValues(columnList,subscriberIdEntry);
			chatContent.setSender(columnValues.get("SENDERID").get(0).toString());
			chatContent.setReceiver(columnValues.get("RECEIVERID").get(0).toString());
			chatContent.setReadStatus(columnValues.get("READSTATUS").get(0).toString());
			chatContent.setSendTime(columnValues.get("SENDTIME").get(0).toString());
			chatContent.setReadTime (columnValues.get("READTIME").get(0).toString());
			chatContent.setInstanceId(columnValues.get("INSTANCEID").get(0).toString());
			chatContent.setContent(columnValues.get("CONTENT").get(0).toString());
			chatContents.add(chatContent);
		}
		return chatContents;
	}

	@Override
	public void updateChatContent(ChatContent chatContent) throws Exception{
		// TODO Auto-generated method stub
		
	}

}
