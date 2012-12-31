/**
 * 
 */
package com.hin.hl7messaging.configuration.web.rest;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.dom.DOMSource;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Element;

/**
 * @author Administrator
 *
 */
public class ConfigHelper {

	public Object getAllSchemaPathNames(String basePath) throws ParserConfigurationException, XPathExpressionException{
		DOMSource ds = new DOMSource();
		
		DocumentBuilderFactory domFactory = DocumentBuilderFactory.newInstance();
	    DocumentBuilder domBuilder = domFactory.newDocumentBuilder();

	    Document newDoc = domBuilder.newDocument();
	    Element rootElement = newDoc.createElement("schemas");
	    newDoc.appendChild(rootElement);
	    
	    Element element = null;
	    /*for(String member : unionMemberTypes.split(" ")){
	    	element = newDoc.createElement("name");
		    element.setTextContent(member);
		    rootElement.appendChild(element);
	    }*/
	    
	    ds.setNode(newDoc);
	    
	    XPathExpression xpe = XPathFactory.newInstance().newXPath().compile("/");
	    Object expRes = xpe.evaluate(newDoc, XPathConstants.NODESET);
	    
		return expRes;
	}
	
}
