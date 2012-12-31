/**
 * 
 */
package com.hin.domain.config;

import java.util.HashMap;
import java.util.Map;


/**
 * @author Administrator
 *
 */
public class MessageSchemaDescriptor {

	/**
	 * Main schema file of the message
	 */
	private MessageSchema messageSchema;
	
	/**
	 * Map containing all the core schema files where the 
	 * key - Name of the schema file (excluding .xsd)
	 * value - MessageSchema object corresponding to the schema file
	 */
	private Map<String, MessageSchema> coreSchemaMap;
	
	/**
	 * Map containing all the included schema files where the 
	 * key - Name of the schema file (excluding .xsd)
	 * value - MessageSchema object corresponding to the schema file
	 */
	private Map<String, MessageSchema> includedSchemaMap;
	
	

	public MessageSchemaDescriptor() {
		this.coreSchemaMap = new HashMap<String, MessageSchema>();
		this.includedSchemaMap = new HashMap<String, MessageSchema>();
	}

	/**
	 * @return the messageSchema
	 */
	public MessageSchema getMessageSchema() {
		return messageSchema;
	}

	/**
	 * @param messageSchema the messageSchema to set
	 */
	public void setMessageSchema(MessageSchema messageSchema) {
		this.messageSchema = messageSchema;
	}

	/**
	 * @return the coreSchemaMap
	 */
	public Map<String, MessageSchema> getCoreSchemaMap() {
		return coreSchemaMap;
	}

	/**
	 * @param coreSchemaMap the coreSchemaMap to set
	 */
	public void setCoreSchemaMap(Map<String, MessageSchema> coreSchemaMap) {
		this.coreSchemaMap = coreSchemaMap;
	}

	/**
	 * @return the includedSchemaMap
	 */
	public Map<String, MessageSchema> getIncludedSchemaMap() {
		return includedSchemaMap;
	}

	/**
	 * @param includedSchemaMap the includedSchemaMap to set
	 */
	public void setIncludedSchemaMap(Map<String, MessageSchema> includedSchemaMap) {
		this.includedSchemaMap = includedSchemaMap;
	}
	
}
