/**
 * 
 */
package com.hin.domain.config;

/**
 * @author Administrator
 * 
 */
public enum CONFIG_OBJECT_TYPE {

	/**
	 * Signify that the object represents a Message Configuration
	 */
	MESSAGE,
	
	/**
	 * The object represents a Class in a configuration
	 */
	CLASS,
	
	/**
	 * The object is of type Field in the configuration
	 */
	FIELD,
	
	/**
	 * The object is an instance of configruation attribute
	 */	
	ATTRIBUTE,
	
	/**
	 * The object is a control parameter
	 */
	CONTROL_PARAM, 
	
	PARAMETER,
	
	/**
	 * Meta information about the message
	 */
	META_INFO,
	
	INDEX_FIELD,
	
	ARCHIVE_FIELD;
	
}
