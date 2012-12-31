/**
 * 
 */
package com.hin.hl7messaging.repository;

/**
 * @author shilpa.rao
 *
 */

public enum ColumnVariable {

	PROFILE_ID("PROFILE_ID"), MESSAGE("MESSAGE"), UUID("UUID"), ORGANIZATION_ID("ORGANIZATION_ID");
	
	private String name;
	
	private ColumnVariable(String varName){
		this.name = varName;
	}

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
}
