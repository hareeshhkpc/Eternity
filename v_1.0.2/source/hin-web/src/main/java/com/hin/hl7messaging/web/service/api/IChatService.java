package com.hin.hl7messaging.web.service.api;


import java.util.List;

import com.hin.domain.ChatContent;

public interface IChatService {
	public void saveChatContent(ChatContent chatContent) throws Exception;
	public List<ChatContent> getChatContent(String userId,String organizationId) throws Exception;
	public void updateChatContent(ChatContent chatContent) throws Exception;
}
