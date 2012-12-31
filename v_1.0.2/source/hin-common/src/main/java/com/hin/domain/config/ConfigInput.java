/**
 * 
 */
package com.hin.domain.config;


/**
 * @author Administrator
 *
 */
public class ConfigInput {
	private String tagName;
	private String configClassType;
	private String entryPoint;
	private String messageType;
	private ConfigAction action;
	private String navigation;
	private MetaInfo metaInfo;

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
	public String getConfigClassType() {
		return configClassType;
	}

	/**
	 * @param type the type to set
	 */
	public void setConfigClassType(String type) {
		this.configClassType = type;
	}

	/**
	 * @return the entryPoint
	 */
	public String getEntryPoint() {
		return entryPoint;
	}

	/**
	 * @param entryPoint the entryPoint to set
	 */
	public void setEntryPoint(String entryPoint) {
		this.entryPoint = entryPoint;
	}

	/**
	 * @return the messageType
	 */
	public String getMessageType() {
		return messageType;
	}

	/**
	 * @param messageType the messageType to set
	 */
	public void setMessageType(String messageType) {
		this.messageType = messageType;
	}

	/**
	 * @return the action
	 */
	public ConfigAction getAction() {
		return action;
	}

	/**
	 * @param action the action to set
	 */
	public void setAction(ConfigAction action) {
		this.action = action;
	}

	/**
	 * @return the navigation
	 */
	public String getNavigation() {
		return navigation;
	}

	/**
	 * @param navigation the navigation to set
	 */
	public void setNavigation(String navigation) {
		this.navigation = navigation;
	}

	public MetaInfo getMetaInfo() {
		if(metaInfo == null){
			metaInfo = new MetaInfo();
		}
		return metaInfo;
	}

	public void setMetaInfo(MetaInfo metaInfo) {
		this.metaInfo = metaInfo;
	}

}
