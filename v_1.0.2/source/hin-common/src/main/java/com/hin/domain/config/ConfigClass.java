/**
 * 
 */
package com.hin.domain.config;

import java.util.ArrayList;
import java.util.List;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamAsAttribute;
import com.thoughtworks.xstream.annotations.XStreamImplicit;
import com.thoughtworks.xstream.annotations.XStreamOmitField;

/**
 * @author Administrator
 *
 */
@XStreamAlias(value="Class")
public class ConfigClass implements IConfigElement {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 4049611795872055356L;

	@XStreamAsAttribute
	private String id;
	
	/**
	 * An enum attribute to define the RIM type of this class (Participation/Role/Act/Entity/RoleLink/ActRelationship)
	 */
	@XStreamAsAttribute
	private RIM_TYPE rimType = RIM_TYPE.UNIDENTIFIED;
	
	/**
	 * Only a configuration design view attribute to signify the selection of this class
	 */
	@XStreamOmitField /*	We don't need this field in the configuration file	*/
	private Boolean selected = Boolean.FALSE;
	
	@XStreamOmitField
	private CONFIG_OBJECT_TYPE configType = CONFIG_OBJECT_TYPE.CLASS;
	
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
	
	@XStreamAsAttribute
	private Integer minOccurs;
	
	@XStreamAsAttribute
	private Integer maxOccurs;
	
	@XStreamImplicit(itemFieldName="Attribute")
	private List<ConfigAttribute> attributes;
	
	@XStreamImplicit(itemFieldName="Field")
	private List<ConfigField> fields;
	
	@XStreamImplicit(itemFieldName="Class")
	private List<ConfigClass> classes;

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
	 * @return the minOccurs
	 */
	public Integer getMinOccurs() {
		return minOccurs;
	}
	/**
	 * @param minOccurs the minOccurs to set
	 */
	public void setMinOccurs(Integer minOccurs) {
		this.minOccurs = minOccurs;
	}
	/**
	 * @return the maxOccurs
	 */
	public Integer getMaxOccurs() {
		return maxOccurs;
	}
	/**
	 * @param maxOccurs the maxOccurs to set
	 */
	public void setMaxOccurs(Integer maxOccurs) {
		this.maxOccurs = maxOccurs;
	}
	
	
	/**
	 * @return the attributes
	 */
	public List<ConfigAttribute> getAttributes() {
		return (attributes == null) ?
				attributes = new ArrayList<ConfigAttribute>()
				: attributes;
	}
	/**
	 * @param attributes the attributes to set
	 */
	public void setAttributes(List<ConfigAttribute> attributes) {
		this.attributes = attributes;
	}
	/**
	 * @return the fields
	 */
	public List<ConfigField> getFields() {
		return (fields == null) ?
				fields = new ArrayList<ConfigField>()
				:fields;
	}
	/**
	 * @param fields the fields to set
	 */
	public void setFields(List<ConfigField> fields) {
		this.fields = fields;
	}
	/**
	 * @return the classes
	 */
	public List<ConfigClass> getClasses() {
		return (classes == null) ?
				classes = new ArrayList<ConfigClass>()
				:classes;
	}
	/**
	 * @param classes the classes to set
	 */
	public void setClasses(List<ConfigClass> classes) {
		this.classes = classes;
	}

	/**
	 * @param selected the selected to set
	 */
	public void setSelected(Boolean selected) {
		this.selected = selected;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "ConfigClass [rimType=" + rimType + ", selected=" + selected
				+ ", tagName=" + tagName + ", type=" + type + ", inputControl="
				+ inputControl + ", label=" + label + ", displayOrder="
				+ displayOrder + ", minOccurs=" + minOccurs + ", maxOccurs="
				+ maxOccurs + ", attributes=" + attributes + ", fields="
				+ fields + ", classes=" + classes + "]";
	}
	@Override
	public Boolean isSelected() {
		return this.selected;
	}
	@Override
	public CONFIG_OBJECT_TYPE getConfigType() {
		return configType;
	}
	/**
	 * @param configType the configType to set
	 */
	public void setConfigType(CONFIG_OBJECT_TYPE configType) {
		this.configType = configType;
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
