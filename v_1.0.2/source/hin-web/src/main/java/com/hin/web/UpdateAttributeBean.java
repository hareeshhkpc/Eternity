package com.hin.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.hin.service.helper.LuceneUpdator;
import com.hin.web.base.BaseBean;

/**
 * @author sreekumar.s
 * 
 */

@Component("updateAttributeBean")
@Scope("session")
public class UpdateAttributeBean extends BaseBean {

	/**
	 * 
	 */
	
	@Autowired
	LuceneUpdator luceneUpdator;
	
	private String messageId;
	private String attributeName;
	private String attributeValue;
	private String organizationValue;
	
	private static final long serialVersionUID = 1L;
	
	public void update(){
		luceneUpdator.updateLuceneForMessage(messageId, attributeName, attributeValue,organizationValue);
	}

	public String getAttributeName() {
		return attributeName;
	}

	public void setAttributeName(String attributeName) {
		this.attributeName = attributeName;
	}

	public String getAttributeValue() {
		return attributeValue;
	}

	public void setAttributeValue(String attributeValue) {
		this.attributeValue = attributeValue;
	}

	public String getMessageId() {
		return messageId;
	}

	public void setMessageId(String messageId) {
		this.messageId = messageId;
	}


}
