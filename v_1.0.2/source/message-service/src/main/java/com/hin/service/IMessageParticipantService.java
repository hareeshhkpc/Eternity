package com.hin.service;


import java.util.List;

import com.hin.domain.MessageParticipants;

public interface IMessageParticipantService {
	public List<String> getMessageParticipants(String messageId,String organizationId) throws Exception;
	public List<String> getUserMessages(String userId,String organizationId) throws Exception;
	public void saveMessageParticipant(List<String> participants,String messageId,String organizationId) throws Exception;
	public void saveMessageParticipant(String userId,String messageId,String organizationId) throws Exception;
	
}
