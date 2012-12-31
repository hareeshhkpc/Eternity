/**
 * 
 */
package com.hin.domain.config;

import java.util.ArrayList;
import java.util.List;

import org.w3c.dom.Element;

/**
 * @author Administrator
 *
 */
public class ElementList {

	/**
	 * All the HL7 fields in the complex type
	 */
	private List<Element> fieldCollection;
	
	/**
	 * All the HL7 fields in the complex type
	 */
	private List<Element> groupCollection;
	
	/**
	 * All the Message Class types in the complex type
	 */	
	private List<Element> classeCollection;
	
	/**
	 * All the Attributes types in the complex type
	 */	
	private List<Element> attributeCollection;
	
	/**
	 * All the Message Class types in the complex type
	 */	
	private List<Element> attributeGroupCollection;
	
	public ElementList(){
		this.fieldCollection = new ArrayList<Element>();
		this.classeCollection = new ArrayList<Element>();
		this.groupCollection = new ArrayList<Element>();
		this.attributeCollection = new ArrayList<Element>();
		this.attributeGroupCollection = new ArrayList<Element>();
	}

	/**
	 * @return the fieldCollection
	 */
	public List<Element> getFieldCollection() {
		return fieldCollection;
	}

	/**
	 * @param fieldCollection the fieldCollection to set
	 */
	public void setFieldCollection(List<Element> fieldCollection) {
		this.fieldCollection = fieldCollection;
	}

	/**
	 * @return the classeCollection
	 */
	public List<Element> getClasseCollection() {
		return classeCollection;
	}

	/**
	 * @param classeCollection the classeCollection to set
	 */
	public void setClasseCollection(List<Element> classeCollection) {
		this.classeCollection = classeCollection;
	}

	/**
	 * @return the groupCollection
	 */
	public List<Element> getGroupCollection() {
		return groupCollection;
	}

	/**
	 * @param groupCollection the groupCollection to set
	 */
	public void setGroupCollection(List<Element> groupCollection) {
		this.groupCollection = groupCollection;
	}

	/**
	 * @return the attributeCollection
	 */
	public List<Element> getAttributeCollection() {
		return attributeCollection;
	}

	/**
	 * @param attributeCollection the attributeCollection to set
	 */
	public void setAttributeCollection(List<Element> attributeCollection) {
		this.attributeCollection = attributeCollection;
	}

	/**
	 * @return the attributeGroupCollection
	 */
	public List<Element> getAttributeGroupCollection() {
		return attributeGroupCollection;
	}

	/**
	 * @param attributeGroupCollection the attributeGroupCollection to set
	 */
	public void setAttributeGroupCollection(List<Element> attributeGroupCollection) {
		this.attributeGroupCollection = attributeGroupCollection;
	}
	
}
