/**
 * 
 */
package com.hin.domain.vo;

/**
 * @author vineeth.ng
 * 
 */
public class ArchiveIndexFieldsVO {
	private String name = "";
	private String indexed = "";
	private String xpath = "";
	private String value = "";
	private String type = "";

	/**
	 * @param name
	 * @param indexed
	 * @param xpath
	 * @param value
	 */
	public ArchiveIndexFieldsVO(String name, String indexed, String xpath, String value, String type) {
		super();
		this.name = name;
		this.indexed = indexed;
		this.xpath = xpath;
		this.value = value;
		this.type = type;
	}

	/**
	 * @return the name
	 */
	public String getName() {
		return name;
	}

	/**
	 * @param name
	 *            the name to set
	 */
	public void setName(String name) {
		this.name = name;
	}

	/**
	 * @return the indexed
	 */
	public String getIndexed() {
		return indexed;
	}

	/**
	 * @param indexed
	 *            the indexed to set
	 */
	public void setIndexed(String indexed) {
		this.indexed = indexed;
	}

	/**
	 * @return the xpath
	 */
	public String getXpath() {
		return xpath;
	}

	/**
	 * @param xpath
	 *            the xpath to set
	 */
	public void setXpath(String xpath) {
		this.xpath = xpath;
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

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
}
