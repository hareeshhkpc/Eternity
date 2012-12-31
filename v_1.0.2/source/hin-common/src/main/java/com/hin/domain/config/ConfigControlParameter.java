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
@XStreamAlias("ControlParameter")
public class ConfigControlParameter implements IConfigElement{
	
	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 5451829339850771233L;

	@XStreamAsAttribute
	private String id;
	
	@XStreamImplicit(itemFieldName="Param")
	private List<ConfigParam> params;

	@XStreamOmitField /*	We don't need this field in the configuration file	*/
	private Boolean selected = Boolean.FALSE;
	
	@XStreamAsAttribute
	private CONFIG_OBJECT_TYPE configType = CONFIG_OBJECT_TYPE.CONTROL_PARAM;

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

	@Override
	public CONFIG_OBJECT_TYPE getConfigType() {
		return configType;
	}

	@Override
	public Boolean isSelected() {
		return selected;
	}

	/**
	 * @param selected the selected to set
	 */
	public void setSelected(Boolean selected) {
		this.selected = selected;
	}

	/**
	 * @param configType the configType to set
	 */
	public void setConfigType(CONFIG_OBJECT_TYPE configType) {
		this.configType = configType;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "ConfigControlParameter [params=" + params + ", selected="
				+ selected + ", configType=" + configType + "]";
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

	/**
	 * @return the params
	 */
	public List<ConfigParam> getParams() {
		if(params == null){
			params = new ArrayList<ConfigParam>();
		}
		return params;
	}

	/**
	 * @param params the params to set
	 */
	public void setParams(List<ConfigParam> params) {
		this.params = params;
	}
}
