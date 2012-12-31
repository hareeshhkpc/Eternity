/**
 * 
 */
package com.hin.domain;

import com.hin.domain.core.BaseDomain;

/**
 * @author vinaykumar.gk
 * 
 */
public class ConceptAttribute extends BaseDomain {

	private String key;
	private String value;

	/**
	 * @return the key
	 */
	public String getKey() {
		return key;
	}

	/**
	 * @param key
	 *            the key to set
	 */
	public void setKey(String key) {
		this.key = key;
	}

	/**
	 * @return the value
	 */
	public String getValue() {
		return value;
	}

	/**
	 * @param value
	 *            the value to set
	 */
	public void setValue(String value) {
		this.value = value;
	}
}
