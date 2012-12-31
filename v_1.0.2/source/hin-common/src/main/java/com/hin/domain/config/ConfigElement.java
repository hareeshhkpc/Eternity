/**
 * 
 */
package com.hin.domain.config;

import org.w3c.dom.Element;

/**
 * @author Administrator
 *
 */
public class ConfigElement {

	/**
	 * Type of this element, ie., CLASS, FIELD etc
	 */
	private CONFIG_OBJECT_TYPE type;
	
	/**
	 * The type of this element in the schema file, ie., ELEMENT, ATTRIBUTE etc
	 */
	private SCHEMA_ELEMENT_TYPE schemaElementType;
	
	/**
	 * The associated schema
	 */
	private MessageSchema schema;
	
	/**
	 * Element
	 */
	private Element element;

	/**
	 * @return the schema
	 */
	public MessageSchema getSchema() {
		return schema;
	}

	/**
	 * @param schema the schema to set
	 */
	public void setSchema(MessageSchema schema) {
		this.schema = schema;
	}

	/**
	 * @return the element
	 */
	public Element getElement() {
		return element;
	}

	/**
	 * @param element the element to set
	 */
	public void setElement(Element element) {
		this.element = element;
	}

	/**
	 * @return the type
	 */
	public CONFIG_OBJECT_TYPE getType() {
		return type;
	}

	/**
	 * @param type the type to set
	 */
	public void setType(CONFIG_OBJECT_TYPE type) {
		this.type = type;
	}

	/**
	 * @return the schemaElementType
	 */
	public SCHEMA_ELEMENT_TYPE getSchemaElementType() {
		return schemaElementType;
	}

	/**
	 * @param schemaElementType the schemaElementType to set
	 */
	public void setSchemaElementType(SCHEMA_ELEMENT_TYPE schemaElementType) {
		this.schemaElementType = schemaElementType;
	}
	
}
