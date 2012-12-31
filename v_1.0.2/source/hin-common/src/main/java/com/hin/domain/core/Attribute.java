/**
 * 
 */
package com.hin.domain.core;

/**
 * @author sreekumar.s
 * 
 */
public class Attribute extends BaseDomain {

	private String label;
	private Object dataType;

	/**
	 * @return the label
	 */
	public String getLabel() {
		return label;
	}

	/**
	 * @param label
	 *            the label to set
	 */
	public void setLabel(String label) {
		this.label = label;
	}

	/**
	 * @return the dataType
	 */
	public Object getDataType() {
		return dataType;
	}

	/**
	 * @param dataType
	 *            the dataType to set
	 */
	public void setDataType(Object dataType) {
		this.dataType = dataType;
	}

}
