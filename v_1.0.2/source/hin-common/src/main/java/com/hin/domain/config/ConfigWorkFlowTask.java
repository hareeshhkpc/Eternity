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
@XStreamAlias(value="WorkFlowTask")
public class ConfigWorkFlowTask  implements IConfigElement {

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
	
	@XStreamImplicit(itemFieldName="transition")
	private List<ConfigWorkFlowTransition> transitition;
	
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

	public List<ConfigWorkFlowTransition> getTransitition() {
		if(transitition == null){
			transitition = new ArrayList<ConfigWorkFlowTransition>();
		}
		return transitition;
	}

	public void setTransitition(List<ConfigWorkFlowTransition> transitition) {
		this.transitition = transitition;
	}

	public void setConfigType(CONFIG_OBJECT_TYPE configType) {
		this.configType = configType;
	}
}
