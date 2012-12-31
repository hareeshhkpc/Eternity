package com.hin.hl7messaging.utils;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;

import javax.xml.namespace.NamespaceContext;
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
import org.w3c.dom.Node;
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
			ex.printStackTrace();
			logger.error("An error occured in compilation of XpathExpression: "+ex.getMessage());
			return null;
		}
	}
	
	public static Object read(Document xmlDocument, String expression, QName returnType) {
		try {
			xPath = XPathFactory.newInstance().newXPath();			
			XPathExpression xPathExpression = xPath.compile(expression);
			return xPathExpression.evaluate(xmlDocument, returnType);
		} catch (XPathExpressionException ex) {
			ex.printStackTrace();
			logger.error("An error occured in compilation of XpathExpression: "+ex.getMessage());
			return null;
		}
	}
	
	public static Object read(Document xmlDocument, String expression, QName returnType, NamespaceContext namespaceContext) {
		try {
			xPath = XPathFactory.newInstance().newXPath();
			xPath.setNamespaceContext(namespaceContext);			
			XPathExpression xPathExpression = xPath.compile(expression);
			return xPathExpression.evaluate(xmlDocument, returnType);
		} catch (XPathExpressionException ex) {
			ex.printStackTrace();
			logger.error("An error occured in compilation of XpathExpression: "+ex.getMessage());
			return null;
		}
	}
	
	public static Document getXMLDocument(File messageFile){
		try {
			DocumentBuilder builder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
			Document doc = builder.parse(messageFile);
			return doc;
			
		} catch (UnsupportedEncodingException e) {		
			e.printStackTrace();
			logger.error("An eror occured while loading the file: "+e.getMessage());
		} catch (ParserConfigurationException e) {
			e.printStackTrace();
			logger.error("Parser configuratuon error: "+e.getMessage());
		} catch (SAXException e) {
			e.printStackTrace();
			logger.error("Parser not Found: "+e.getMessage());
		} catch (IOException e) {
			e.printStackTrace();
			logger.error("An error occured occured while parsing the file: "+e.getMessage());
		}
		return null;
		
	}
	
	public static Document getXMLDocument(File messageFile, boolean isNamespaceAware){
		try {
			DocumentBuilderFactory builderFactory = DocumentBuilderFactory.newInstance();
			builderFactory.setNamespaceAware(isNamespaceAware);
			DocumentBuilder builder = builderFactory.newDocumentBuilder();
			Document doc = builder.parse(messageFile);
			return doc;
			
		} catch (UnsupportedEncodingException e) {		
			e.printStackTrace();
			logger.error("An eror occured while loading the file: "+e.getMessage());
		} catch (ParserConfigurationException e) {
			e.printStackTrace();
			logger.error("Parser configuratuon error: "+e.getMessage());
		} catch (SAXException e) {
			e.printStackTrace();
			logger.error("Parser not Found: "+e.getMessage());
		} catch (IOException e) {
			e.printStackTrace();
			logger.error("An error occured occured while parsing the file: "+e.getMessage());
		}
		return null;
		
	}
	
	public static String getXMLDocumentAsString(Node doc) {
		try {
			StringWriter stw = new StringWriter();
			Transformer serializer = TransformerFactory.newInstance().newTransformer();
			serializer.transform(new DOMSource(doc), new StreamResult(stw));
			return stw.toString();
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("An error occured while transforming doc to String: "+e.getMessage());
			return null;
		}
	}
	
	public static void writeXMLDocumentToFile(Document doc, File file) {
		try {
			PrintWriter pw = new PrintWriter(file);
			Transformer serializer = TransformerFactory.newInstance().newTransformer();
			serializer.transform(new DOMSource(doc), new StreamResult(pw));
			pw.flush();
			pw.close();
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("An error occured while transforming doc to String: "+e.getMessage());
		}
	}
	
	public static Document getXMLDocument(String message){
		InputStream stream;
		try {
			stream = new ByteArrayInputStream(message.getBytes("UTF-8"));
			DocumentBuilderFactory objDocumentBuilderFactory = DocumentBuilderFactory.newInstance();
			objDocumentBuilderFactory.setIgnoringElementContentWhitespace(true);
			DocumentBuilder builder = objDocumentBuilderFactory.newDocumentBuilder();
			Document doc = builder.parse(stream);
			return doc;
			
		} catch (UnsupportedEncodingException e) {		
			e.printStackTrace();
			logger.error("An error occured while loading the file: "+e.getMessage());
		} catch (ParserConfigurationException e) {
			e.printStackTrace();
			logger.error("Parser configuration error: "+e.getMessage());
		} catch (SAXException e) {
			e.printStackTrace();
			logger.error("Parser not found: "+e.getMessage());
		} catch (IOException e) {
			e.printStackTrace();
			logger.error("An error occured while parsing the file:"+e.getMessage());
		}
		return null;
		
	}
}
