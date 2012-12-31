package com.hin.hl7messaging;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.apache.log4j.Logger;
import org.xml.sax.SAXException;

public class MessageValidator {
	private Logger logger = Logger.getLogger(MessageValidator.class.getName());
	
	public void messageValidate(String message) throws Exception{
		try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            factory.setValidating(true);
            factory.setNamespaceAware(true);
            factory.setAttribute("http://java.sun.com/xml/jaxp/properties/schemaLanguage", 
            	      "http://www.w3.org/2001/XMLSchema");

            InputStream stream = new ByteArrayInputStream(message.getBytes("UTF-8"));
            DocumentBuilder builder = factory.newDocumentBuilder();
            builder.setErrorHandler(new MessageValidationErrorHandler());      
            builder.parse(stream);		
            
	   } catch (ParserConfigurationException e) {
            e.printStackTrace();
            logger.error("Parser not found:"+e.getMessage());
            Exception ex = new Exception("Invalid Message", e);
            throw ex;
       } catch (SAXException e) {
            e.printStackTrace();
            logger.error("An error occured while parsing the file:"+e.getMessage());
            Exception ex = new Exception("Invalid Message", e);
            throw ex;
            
       } catch (IOException e) {
            e.printStackTrace();
            logger.error("An error occured while parsing the file:"+e.getMessage());
            Exception ex = new Exception("Invalid Message", e);
            throw ex;
       }
    }
}
