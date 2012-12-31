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
 * @author vineeth.ng
 *
 */
@XStreamAlias(value="ArchiveConfiguration")
public class ConfigArchive implements IConfigElement {
	
	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 7482459039337756199L;

	/**
	 * An enum attribute to define the RIM type of this class (Participation/Role/Act/Entity/RoleLink/ActRelationship)
	 */
	@XStreamOmitField /*	We don't need this field in the configuration file	*/
	private RIM_TYPE rimType = RIM_TYPE.UNIDENTIFIED;
	
	/**
	 * Only a configuration design view attribute to signify the selection of this class
	 */
	@XStreamOmitField /*	We don't need this field in the configuration file	*/
	private Boolean selected = Boolean.FALSE;
	
	@XStreamOmitField /*	We don't need this field in the configuration file	*/
	private CONFIG_OBJECT_TYPE configType = CONFIG_OBJECT_TYPE.CLASS;
	
	@XStreamAsAttribute	
	private String columnFamilyName;
	
	@XStreamImplicit(itemFieldName="Field")
	private List<ConfigArchiveField> attributes;

	/**
	 * @return the columnFamilyName
	 */
	public String getColumnFamilyName() {
		return columnFamilyName;
	}
	/**
	 * @param columnFamilyName the columnFamilyName to set
	 */
	public void setColumnFamilyName(String columnFamilyName) {
		this.columnFamilyName = columnFamilyName;
	}
	/**
	 * @return the attributes
	 */
	public List<ConfigArchiveField> getAttributes() {
		if(attributes == null){
			attributes = new ArrayList<ConfigArchiveField>();
		}
		return attributes;
	}
	/**
	 * @param attributes the attributes to set
	 */
	public void setAttributes(List<ConfigArchiveField> attributes) {
		this.attributes = attributes;
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
