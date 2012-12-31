/**
 * 
 */
package com.hin.domain.vo;

import com.hin.domain.core.BaseDomain;

/**
 * @author krishna.lr
 * 
 */
public class IndexFieldsVO  extends BaseDomain{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String name = "";
	private String indexed = "";
	private String xpath = "";
	private Object value = "";
	private String analyzed = "";
	private String type="";
	
	public IndexFieldsVO(){
		
	}
	
	/**
	 * @param name
	 * @param indexed
	 * @param xpath
	 * @param value
	 */
	public IndexFieldsVO(String name, String indexed, String xpath, Object value, String analyzed) {
		super();
		this.name = name;
		this.indexed = indexed;
		this.xpath = xpath;
		this.value = value;
		this.analyzed = analyzed;
	}
	/**
	 * @param name
	 * @param indexed
	 * @param xpath
	 * @param value
	 */
	public IndexFieldsVO(String name, String indexed, String xpath, Object value, String analyzed,String type) {
		super();
		this.name = name;
		this.indexed = indexed;
		this.xpath = xpath;
		this.value = value;
		this.analyzed = analyzed;
		this.type=type;
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
	public Object getValue() {
		return value;
	}

	/**
	 * @param value
	 *            the value to set
	 */
	public void setValue(Object value) {
		this.value = value;
	}

	public String getAnalyzed() {
		return analyzed;
	}

	public void setAnalyzed(String analyzed) {
		this.analyzed = analyzed;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
}
