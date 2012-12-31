/**
 * 
 */
package com.hin.hl7messaging.configuration.web.rest;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.xml.namespace.NamespaceContext;
import javax.xml.xpath.XPathConstants;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import com.hin.domain.config.CONFIG_OBJECT_TYPE;
import com.hin.domain.config.ConfigAttribute;
import com.hin.domain.config.ConfigClass;
import com.hin.domain.config.ConfigField;
import com.hin.domain.config.HL7MessageConfiguration;
import com.hin.domain.config.HL7SchemaNamespaceContext;
import com.hin.domain.config.IConfigElement;
import com.hin.domain.config.RIM_TYPE;
import com.hin.hl7messaging.utils.XMLHelper;

/**
 * @author Administrator
 *
 */
public class ConfigParser {

	public static HL7MessageConfiguration createConfiguration(File schema) throws Exception{
		HL7MessageConfiguration configuration = new HL7MessageConfiguration();

		if(!schema.exists()){
			throw new Exception("Target message type schema doesn't exist: " + schema.getName());
		}
		
		File coreSchema = new File(schema.getParentFile().getParentFile(), "coreschemas/datatypes-base.xsd");
		Document datatypeDoc = XMLHelper.getXMLDocument(coreSchema, true);
		Document interactionDocument = XMLHelper.getXMLDocument(schema, true);
		HL7SchemaNamespaceContext context = new HL7SchemaNamespaceContext();
		
		// Generate class view
		ConfigClass configClass = new ConfigClass();
		
		/**
		 * This class view has the root class and its field information
		 */
		configClass = getRootClassView(schema, datatypeDoc, interactionDocument, context);
		
		// We need to fetch all Participations/ActRelationships of this root Act
		populateAssociationClasses(configClass, datatypeDoc, interactionDocument, context, schema);			
		
		configuration.setConfigClass(configClass);
		
		updateConfigurationPropertyDefaults(configuration);
		
		return configuration;		
	}
	
	public static void updateConfigurationPropertyDefaults(IConfigElement configElement){
		if(configElement.getConfigType() == CONFIG_OBJECT_TYPE.MESSAGE){
			updateConfigurationPropertyDefaults(((HL7MessageConfiguration)configElement).getConfigClass());
		}
		else if(configElement.getConfigType() == CONFIG_OBJECT_TYPE.CLASS){
			((ConfigClass)configElement).setDisplayOrder(0);
			((ConfigClass)configElement).setInputControl("Class");

			int i = 0;
			for(ConfigField field : ((ConfigClass)configElement).getFields()){
				field.setDisplayOrder(i++);
				field.setInputControl(field.getType());
			}
			i = 0;
			for(ConfigClass configClass : ((ConfigClass)configElement).getClasses()){
				configClass.setDisplayOrder(i++);
				updateConfigurationPropertyDefaults(configClass);
			}
		}
	}

	public static void populateAssociationClasses(
			ConfigClass configClass,
			Document datatypeDoc, 
			Document interactionDocument, 
			HL7SchemaNamespaceContext context, 
			File interactSchema) throws ServletException {
		
		// Check if this type is in the same file
		Double count = (Double) XMLHelper.read(interactionDocument, "count(//xs:complexType[@name='" + configClass.getType() + "'])", XPathConstants.NUMBER, context);
		ConfigClass assocClass = null;
		File schemaFile = null;
		Document document = null;
		List<Element> rimElements = null;
		if(count > 0.0){
			rimElements = getObjects(configClass.getType(), interactionDocument, datatypeDoc, context);
		} else {
			schemaFile = getSchemaFileFromTypeName(interactSchema,	configClass.getType());
			document = XMLHelper.getXMLDocument(schemaFile, true);
			rimElements = getObjects(configClass.getType(), document, datatypeDoc, context);
		}
		
		for(Element element : rimElements){
			// Check if this type is in the same file
			count = (Double) XMLHelper.read(interactionDocument, "count(//xs:complexType[@name='" + element.getAttribute("type") + "'])", XPathConstants.NUMBER, context);
			if(count > 0.0){
				assocClass = getClassView(element.getAttribute("type"), interactionDocument, datatypeDoc, context, interactSchema);	
			} else {
				schemaFile = getSchemaFileFromTypeName(interactSchema,	element.getAttribute("type"));
				document = XMLHelper.getXMLDocument(schemaFile, true);
				assocClass = getClassView(element.getAttribute("type"), document, datatypeDoc, context, schemaFile);	
			}				
			assocClass.setTagName(element.getAttribute("name"));
			configClass.getClasses().add(assocClass);
			
			// Get role info
			List<Element> roleElements = getObjects(element.getAttribute("type"), (document != null) ? document : interactionDocument, datatypeDoc, context);
			Element roleElement = (roleElements != null) ? roleElements.get(0) : null;
			if(roleElement == null){
				// No role
				continue;
			}
			
			ConfigClass roleClass = null;
			count = (Double) XMLHelper.read((document != null) ? document : interactionDocument, "count(//xs:complexType[@name='" + roleElement.getAttribute("type") + "'])", XPathConstants.NUMBER, context);
			if(count > 0.00){
				roleClass = getClassView(roleElement.getAttribute("type"), interactionDocument, datatypeDoc, context, interactSchema);	
			} else {
				schemaFile = getSchemaFileFromTypeName(interactSchema,	roleElement.getAttribute("type"));
				document = XMLHelper.getXMLDocument(schemaFile, true);
				roleClass = getClassView(roleElement.getAttribute("type"), document, datatypeDoc, context, schemaFile);	
			}
			roleClass.setTagName(roleElement.getAttribute("name"));
			assocClass.getClasses().add(roleClass);
			// Check if assocClass is a Participation/ActRelationship
			if(roleClass.getRIMType() == RIM_TYPE.ROLE){
				assocClass.setRIMType(RIM_TYPE.PARTICIPATION);
			} else if(roleClass.getRIMType() == RIM_TYPE.ACT){
				assocClass.setRIMType(RIM_TYPE.ACTRELATIONSHIP);
			} 
			
			// Get entity info of
			List<Element> entityElements = getObjects(roleElement.getAttribute("type"), (document != null) ? document : interactionDocument, datatypeDoc, context);
			for(Element e : entityElements){
				count = (Double) XMLHelper.read((document != null) ? document : interactionDocument, "count(//xs:complexType[@name='" + e.getAttribute("type") + "'])", XPathConstants.NUMBER, context);
				ConfigClass entityClass = null;				
				if(count > 0.0){
					entityClass = getClassView(e.getAttribute("type"), interactionDocument, datatypeDoc, context, interactSchema);	
				} else {
					schemaFile = getSchemaFileFromTypeName(interactSchema,	e.getAttribute("type"));
					document = XMLHelper.getXMLDocument(schemaFile, true);
					entityClass = getClassView(e.getAttribute("type"), document, datatypeDoc, context, schemaFile);	
				}
				entityClass.setTagName(e.getAttribute("name"));
				entityClass.setLabel(getFormattedLabel(e.getAttribute("name")));
				roleClass.getClasses().add(entityClass);
			}
		}
	}
	
	public static List<Element> getObjects(String className, Document interactionDocument, Document datatypeDoc, NamespaceContext context){
		List<Element> elements = new ArrayList<Element>();
		NodeList nodeList = (NodeList) XMLHelper.read(interactionDocument, "//xs:complexType[@name='" + className + "']//xs:element", XPathConstants.NODESET, context);
		for(int i = 0; nodeList != null && i < nodeList.getLength(); i++){
			Element element = (Element) nodeList.item(i);
			Double countInHL7Types = (Double) XMLHelper.read(datatypeDoc, "count(//xs:complexType[@name='" + element.getAttribute("type") + "'])", XPathConstants.NUMBER, context);
			if(countInHL7Types < 1.0){
				elements.add(element);
			}
		}
		return elements;
	}

	/**
	 * @param interactSchema
	 * @param datatypeDoc
	 * @return
	 * @throws ServletException
	 */
	public static ConfigClass getRootClassView(File interactSchema,
			Document datatypeDoc, Document document, HL7SchemaNamespaceContext context) throws ServletException {
		ConfigClass configClass = null;
		String controlAct = (String) XMLHelper.read(document, "//xs:element[@name='controlActProcess']/@type", XPathConstants.STRING, context);
		String subjectActRelationship = (String) XMLHelper.read(document, "//xs:complexType[@name='" + controlAct + "']//xs:element[@name='subject']/@type", XPathConstants.STRING, context);
		String rootClass = (String) XMLHelper.read(document, "//xs:complexType[@name='" + subjectActRelationship + "']//xs:element[1]/@type", XPathConstants.STRING, context);
		String rootTagName = (String) XMLHelper.read(document, "//xs:complexType[@name='" + subjectActRelationship + "']//xs:element[1]/@name", XPathConstants.STRING, context);

		Double rootClassCount = (Double) XMLHelper.read(document, "count(//xs:complexType[@name='" + rootClass + "'])", XPathConstants.NUMBER, context);
		if(rootClassCount > 0.0){
			configClass = getClassView(rootClass, document, datatypeDoc, context, interactSchema);
		} else {
			File schemaFile = getSchemaFileFromTypeName(interactSchema,
					rootClass);
			document = XMLHelper.getXMLDocument(schemaFile, true);
			configClass = getClassView(rootClass, document, datatypeDoc, context, schemaFile);
		}
		configClass.setTagName(rootTagName);
		return configClass;
	}

	/**
	 * @param interactSchema
	 * @param rootClass
	 * @return
	 * @throws ServletException
	 */
	public static File getSchemaFileFromTypeName(File interactSchema, String className)
			throws ServletException {
		String schemaName = className.substring(0, className.indexOf('.'));
		File schemaFile = new File(interactSchema.getParentFile(), schemaName.concat(".xsd"));
		if(!schemaFile.exists()){
			throw new ServletException("Included schema doesn't exist: " + schemaName.concat(".xsd"));
		}
		return schemaFile;
	}
	
	public static ConfigClass getClassView(String className, Document document, Document datatypeDoc, HL7SchemaNamespaceContext context, File interactSchema) {
		ConfigClass configClass = new ConfigClass();
		configClass.setTagName(className);
		configClass.setType(className);
		String formattedDisplayName = getFormattedLabel(className);
		configClass.setLabel(formattedDisplayName);
		
		// Rim Type
		RIM_TYPE type = getRIMType(className, document, context);
		configClass.setRIMType(type);
		
		NodeList nodeList = (NodeList) XMLHelper.read(document, "//xs:complexType[@name='" + className + "']//xs:element", XPathConstants.NODESET, context);
		for(int i = 0; nodeList != null && i < nodeList.getLength(); i++){
			Element element = (Element) nodeList.item(i);
			Double countInHL7Types = (Double) XMLHelper.read(datatypeDoc, "count(//xs:complexType[@name='" + element.getAttribute("type") + "'])", XPathConstants.NUMBER, context);
			if(countInHL7Types < 1.0){		
				continue;
			}			
			ConfigField field = new ConfigField();
			field.setTagName(element.getAttribute("name"));
			field.setType(element.getAttribute("type"));
			field.setLabel(getFormattedLabel(element.getAttribute("name")));
			field.setMinOccurs(getMinMaxCount(element, "minOccurs"));
			field.setMaxOccurs(getMinMaxCount(element, "maxOccurs"));
			field.setDisplayOrder(i);
			configClass.getFields().add(field);
		}
		
		nodeList = (NodeList) XMLHelper.read(document, "//xs:complexType[@name='" + className + "']//xs:attribute", XPathConstants.NODESET, context);
		for(int i = 0; nodeList != null && i < nodeList.getLength(); i++){
			Element element = (Element) nodeList.item(i);
			ConfigAttribute attr = new ConfigAttribute();
			attr.setTagName(element.getAttribute("name"));
			attr.setType(element.getAttribute("type"));
			attr.setLabel(getFormattedLabel(element.getAttribute("name")));
			attr.setDisplayOrder(i);
			configClass.getAttributes().add(attr);
		}
		
		return configClass;
	}
	
	public static Integer getMinMaxCount(Element element, String minMax){
		Integer minMaxVal = 0;
		if(element.hasAttribute(minMax)){
			String val = element.getAttribute(minMax);
			if(val.charAt(0) >= 48 && val.charAt(0) <= 58){
				minMaxVal = Integer.parseInt(val);
			}
			else {
				minMaxVal = -1;
			}
		}
		else {
			if(element.getNodeName().equals("xs:element")){
				minMaxVal = 1;
			}
		}
		return minMaxVal;
	}

	/**
	 * @param className
	 * @param document
	 * @param context
	 * @return
	 */
	public static RIM_TYPE getRIMType(String className, Document document,
			HL7SchemaNamespaceContext context) {
		RIM_TYPE type = RIM_TYPE.UNIDENTIFIED;
		Double moodCodeCount = (Double) XMLHelper.read(document, "count(//xs:complexType[@name='" + className + "']/xs:attribute[@name='moodCode'])", XPathConstants.NUMBER, context);
		Double classCodeCount = (Double) XMLHelper.read(document, "count(//xs:complexType[@name='" + className + "']/xs:attribute[@name='classCode'])", XPathConstants.NUMBER, context);
		Double determinerCodeCount = (Double) XMLHelper.read(document, "count(//xs:complexType[@name='" + className + "']/xs:attribute[@name='determinerCode'])", XPathConstants.NUMBER, context);
		Double typeCodeCount = (Double) XMLHelper.read(document, "count(//xs:complexType[@name='" + className + "']/xs:attribute[@name='typeCode'])", XPathConstants.NUMBER, context);
		
		if(moodCodeCount == 1 && classCodeCount == 1){
			type = RIM_TYPE.ACT;
		} else if(determinerCodeCount == 1 && classCodeCount == 1){
			type = RIM_TYPE.ENTITY;
		} else if(classCodeCount == 1 && typeCodeCount == 0){
			type = RIM_TYPE.ROLE;
		}
		return type;
	}
	
	public static String getFormattedLabel(String className) {
		String displayName = (className.lastIndexOf('.') > -1) ? className.substring(className.lastIndexOf('.') + 1) : className;
		String formattedDisplayName = "";
		int li = 0;
		for(int si = 0; si < displayName.length(); si++){
			if(displayName.charAt(si) >= 'A' && displayName.charAt(si) <= 'Z'){
				formattedDisplayName += displayName.substring(li, si);
				formattedDisplayName += " ";
				li = si;
			}
		}
		formattedDisplayName += displayName.substring(li);
		formattedDisplayName = formattedDisplayName.substring(0, 1).toUpperCase() + formattedDisplayName.substring(1);
		formattedDisplayName = formattedDisplayName.trim();
		return formattedDisplayName;
	}
	
}
