/**
 * 
 */
package com.hin.hl7messaging.repository;

/**
 * @author shilpa.rao
 *
 */
public class KeyComponent {
	private String name;
	private String xpath;
	private ColumnVariable variable;
	
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
	/**
	 * @return the xpath
	 */
	public String getXpath() {
		return xpath;
	}
	/**
	 * @param xpath the xpath to set
	 */
	public void setXpath(String xpath) {
		this.xpath = xpath;
	}
	/**
	 * @return the variable
	 */
	public ColumnVariable getVariable() {
		return variable;
	}
	/**
	 * @param variable the variable to set
	 */
	public void setVariable(ColumnVariable variable) {
		this.variable = variable;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "KeyComponent [name=" + name + ", xpath=" + xpath
				+ ", variable=" + variable + "]";
	}	
}
