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
@XStreamAlias("Attribute")
public class ConfigAttribute implements IConfigElement {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -5364249698356702512L;

	@XStreamAsAttribute
	private String id;
	
	@XStreamAsAttribute
	private String tagName;
	
	@XStreamAsAttribute
	private String type;
	
	@XStreamAsAttribute
	private String inputControl;
	
	@XStreamAsAttribute
	private String label;
	
	@XStreamAsAttribute
	private Integer displayOrder;
	
	@XStreamAlias("ControlParameters")
	private ConfigControlParameter controlParameter;

	@XStreamOmitField /*	We don't need this field in the configuration file	*/
	private Boolean selected = Boolean.FALSE;
	
	@XStreamOmitField
	private CONFIG_OBJECT_TYPE configType = CONFIG_OBJECT_TYPE.ATTRIBUTE;

	@XStreamAsAttribute
	private RIM_TYPE rimType;

	/**
	 * @return the id
	 */
	public String getId() {
		return id;
	}

	/**
	 * @param id the id to set
	 */
	public void setId(String id) {
		this.id = id;
	}

	/**
	 * @return the tagName
	 */
	public String getTagName() {
		return tagName;
	}

	/**
	 * @param tagName the tagName to set
	 */
	public void setTagName(String tagName) {
		this.tagName = tagName;
	}

	/**
	 * @return the type
	 */
	public String getType() {
		return type;
	}

	/**
	 * @param type the type to set
	 */
	public void setType(String type) {
		this.type = type;
	}

	/**
	 * @return the inputControl
	 */
	public String getInputControl() {
		return inputControl;
	}

	/**
	 * @param inputControl the inputControl to set
	 */
	public void setInputControl(String inputControl) {
		this.inputControl = inputControl;
	}

	/**
	 * @return the label
	 */
	public String getLabel() {
		return label;
	}

	/**
	 * @param label the label to set
	 */
	public void setLabel(String label) {
		this.label = label;
	}

	/**
	 * @return the displayOrder
	 */
	public Integer getDisplayOrder() {
		return displayOrder;
	}

	/**
	 * @param displayOrder the displayOrder to set
	 */
	public void setDisplayOrder(Integer displayOrder) {
		this.displayOrder = displayOrder;
	}

	/**
	 * @return the controlParameter
	 */
	public ConfigControlParameter getControlParameter() {
		return (controlParameter == null) ?
				controlParameter = new ConfigControlParameter()
				: controlParameter;
	}

	/**
	 * @param controlParameter the controlParameter to set
	 */
	public void setControlParameter(ConfigControlParameter controlParameter) {
		this.controlParameter = controlParameter;
	}

	@Override
	public Boolean isSelected() {
		return this.selected;
	}

	@Override
	public CONFIG_OBJECT_TYPE getConfigType() {
		return configType;
	}
	@Override
	public RIM_TYPE getRIMType() {
		if(rimType == null){
			rimType = RIM_TYPE.UNIDENTIFIED;
		}
		return rimType;
	}
	@Override
	public void setRIMType(RIM_TYPE type) {
		rimType = type;
	}
}
