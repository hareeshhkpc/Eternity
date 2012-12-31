/**
 * 
 */
package com.hin.domain.config;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamAsAttribute;
import com.thoughtworks.xstream.annotations.XStreamOmitField;

/**
 * @author vineeth.ng
 *
 */
@XStreamAlias(value="transition")
public class ConfigWorkFlowTransition  implements IConfigElement {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -6353024427465883265L;

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
	private CONFIG_OBJECT_TYPE configType = CONFIG_OBJECT_TYPE.INDEX_FIELD;
	
	@XStreamAsAttribute	
	private String name;
	
	@XStreamAsAttribute	
	private String to;
	
	@Override
	public RIM_TYPE getRIMType() {
		return rimType;
	}

	@Override
	public void setRIMType(RIM_TYPE type) {
		rimType = type;
	}

	@Override
	public CONFIG_OBJECT_TYPE getConfigType() {
		return configType;
	}

	@Override
	public Boolean isSelected() {
		return selected;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getTo() {
		return to;
	}

	public void setTo(String to) {
		this.to = to;
	}

	public void setConfigType(CONFIG_OBJECT_TYPE configType) {
		this.configType = configType;
	}

}
