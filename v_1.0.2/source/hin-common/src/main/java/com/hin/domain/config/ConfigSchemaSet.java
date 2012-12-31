/**
 * 
 */
package com.hin.domain.config;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamAsAttribute;

/**
 * @author Administrator
 *
 */
@XStreamAlias(value="schema-set")
public class ConfigSchemaSet {

	@XStreamAsAttribute
	private SCHEMA_TYPE type = SCHEMA_TYPE.MESSAGE;
	
	@XStreamAsAttribute
	private String path;

	/**
	 * @return the type
	 */
	public SCHEMA_TYPE getType() {
		return type;
	}

	/**
	 * @param type the type to set
	 */
	public void setType(SCHEMA_TYPE type) {
		this.type = type;
	}

	/**
	 * @return the path
	 */
	public String getPath() {
		return path;
	}

	/**
	 * @param path the path to set
	 */
	public void setPath(String path) {
		this.path = path;
	}
	
}
