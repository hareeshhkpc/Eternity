/**
 * 
 */
package com.hin.domain.utils;

import java.util.ArrayList;
import java.util.List;

/**
 * @author s.thamilarasi
 * 
 */
public class SearchCriteria {
	private String property = "";
	private String condition = "";
	private Object value = "";

	private List<String> values = new ArrayList<String>();
	private String category;

	public SearchCriteria() {
		
	}

	// remove once everything completed -------------it is important
	public SearchCriteria(String property, String condition, Object value) {
		super();
		this.property = property;
		this.condition = condition;
		this.value = value;
	}

	public String getProperty() {
		return property;
	}

	public void setProperty(String property) {
		this.property = property;
	}

	public String getCondition() {
		return condition;
	}

	public void setCondition(String condition) {
		this.condition = condition;
	}

	public Object getValue() {
		return value;
	}

	public void setValue(Object value) {
		this.value = value;
	}

	/**
	 * @return the values
	 */
	public List<String> getValues() {
		return values;
	}

	/**
	 * @param values
	 *            the values to set
	 */
	public void setValues(List<String> values) {
		this.values = values;
	}

	/**
	 * @return the category
	 */
	public String getCategory() {
		return category;
	}

	/**
	 * @param category the category to set
	 */
	public void setCategory(String category) {
		this.category = category;
	}

}
