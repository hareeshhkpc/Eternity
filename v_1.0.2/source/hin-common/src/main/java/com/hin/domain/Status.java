/**
 * 
 */
package com.hin.domain;


/**
 * @author vineeth.ng
 *
 */
public enum Status {
	ACTIVE("active"),INACTIVE("inActive"),OBSOLETE("obsolete");
	
	private final String value;

	private Status(String value) {
		this.value = value;
	}

	public String getName() {
		return name();
	}
	/**
	 * @return the value
	 */
	public String getValue() {
		return value;
	}

	public static Status fromString(String value) {
		if (value != null) {
			for (Status status : Status.values()) {
				if (value.equalsIgnoreCase(status.value)) {
					return status;
				}
			}
		}
		return null;
	}

}
