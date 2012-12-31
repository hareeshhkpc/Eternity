/**
 * 
 */
package com.hin.hl7messaging.utils;

/**
 * @author sreekumar.s
 * 
 */
public enum RequestType {

	ROLES("roles"), ROLELIST("roleList"), SELECTEDROLE(
			"selectedRole"), ADDPROPERTY(
			"addProperty"), PERMISSION(
			"permission"), SAVEPERMISSION("savePermission"), RELATIONSHIPS(
			"relationships"), OLDRELATIONSHIPS("oldRelationships"), SAVEROLEINSTANCE(
			"saveRoleInstance"), PROFILEVIEW("profileView"), DELETEROLE(
			"deleteRole"), ROLEAVAILABLE("roleAvailable"), ROLEEXISTING(
			"roleExisting"), UPDATESTATUS("updateStatus"),SELECTEDEXISTINGROLE("selectedExistingRole"), LOGIN("login"), HOME("home");
	private final String value;

	private RequestType(String value) {
		this.value = value;
	}

	/**
	 * @return the value
	 */
	public String getValue() {
		return value;
	}

	public static RequestType fromString(String value) {
		if (value != null) {
			for (RequestType requestType : RequestType.values()) {
				if (value.equalsIgnoreCase(requestType.value)) {
					return requestType;
				}
			}
		}
		return null;
	}

}
