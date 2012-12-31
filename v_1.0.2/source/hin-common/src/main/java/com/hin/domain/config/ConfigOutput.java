/**
 * 
 */
package com.hin.domain.config;

import java.util.List;

/**
 * @author Administrator
 *
 */
public class ConfigOutput {
	private List<HL7ObjectItem> items;
	private String messageType;
	private String entryPoint;
	private String classView;
	private String propertyView;
	private MetaInfo metaInfo;
	private HL7MessageConfiguration currentConfig;

	/**
	 * @return the items
	 */
	public List<HL7ObjectItem> getItems() {
		return items;
	}

	/**
	 * @param items the items to set
	 */
	public void setItems(List<HL7ObjectItem> items) {
		this.items = items;
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

	public String getClassView() {
		return classView;
	}

	public void setClassView(String classView) {
		this.classView = classView;
	}

	/**
	 * @return the propertyView
	 */
	public String getPropertyView() {
		return propertyView;
	}

	/**
	 * @param propertyView the propertyView to set
	 */
	public void setPropertyView(String propertyView) {
		this.propertyView = propertyView;
	}

	public MetaInfo getMetaInfo() {
		return metaInfo;
	}

	public void setMetaInfo(MetaInfo metaInfo) {
		this.metaInfo = metaInfo;
	}

	/**
	 * @return the currentConfig
	 */
	public HL7MessageConfiguration getCurrentConfig() {
		return currentConfig;
	}

	/**
	 * @param currentConfig the currentConfig to set
	 */
	public void setCurrentConfig(HL7MessageConfiguration currentConfig) {
		this.currentConfig = currentConfig;
	}

}
