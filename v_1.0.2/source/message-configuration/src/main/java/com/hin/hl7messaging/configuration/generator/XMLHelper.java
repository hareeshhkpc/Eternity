package com.hin.hl7messaging.configuration.generator;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;

import javax.xml.namespace.QName;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.apache.log4j.Logger;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.xml.sax.SAXException;

public class XMLHelper {
	private static XPath xPath;
	private static Logger logger = Logger.getLogger(XMLHelper.class.getName());
	
	public XMLHelper() {
		xPath = XPathFactory.newInstance().newXPath();
	}
	
	public static Object read(Element xmlNode, String expression, QName returnType) {
		try {
			xPath = XPathFactory.newInstance().newXPath();
			XPathExpression xPathExpression = xPath.compile(expression);
			return xPathExpression.evaluate(xmlNode, returnType);
		} catch (XPathExpressionException ex) {
			logger.error("An error occured while compiling ZPathExpression: "+ex.getMessage());
			return null;
		}
	}
	
	public static Object read(Document xmlDocument, String expression, QName returnType) {
		try {
			xPath = XPathFactory.newInstance().newXPath();
			XPathExpression xPathExpression = xPath.compile(expression);
			return xPathExpression.evaluate(xmlDocument, returnType);
		} catch (XPathExpressionException ex) {
			logger.error("An error occured while compiling ZPathExpression: "+ex.getMessage());
			return null;
		}
	}
	
	public static Document getXMLDocument(File messageFile){
		try {
			DocumentBuilder builder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
			Document doc = builder.parse(messageFile);
			return doc;
			
		} catch (UnsupportedEncodingException e) {		
			logger.error("An error occured while loading the file: "+e.getMessage());
		} catch (ParserConfigurationException e) {
			logger.error("Parser not found: "+e.getMessage());
		} catch (SAXException e) {
			logger.error("An error occured while parsing the file: "+e.getMessage());
		} catch (IOException e) {
			logger.error("An error occured while parsing the file: "+e.getMessage());
		}
		return null;
		
	}
	
	public static String getXMLDocumentAsString(Document doc) {
		try {
			StringWriter stw = new StringWriter();
			Transformer serializer = TransformerFactory.newInstance().newTransformer();
			serializer.transform(new DOMSource(doc), new StreamResult(stw));
			return stw.toString();
		} catch (Exception e) {
			logger.error("Transformation error: "+e.getMessage());
			return null;
		}
	}
	
	public static Document getXMLDocument(String message){
		InputStream stream;
		try {
			stream = new ByteArrayInputStream(message.getBytes("UTF-8"));		
			DocumentBuilder builder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
			Document doc = builder.parse(stream);
			return doc;
			
		} catch (UnsupportedEncodingException e) {		
			logger.error("An error occured while loading the file: "+e.getMessage());	
		} catch (ParserConfigurationException e) {
			logger.error("Parser not Found: "+e.getMessage());
		} catch (SAXException e) {
			logger.error("An error occured while parsing the file: "+e.getMessage());
		} catch (IOException e) {
			logger.error("An error occured while parsing the file: "+e.getMessage());
		}
		return null;
		
	}
}
