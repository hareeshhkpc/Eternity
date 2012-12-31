/**
 * 
 */
package com.hin.hl7messaging.config;

import java.util.Properties;

/**
 * @author salam.halley
 *
 */
public class HINConfigurationBean {
	
	public final static String CONTEXT_PROPERTY = "HIN_CONFIGURATION_BEAN";

	private Properties properties;

	public HINConfigurationBean() {
		properties = new Properties();
	}
	
	public String getConfigurationProperty(HINConfigurationProperty messageRepositoryConnectionProperties){
		return (String) properties.getProperty(messageRepositoryConnectionProperties.toString());
	}
	
	public void setConfigurationProperty(HINConfigurationProperty propertyName, String value){
		properties.setProperty(propertyName.toString(), value);
	}

	public void initializeConfigurationFromProperties(Properties properties) {
		this.properties = properties;
	}

	@Override
	public String toString() {
		return "HINConfigurationBean [properties=" + properties + "]";
	}

}
