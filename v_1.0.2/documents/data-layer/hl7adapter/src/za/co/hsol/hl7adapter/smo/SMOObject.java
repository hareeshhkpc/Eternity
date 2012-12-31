package za.co.hsol.hl7adapter.smo;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import za.co.hsol.hl7adapter.meta.ConfigClass;
import za.co.hsol.hl7adapter.meta.ConfigField;


public class SMOObject {
	public enum ObjectValueType {
	    STRING, STRINGARRAY, OBJECT, OBJECTARRAY, NULL,NULLARRAY, UNKNOWN 
	}

	
	private ConfigClass mConfigClass;
	private Element mDocNode;
	private XPath mXpath;

	public SMOObject(ConfigClass configClass, Element elt) {
		mConfigClass = configClass;
		mDocNode = elt;
		mXpath = XPathFactory.newInstance().newXPath();
	}

	public ConfigClass getConfigClass() {
		return mConfigClass;
	}

	public void setConfigClass(ConfigClass configClass) {
		mConfigClass = configClass;
	}

	public SMOObject createObject(String className) {
		ConfigClass cl = mConfigClass.getChildClass(className);
		SMOObject result;
		if (cl != null) {
			Element elt = mDocNode.getOwnerDocument().createElement(className);
			mDocNode.appendChild(elt);
			result = new SMOObject(cl, elt);
		} else {
			result = null;
		}
		return result;
	}

	public List<SMOObject> findObject(String expression) {  // copy of SMOMessage - TODO: refactor findObject and createObject
		ArrayList<SMOObject> result = new ArrayList<SMOObject>();
		NodeList list = findNode(expression);
		for (int i = 0; i < list.getLength(); i++) {
			Element elt = (Element) list.item(i);
			ConfigClass configClass = mConfigClass.getChildClass(elt
					.getTagName());
			result.add(new SMOObject(configClass, elt));
		}
		return result;
	}
	
	
	private NodeList findNode(String expression){
		NodeList list = null;
		try {
			list = (NodeList) mXpath.evaluate(expression, mDocNode,
					XPathConstants.NODESET);
		} catch (XPathExpressionException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return list;		
	}

	public boolean isValidField(String fieldName) {
		ConfigField field = mConfigClass.getField(fieldName);
		return field != null;
	}

	
	public ObjectValueType getValueType(String fieldName){
		ObjectValueType result = ObjectValueType.NULL;
		NodeList nl = findNode(fieldName);
		if(nl.getLength() == 0){
			result = ObjectValueType.NULL; // Null
		} else if(nl.getLength()>1) {
			Node n = nl.item(0);
			if(n.getFirstChild() == null){
				result = ObjectValueType.NULLARRAY;
			} else if (n.getFirstChild().getNodeType() == Document.TEXT_NODE){
				result = ObjectValueType.STRINGARRAY;
			} else if (n.getFirstChild().getNodeType() == Document.ELEMENT_NODE){
				result = ObjectValueType.OBJECTARRAY;
			} else {
				result = ObjectValueType.UNKNOWN;
			}
		} else if(nl.getLength()==1){		
			Node n = nl.item(0);
			if(n.getFirstChild() == null){
				result = ObjectValueType.NULL;
			} else if (n.getFirstChild().getNodeType() == Document.TEXT_NODE){
				result = ObjectValueType.STRING;
			} else if (n.getFirstChild().getNodeType() == Document.ELEMENT_NODE){
				result = ObjectValueType.OBJECT;
			} else {
				result = ObjectValueType.UNKNOWN;
			}
		}		
		return result;
	}

	public String getValueAsString(String fieldName) {
		String result;
		if (!isValidField(fieldName))
			result = null;
		else{
			if(getValueType(fieldName) != ObjectValueType.STRING){
				result = null; //throw new Exception(fieldName + " is not a string");
			} else {
				NodeList nl = findNode(fieldName);
				
				result = nl.item(0).getFirstChild().getTextContent();
			}
		}
		return result;

	}
	
	public Element getValueAsObject(String fieldName) {
		Element result;
		if (!isValidField(fieldName))
			result = null;
		else{
			if(getValueType(fieldName) != ObjectValueType.OBJECT){
				result = null; //throw new Exception(fieldName + " is not an object");
			} else {
				NodeList nl = findNode(fieldName);
				
				result = (Element)nl.item(0);
			}
		}
		return result;
	}

	public List<Element> getValueAsObjectArray(String fieldName) {
		List<Element>  result = new ArrayList<Element>();
		if (!isValidField(fieldName)){
			// return an empty list
		} else {
			if(getValueType(fieldName) != ObjectValueType.OBJECTARRAY && getValueType(fieldName) != ObjectValueType.OBJECT){
				result = null; // throw new Exception(fieldName + " is not an object array");
			} else {
				NodeList nl = findNode(fieldName);
				for(int i = 0; i< nl.getLength(); i++){
					result.add((Element)nl.item(i));
				}
			}
		}
		return result;
	}

	
	
	public void clearValue(String fieldName){
		NodeList nl = findNode(fieldName);
		for(int i=0; i< nl.getLength(); i++){
			mDocNode.removeChild(nl.item(i));
		}	
	}
	
	public void setValue(String fieldName, String value)
			throws InvalidFieldNameException {

		if (isValidField(fieldName)){
	        clearValue(fieldName);
			
			Element e = mDocNode.getOwnerDocument().createElement(fieldName);
			e.setTextContent(value);
			mDocNode.appendChild(e);
		}else
			throw new InvalidFieldNameException(fieldName
					+ " not a valid field name for object of class "
					+ mConfigClass.getConfigClassName());

	}

	
	
	public void setValue(SMOValue value)
			throws InvalidFieldNameException {
		String fieldName = value.getName();
		if (isValidField(fieldName)){
			clearValue(fieldName);
			
		    Node dup = mDocNode.getOwnerDocument().importNode(value.getElement(), true);  
			mDocNode.appendChild(dup);
		}else
			throw new InvalidFieldNameException(fieldName
					+ " not a valid field name for object of class "
					+ mConfigClass.getConfigClassName());

	}
	
	
	public class InvalidFieldNameException extends Exception {

		private static final long serialVersionUID = -4488854642362792241L;

		public InvalidFieldNameException(String message) {
			super(message);
		}
	}

	public boolean validate() {
		boolean result = true;
		NamedNodeMap attr = mDocNode.getAttributes();
		for (int i = 0; i < attr.getLength(); i++) {
			Node a = attr.item(i);
			if (!isValidField(a.getNodeName())) {
				result = false;
				break;
			}
		}
		if (result) {
			List<SMOObject> list = findObject("*");
			for (int i = 0; i < list.size(); i++) {
				result = list.get(i).validate();
				if (!result)
					break;
			}
		}
		return result;
	}

	public Element getXML() {
		return mDocNode;
		
	}

	public SMOValue getNewValue(String name){
		Element e = mDocNode.getOwnerDocument().createElement(name);
		mDocNode.appendChild(e);
		return new SMOValue(e);
	}
	

}
