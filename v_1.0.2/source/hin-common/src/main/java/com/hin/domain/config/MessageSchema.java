/**
 * 
 */
package com.hin.domain.config;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

import javax.xml.namespace.NamespaceContext;
import javax.xml.xpath.XPathConstants;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import com.hin.hl7messaging.utils.XMLHelper;

/**
 * @author Administrator
 *
 */
public class MessageSchema {

	/**
	 * Name of the schema file
	 */
	private File schemaFile;
	
	/**
	 * XML document object constructed using the schema file
	 */
	private Document document;
	
	/**
	 * All complex types defined in this schema
	 */
	private Map<String, Element> complexTypes;
	
	/**
	 * All simple types defined in this schema
	 */
	private Map<String, Element> simpleTypes;
	
	private MESSAGE_SCHEMA_CATEGORY category;
	

	public MessageSchema(File schemaFile) {
		this.schemaFile = schemaFile;
		this.complexTypes = new HashMap<String, Element>();
		this.simpleTypes = new HashMap<String, Element>();
	}

	public static MessageSchema getMessageSchema(File messageFile, NamespaceContext context){
		MessageSchema schema = new MessageSchema(messageFile);
		
		Document messageSchemaDoc = XMLHelper.getXMLDocument(messageFile, true);
		schema.setDocument(messageSchemaDoc);
		
		NodeList nodeList = (NodeList) XMLHelper.read(messageSchemaDoc, "//xs:complexType", XPathConstants.NODESET, context);
		for(int i = 0; nodeList != null && i < nodeList.getLength(); i++){
			Element element = (Element) nodeList.item(i);
			schema.getComplexTypes().put(element.getAttribute("name"), element);
		}
		
		nodeList = (NodeList) XMLHelper.read(messageSchemaDoc, "//xs:simpleType", XPathConstants.NODESET, context);
		for(int i = 0; nodeList != null && i < nodeList.getLength(); i++){
			Element element = (Element) nodeList.item(i);
			schema.getSimpleTypes().put(element.getAttribute("name"), element);
		}
		
		return schema;
	}
	
	/**
	 * @return the schemaFile
	 */
	public File getSchemaFile() {
		return schemaFile;
	}

	/**
	 * @param schemaFile the schemaFile to set
	 */
	public void setSchemaFile(File schemaFile) {
		this.schemaFile = schemaFile;
	}

	/**
	 * @return the document
	 */
	public Document getDocument() {
		return document;
	}

	/**
	 * @param document the document to set
	 */
	public void setDocument(Document document) {
		this.document = document;
	}

	/**
	 * @return the complexTypes
	 */
	public Map<String, Element> getComplexTypes() {
		return complexTypes;
	}

	/**
	 * @param complexTypes the complexTypes to set
	 */
	public void setComplexTypes(Map<String, Element> complexTypes) {
		this.complexTypes = complexTypes;
	}

	/**
	 * @return the simpleTypes
	 */
	public Map<String, Element> getSimpleTypes() {
		return simpleTypes;
	}

	/**
	 * @param simpleTypes the simpleTypes to set
	 */
	public void setSimpleTypes(Map<String, Element> simpleTypes) {
		this.simpleTypes = simpleTypes;
	}

	/**
	 * @return the category
	 */
	public MESSAGE_SCHEMA_CATEGORY getCategory() {
		return category;
	}

	/**
	 * @param category the category to set
	 */
	public void setCategory(MESSAGE_SCHEMA_CATEGORY category) {
		this.category = category;
	}
	
}
