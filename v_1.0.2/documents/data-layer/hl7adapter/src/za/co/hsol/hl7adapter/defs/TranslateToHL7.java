package za.co.hsol.hl7adapter.defs;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.w3c.dom.Attr;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import za.co.hsol.hl7adapter.meta.ConfigClass;
import za.co.hsol.hl7adapter.meta.ConfigDocument;
import za.co.hsol.hl7adapter.smo.SMOMessage;
import za.co.hsol.hl7adapter.smo.SMOObject;

public class TranslateToHL7 {

	

	private static final String W3_ORG_2001_XML_SCHEMA_INSTANCE = "http://www.w3.org/2001/XMLSchema-instance";
	private static final String URN_HL7_ORG_V3 = "urn:hl7-org:v3";


	public TranslateToHL7(){

	}
	
	public Document translate(SMOMessage message){
        Document result = message.getEmptyXMLDoc();
        ConfigDocument config = message.getConfigDocument();
        
        SMOObject root = message.rootObject();
        String rootClassName = config.getChildClassNames().get(0);        
        Element rootElement = result.createElement(rootClassName);    
        rootElement.setAttribute("xmlns", URN_HL7_ORG_V3);
        rootElement.setAttribute("xmlns:xs", W3_ORG_2001_XML_SCHEMA_INSTANCE);
        result.appendChild(rootElement);

		ConfigClass rootConfig = root.getConfigClass();		
		String elementType = rootConfig.getDatatype();
		XsdDocument doc = XsdDocument.getDocumentForElementType(elementType);		
		XsdElement xsdDef = doc.getElement(elementType);
		translateElement(xsdDef,root.getXML(), rootElement);
                
        return result;
	}
	
	
	
	private void addNils(Map<String,XsdElement> elementMap, XsdElement fieldDef, Element object, Element target){
		// Add nil fields
		for(String fieldName :elementMap.keySet()){
			XsdElement def = elementMap.get(fieldName);
			if(def.isNillable() &&  def.minOccurs()>0 & !def.isChoice()){
				if(object.getElementsByTagName(fieldName).getLength() == 0){					
					Element childElement = target.getOwnerDocument().createElement(fieldName);
					childElement.setAttribute("xs:nil", "true");

					XsdDocument fieldDoc = XsdDocument.getDocumentForElementType(def.getDataType());
					XsdElement fieldXsdDef = fieldDoc.getElement(def.getDataType());
					translateElement(fieldXsdDef, null, childElement);

					target.appendChild(childElement);
				}
			}
		}

		// Add nil fields for choice
		List<XsdChoice> choiceElementList = fieldDef.findChoiceElement();
		for(XsdChoice choice :choiceElementList){
			if(choice.minOccurs() != 0){
				boolean isNil = true;
				for(XsdElement element : choice.findChildElements().values()){
					isNil &= object.getElementsByTagName(element.getName()).getLength() == 0; 						
				}
				if(isNil){
					for(String fieldName: choice.findChildElements().keySet()){
						XsdElement def = elementMap.get(fieldName);
						if(def.isNillable()){
							Element childElement = target.getOwnerDocument().createElement(fieldName);
							childElement.setAttribute("xs:nil", "true");

							XsdDocument fieldDoc = XsdDocument.getDocumentForElementType(def.getDataType());
							XsdElement fieldXsdDef = fieldDoc.getElement(def.getDataType());
							translateElement(fieldXsdDef, null, childElement);

							target.appendChild(childElement);
							break; 
						}
					}	
				}
			}
		}
	}
	
	
	private void translateElement(XsdElement fieldDef,Element fieldObject, Element target) {
	
		// Add default HL7 attributes
		Map<String, XsdAttribute> attrMap = fieldDef.findAttributes();
		for(XsdAttribute a: attrMap.values()){
			translateAttribute(a, fieldObject, target);
		}


		if(fieldObject !=null){
			// Split field nodes into target child nodes and attributes
			HashMap<String,XsdElement> elementMap = new HashMap<String,XsdElement>();
			ArrayList<XsdElement> elementList = new ArrayList<XsdElement>();
			fieldDef.findChildElements(elementMap, elementList);						
						
			
			for(String childFieldName:attrMap.keySet()){
				NodeList cn = fieldDef.getOwner().findNode("./"+childFieldName, fieldObject);
				for(int i=0; i< cn.getLength(); i++){
					target.setAttribute(childFieldName,cn.item(i).getTextContent());
				}
			}
			
			for(int j=0; j<elementList.size(); j++){
				String childFieldName = elementList.get(j).getName();
				NodeList cn = fieldDef.getOwner().findNode("./"+childFieldName, fieldObject);


				for(int i=0; i< cn.getLength(); i++){
                    Element n = (Element)cn.item(i);
					Element childTarget = target.getOwnerDocument().createElement(childFieldName);
					
					if(n.getFirstChild().getNodeType() == Document.TEXT_NODE) {
						childTarget.setTextContent(n.getTextContent());
					}
					XsdElement def = elementMap.get(childFieldName);
					
					XsdDocument fieldDoc = XsdDocument.getDocumentForElementType(def.getDataType());
					XsdElement fieldXsdDef = fieldDoc.getElement(def.getDataType());

					translateElement(fieldXsdDef, n, childTarget );
					target.appendChild(childTarget);
				}
			}
			addNils(elementMap, fieldDef, fieldObject, target);
		}
		
	}


	private void translateAttribute(XsdAttribute attributeDef, Element object, Element target) {
		String attrName = attributeDef.getName();
		// does it exist
		
		String value = null;
		if(object != null){
			Attr n = object.getAttributeNode(attrName);
			if(n !=null) {
				value = n.getNodeValue();
			}
		}
		// otherwise add the default value
		if(value == null ){
			if(attributeDef.isRequired()){
				String defaultValue = attributeDef.getDefaultValue();  //, String parentDataType
				target.setAttribute(attrName, defaultValue);		
			}
		}
	}

}
