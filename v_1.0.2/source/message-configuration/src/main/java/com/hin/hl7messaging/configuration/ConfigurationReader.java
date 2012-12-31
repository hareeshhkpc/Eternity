package com.hin.hl7messaging.configuration;

import java.io.InputStream;
import java.util.HashMap;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.xpath.XPathConstants;

import org.w3c.dom.Document;
import org.w3c.dom.NodeList;

import com.hin.hl7messaging.cassandra.XPATHReader;
import com.hin.hl7messaging.domain.MessageTypeDefinition;

public class ConfigurationReader {
	
	public MessageTypeDefinition getConfiguration(String artifactID) throws Exception{
		MessageTypeDefinition typeDefinition = new MessageTypeDefinition();
		InputStream stream = getClass().getResourceAsStream("/MessageConfiguration.xml");
		DocumentBuilder builder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
		Document doc = builder.parse(stream);		
	   
		String artifact="", columnFamily="", columnName="",xpath="";
	    HashMap<String,Object> columnFieldsMap = new HashMap<String,Object>();
		XPATHReader reader = new XPATHReader(doc);
		
		String msgType = "/message/message-type";
		NodeList fields = (NodeList) reader.read(msgType, XPathConstants.NODESET);
		int messageTypeSize = fields.getLength();
		
		for (int i = 1; i <= messageTypeSize; i++) {
			artifact = "/message/message-type[" + i + "]/@artifactID";
			artifact = (String) reader.read(artifact, XPathConstants.STRING);
			
			if(artifact.equals(artifactID)){
				
				//System.out.println(artifact);
				typeDefinition.setArtifactsID(artifact);
				
				columnFamily ="//message-type[" + i + "]/@name";
				columnFamily = (String) reader.read(columnFamily, XPathConstants.STRING);
				typeDefinition.setColumnFamily(columnFamily);

				String columnType = "//message-type[" + i + "]/index-fields/field";
				NodeList colFlds = (NodeList) reader.read(columnType, XPathConstants.NODESET);
				int columnSize = colFlds.getLength();			
				
				for(int j=1; j<=columnSize; j++){
					columnName = "//message-type[" + i + "]/index-fields/field[" + j + "]/@name";
					columnName = (String) reader.read(columnName, XPathConstants.STRING);
					xpath = "//message-type[" + i + "]/index-fields/field[" + j + "]/@xpath";
					xpath = (String) reader.read(xpath, XPathConstants.STRING);
					columnFieldsMap.put(columnName, xpath);
				}				
			}
		}
		//System.out.println(columnFieldsMap);
		typeDefinition.setMap(columnFieldsMap);
		return typeDefinition;
	}
	
	public MessageTypeDefinition setClientField() throws Exception{
		MessageTypeDefinition typeDefinition = new MessageTypeDefinition();
		InputStream stream = getClass().getResourceAsStream("/MessageConfiguration.xml");
		DocumentBuilder builder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
		Document doc = builder.parse(stream);		
	    
		String xpath="",name="";
	    HashMap<String,Object> clientFieldsMap = new HashMap<String,Object>();
		XPATHReader reader = new XPATHReader(doc);
		
		String msgtype = "/message/message-type/client-fields/field";
		NodeList fields = (NodeList) reader.read(msgtype, XPathConstants.NODESET);
		int messageTypeSize = fields.getLength();

		for(int i=1; i<=messageTypeSize; i++){
			name = "//client-fields/field["+ i + "]/@name" ;
			name = (String) reader.read(name, XPathConstants.STRING);
			xpath = "//client-fields/field["+ i + "]/@xpath" ;
			xpath = (String) reader.read(xpath, XPathConstants.STRING);
			clientFieldsMap.put(name, xpath);
		}
		
	    typeDefinition.setClientFieldsMap(clientFieldsMap);
		return typeDefinition;
	}
	
	public MessageTypeDefinition getDeidentifiedField() throws Exception{
		MessageTypeDefinition typeDefinition = new MessageTypeDefinition();
		InputStream stream = getClass().getResourceAsStream("/MessageConfiguration.xml");
		DocumentBuilder builder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
		Document doc = builder.parse(stream);		
	    
		String xpath="",name="",defaultValue="";
	    HashMap<String,Object> deidenitfiedMap = new HashMap<String,Object>();
		XPATHReader reader = new XPATHReader(doc);
		
		String msgtype = "/message/message-type/deidentified-fields/field";
		NodeList fields = (NodeList) reader.read(msgtype, XPathConstants.NODESET);
		int messageTypeSize = fields.getLength();
		
		for(int i=1; i<=messageTypeSize; i++){
			name = "//deidentified-fields/field["+ i + "]/@name" ;
			name = (String) reader.read(name, XPathConstants.STRING);
			//System.out.println(name);
			xpath = "//deidentified-fields/field["+ i + "]/@xpath" ;
			xpath = (String) reader.read(xpath, XPathConstants.STRING);
			//System.out.println(xpath);
			deidenitfiedMap.put(name, xpath);
		}
		defaultValue = "//deidentified-fields/field/@value" ;
		defaultValue = (String) reader.read(defaultValue, XPathConstants.STRING);

		typeDefinition.setDefaultValue(defaultValue);
	    typeDefinition.setDeidenitfiedMap(deidenitfiedMap);

	    return typeDefinition;
	}
}
