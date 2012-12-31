/**
 * 
 */
package com.hin.hl7messaging.configuration.generator;

import java.util.ArrayList;
import java.util.Arrays;

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
 * @author abdul.kahar
 *
 */
public class RecurseHelper {

	private ArrayList<String> visits = new ArrayList<String>();
	private ArrayList<String> findRIM = new ArrayList<String>();
	private ArrayList<String> coreSchema = new ArrayList<String>();
	private ArrayList<String> findElementGroup = new ArrayList<String>();
	private ArrayList<String> findAttributeGroup = new ArrayList<String>();
	private ArrayList<String> findSimpleType = new ArrayList<String>();
	private ArrayList<String> recurseFindSimpleType = new ArrayList<String>();
	private String anonymTypePrefix = "Anonym_";
	private String anonymComplexTypePrefix = "AnonymComplex_";
	private Integer anonymTypeLastId = 0;
	private Integer anonymComplexTypeLastId = 0;
	private Integer elementLastId = 0;
	private String vocabularySchema = "voc.xsd";
	
	private enum XSD_TYPE {
		SIMPLE, COMPLEX;
	};
	
	public String hello(){
		return "Hello";
	}
	
	public RecurseHelper getNewHelper(){
		RecurseHelper rh = new RecurseHelper();
		String[] cs = Arrays.copyOf(this.coreSchema.toArray(new String[]{}), this.coreSchema.size());
		for(String s : cs){
			rh.coreSchema.add(s);
		}
		return rh;
	}	
	
	public String generateElementId(){
		return "" + (++elementLastId);
	}
	public void resetElementId(){
		elementLastId = 0;
	}
	
	public void resetAnonymTypeLastId(String mode) {
		XSD_TYPE type = XSD_TYPE.valueOf(mode);
		switch(type){
			case SIMPLE : anonymTypeLastId = 0; break;
			case COMPLEX : anonymComplexTypeLastId = 0; break;
		}
	}
	
	public String generateAnonymTypeName(String mode){
		XSD_TYPE type = XSD_TYPE.valueOf(mode);
		String genId = "";
		switch(type){
			case SIMPLE : genId = anonymTypePrefix + (++anonymTypeLastId); break;
			case COMPLEX : genId = anonymComplexTypePrefix + (++anonymComplexTypeLastId); break;
		}
		return genId;
	}
	
	public String getAnonymTypePrefix() {
		return anonymTypePrefix;
	}

	public void setAnonymTypePrefix(String anonymTypePrefix) {
		this.anonymTypePrefix = anonymTypePrefix;
	}

	public Integer getAnonymTypeLastId() {
		return anonymTypeLastId;
	}

	public Object getUnionMemberTypesAsDOMSource(String unionMemberTypes) throws ParserConfigurationException, XPathExpressionException{
		DOMSource ds = new DOMSource();
		
		DocumentBuilderFactory domFactory = DocumentBuilderFactory.newInstance();
	    DocumentBuilder domBuilder = domFactory.newDocumentBuilder();

	    Document newDoc = domBuilder.newDocument();
	    Element rootElement = newDoc.createElement("memberTypes");
	    newDoc.appendChild(rootElement);
	    
	    Element element = null;
	    for(String member : unionMemberTypes.split(" ")){
	    	element = newDoc.createElement("name");
		    element.setTextContent(member);
		    rootElement.appendChild(element);
	    }
	    
	    ds.setNode(newDoc);
	    
	    XPathExpression xpe = XPathFactory.newInstance().newXPath().compile("/");
	    Object expRes = xpe.evaluate(newDoc, XPathConstants.NODESET);
	    
		return expRes;
	}
	
	public Object getCoreSchemaLocationAsDOMSource(String coreSchemaFullPath) throws ParserConfigurationException, XPathExpressionException{
		DOMSource ds = new DOMSource();
		
		DocumentBuilderFactory domFactory = DocumentBuilderFactory.newInstance();
	    DocumentBuilder domBuilder = domFactory.newDocumentBuilder();

	    Document newDoc = domBuilder.newDocument();
	    Element rootElement = newDoc.createElement("coreSchemas");
	    newDoc.appendChild(rootElement);
	    
	    Element element = null;
	    for(String schema : coreSchema){
	    	element = newDoc.createElement("name");
		    element.setTextContent(coreSchemaFullPath.concat(schema));
		    rootElement.appendChild(element);
	    }
	    
	    ds.setNode(newDoc);
	    
	    XPathExpression xpe = XPathFactory.newInstance().newXPath().compile("/");
	    Object expRes = xpe.evaluate(newDoc, XPathConstants.NODESET);
	    
		return expRes;
	}
	
	public String getFullPathOfSchema(String coreSchemaFullPath, String schemaFullPath, String location){		
		int index = getIndexOfPathSeparator(location) + 1;
		String loc = location.substring(index);
		return coreSchema.contains(loc) ? coreSchemaFullPath.concat(loc) : schemaFullPath.concat(location);
	}
	
	public Boolean isHL7VocabularySchema(String location){
		int index = getIndexOfPathSeparator(location) + 1;
		String loc = location.substring(index);
		return vocabularySchema.equals(loc);
	}
	
	public Boolean isHL7CoreSchema(String location){
		int index = getIndexOfPathSeparator(location) + 1;
		String loc = location.substring(index);
		return coreSchema.contains(loc);
	}
	
	public void keepVisited(String visitType, String location){
		int index = getIndexOfPathSeparator(location) + 1;
		String loc = location.substring(index);
		
		if(visitType.equals("visits")){
			visits.add(loc); 
		}
		else if(visitType.equals("findRIM")){
			findRIM.add(loc);
		}
		else if(visitType.equals("findElementGroup")){
			findElementGroup.add(loc);
		}
		else if(visitType.equals("findAttributeGroup")){
			findAttributeGroup.add(loc);
		}
		else if(visitType.equals("findSimpleType")){
			findSimpleType.add(loc);
		}
		else if(visitType.equals("recurseFindSimpleType")){
			recurseFindSimpleType.add(loc);
		}
	}
	
	public Boolean hasVisited(String visitType, String location){
		int index = getIndexOfPathSeparator(location) + 1;
		String loc = location.substring(index);
		
		if(visitType.equals("visits")){
			return (visits.contains(loc));
		}
		else if(visitType.equals("findRIM")){
			return (findRIM.contains(loc));
		}
		else if(visitType.equals("findElementGroup")){
			return (findElementGroup.contains(loc));
		}
		else if(visitType.equals("findAttributeGroup")){
			return (findAttributeGroup.contains(loc));
		}
		else if(visitType.equals("findSimpleType")){
			return (findSimpleType.contains(loc));
		}
		else if(visitType.equals("recurseFindSimpleType")){
			return (recurseFindSimpleType.contains(loc));
		}
		return Boolean.TRUE;
	}
	
	public void clearCaches(String visitType){
		if(visitType.equals("visits")){
			visits.clear();
		}
		else if(visitType.equals("findRIM")){
			findRIM.clear();
		}
		else if(visitType.equals("findElementGroup")){
			findElementGroup.clear();
		}
		else if(visitType.equals("findAttributeGroup")){
			findAttributeGroup.clear();
		}
		else if(visitType.equals("findSimpleType")){
			findSimpleType.clear();
		}
		else if(visitType.equals("recurseFindSimpleType")){
			recurseFindSimpleType.clear();
		}
	}
	
	public int getIndexOfPathSeparator(String pathFragment){
		return (pathFragment.lastIndexOf('\\') > -1) ? pathFragment.lastIndexOf('\\') : (pathFragment.lastIndexOf('/') > -1) ? pathFragment.lastIndexOf('/') : -1;
	}

	/**
	 * @return the visits
	 */
	public ArrayList<String> getVisits() {
		return visits;
	}

	/**
	 * @return the coreSchema
	 */
	public ArrayList<String> getCoreSchema() {
		return coreSchema;
	}
}
