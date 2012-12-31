/**
 * 
 */
package com.hin.hl7messaging.repository;

import java.util.ArrayList;
import java.util.List;

/**
 * @author shilpa.rao
 *
 */
public class RowKey {

	public enum RowKeyType {		
		SINGLE("SINGLE"), COMPOSITE("COMPOSITE");
		private String name;
		private RowKeyType(String typeName){
			this.setName(typeName);
		}
		public String getName() {
			return name;
		}
		public void setName(String name) {
			this.name = name;
		}
	};
	
	private String name;
	private RowKeyType keyType;
	private String keyFieldsSeparator;
	private String xpath;
	private ColumnVariable variable;
	private List<KeyComponent> keyComponents;
	
	/**
	 * 
	 */
	public RowKey() {
		keyComponents = new ArrayList<KeyComponent>();
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
	/**
	 * @return the keyType
	 */
	public RowKeyType getKeyType() {
		return keyType;
	}
	/**
	 * @param keyType the keyType to set
	 */
	public void setKeyType(RowKeyType keyType) {
		this.keyType = keyType;
	}
	/**
	 * @return the keyFieldsSeparator
	 */
	public String getKeyFieldsSeparator() {
		return keyFieldsSeparator;
	}
	/**
	 * @param keyFieldsSeparator the keyFieldsSeparator to set
	 */
	public void setKeyFieldsSeparator(String keyFieldsSeparator) {
		this.keyFieldsSeparator = keyFieldsSeparator;
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
	/**
	 * @return the keyComponents
	 */
	public List<KeyComponent> getKeyComponents() {
		return keyComponents;
	}
	/**
	 * @param keyComponents the keyComponents to set
	 */
	public void setKeyComponents(List<KeyComponent> keyComponents) {
		this.keyComponents = keyComponents;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "RowKey [name=" + name + ", keyType=" + keyType
				+ ", keyFieldsSeparator=" + keyFieldsSeparator + ", xpath="
				+ xpath + ", variable=" + variable + ", keyComponents="
				+ keyComponents + "]";
	}
}
