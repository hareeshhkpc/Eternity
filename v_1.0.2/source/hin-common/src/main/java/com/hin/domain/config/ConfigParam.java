/**
 * 
 */
package com.hin.domain.config;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamAsAttribute;
import com.thoughtworks.xstream.annotations.XStreamOmitField;

/**
 * @author Administrator
 *
 */
@XStreamAlias("Param")
public class ConfigParam implements IConfigElement {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -5364249698356702512L;
	
	@XStreamAsAttribute
	private String name;
	
	@XStreamAsAttribute
	private String value;
	
	@XStreamOmitField
	private CONFIG_OBJECT_TYPE configType = CONFIG_OBJECT_TYPE.PARAMETER;

	/**
	 * @return the name
	 */
	public String getName() {
		return name;
	}

	/**
	 * @param name the name to set
	 */
	public void setName(String name) {
		this.name = name;
	}

	/**
	 * @return the value
	 */
	public String getValue() {
		return value;
	}

	/**
	 * @param value the value to set
	 */
	public void setValue(String value) {
		this.value = value;
	}

	@Override
	public RIM_TYPE getRIMType() {
		return null;
	}

	@Override
	public void setRIMType(RIM_TYPE type) {

	}

	@Override
	public CONFIG_OBJECT_TYPE getConfigType() {
		return this.configType;
	}

	@Override
	public Boolean isSelected() {
		return null;
	}

}
