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
@XStreamAlias(value="HL7MessageConfiguration")
public class HL7MessageConfiguration implements IConfigElement {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -1699037333287553357L;

	@XStreamAsAttribute
	private String id;
	
	@XStreamAlias(value="MetaInfo")
	private MetaInfo metaInfo;
	
	@XStreamAlias(value="IndexConfiguration")
	private ConfigIndex configIndex;
	
	@XStreamAlias(value="ArchiveConfiguration")
	private ConfigArchive configArchive;
	
	@XStreamAlias(value="WorkFlowDefinition")
	private ConfigWorkFlow configWorkFlow;
	
	@XStreamAlias(value="Class")
	private ConfigClass configClass;

	@XStreamOmitField /*	We don't need this field in the configuration file	*/
	private Boolean selected = Boolean.FALSE;
	
	@XStreamOmitField
	private CONFIG_OBJECT_TYPE configType = CONFIG_OBJECT_TYPE.MESSAGE;

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
	 * @return the metaInfo
	 */
	public MetaInfo getMetaInfo() {
		return (metaInfo == null) ?
				metaInfo = new MetaInfo()
				: metaInfo;
	}
	/**
	 * @param metaInfo the metaInfo to set
	 */
	public void setMetaInfo(MetaInfo metaInfo) {
		this.metaInfo = metaInfo;
	}
	/**
	 * @return the configClass
	 */
	public ConfigClass getConfigClass() {
		return (configClass == null) ?
				configClass = new ConfigClass()
				: configClass;
	}
	/**
	 * @param configClass the configClass to set
	 */
	public void setConfigClass(ConfigClass configClass) {
		this.configClass = configClass;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "HL7MessageConfiguration [metaInfo=" + metaInfo
				+ ", configClass=" + configClass + "]";
	}

	/**
	 * @return the configIndex
	 */
	public ConfigIndex getConfigIndex() {
		return configIndex;
	}
	/**
	 * @param configIndex the configIndex to set
	 */
	public void setConfigIndex(ConfigIndex configIndex) {
		this.configIndex = configIndex;
	}
	@Override
	public Boolean isSelected() {
		return this.selected;
	}
	/**
	 * @param selected the selected to set
	 */
	public void setSelected(Boolean selected) {
		this.selected = selected;
	}
	/**
	 * @return the configType
	 */
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
	public ConfigArchive getConfigArchive() {
		return configArchive;
	}
	public void setConfigArchive(ConfigArchive configArchive) {
		this.configArchive = configArchive;
	}
	public ConfigWorkFlow getConfigWorkFlow() {
		return configWorkFlow;
	}
	public void setConfigWorkFlow(ConfigWorkFlow configWorkFlow) {
		this.configWorkFlow = configWorkFlow;
	}
}
