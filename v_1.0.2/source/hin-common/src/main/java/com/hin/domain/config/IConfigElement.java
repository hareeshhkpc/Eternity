/**
 * 
 */
package com.hin.domain.config;

import java.io.Serializable;


/**
 * @author Administrator
 *
 */
public interface IConfigElement extends Serializable {
	
	public RIM_TYPE getRIMType();
	
	public void setRIMType(RIM_TYPE type);
	
	public CONFIG_OBJECT_TYPE getConfigType();
	
	public Boolean isSelected();
	
}
