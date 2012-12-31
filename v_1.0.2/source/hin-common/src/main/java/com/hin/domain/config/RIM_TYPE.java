/**
 * 
 */
package com.hin.domain.config;

/**
 * @author Administrator
 *
 */
public enum RIM_TYPE {

	/**
	 * Signifies that the object with this property is one which is not recognized as any of the RIM type
	 * This is the default type.
	 */
	UNIDENTIFIED,
	
	/**
	 * HL7 RIM Act
	 */
	ACT,
	
	/**
	 * HL7 RIM Entity
	 */
	ENTITY,
	
	/**
	 * HL7 RIM Role
	 */
	ROLE,
	
	/**
	 * HL7 RIM Participation
	 */
	PARTICIPATION,
	
	/**
	 * HL7 RIM RoleLink
	 */
	ROLELINK,
	
	/**
	 * HL7 RIM ActRelationship
	 */
	ACTRELATIONSHIP
}
