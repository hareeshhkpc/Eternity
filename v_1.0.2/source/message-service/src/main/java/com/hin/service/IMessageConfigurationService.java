/**
 * 
 */
package com.hin.service;

import java.util.List;

import org.w3c.dom.Document;

import com.hin.domain.MessageType;
import com.hin.domain.vo.IndexFieldsVO;

/**
 * @author krishna.lr
 * 
 */
public interface IMessageConfigurationService {
	public List<MessageType> fetchMessageTypes(String organizationId);

	public void saveMessageType(MessageType messageType,String organizationId);

	public MessageType extractFieldsFromDocument(Document document);
}
