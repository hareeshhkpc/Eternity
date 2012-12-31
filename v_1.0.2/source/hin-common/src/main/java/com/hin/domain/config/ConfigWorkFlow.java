/**
 * 
 */
package com.hin.domain.config;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamAsAttribute;
import com.thoughtworks.xstream.annotations.XStreamImplicit;
import com.thoughtworks.xstream.annotations.XStreamOmitField;

/**
 * @author vineeth.ng
 *
 */
@XStreamAlias(value="WorkFlowDefinition")
public class ConfigWorkFlow implements IConfigElement {
	
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
	private String id;
	
	@XStreamAsAttribute	
	private String version;
	
	@XStreamAlias("name")
	private String name;
	
	@XStreamAlias("start")
	private ConfigWorkFlowStart start;
	
	@XStreamAlias("task")
	private ConfigWorkFlowTask task;

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
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getVersion() {
		return version;
	}
	public void setVersion(String version) {
		this.version = version;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public ConfigWorkFlowStart getStart() {
		return start;
	}
	public void setStart(ConfigWorkFlowStart start) {
		this.start = start;
	}
	public ConfigWorkFlowTask getTask() {
		return task;
	}
	public void setTask(ConfigWorkFlowTask task) {
		this.task = task;
	}
}
