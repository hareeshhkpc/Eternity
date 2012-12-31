package za.co.hsol.hl7adapter.defs;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

public class XsdElement {
	
	
	private XsdDocument mOwner;
	private String mElementType;
	private Element mXsdDef;

	public XsdElement(XsdDocument owner, Element xsdDef){
		mOwner = owner;
		mXsdDef = xsdDef;
	}
	
	public Map<String,XsdAttribute> findAttributes() {
		NodeList nl = mOwner.findNode(".//xs:attribute", mXsdDef);
		HashMap<String,XsdAttribute> result = new HashMap<String,XsdAttribute>();
		for(int i=0; i<nl.getLength(); i++){
			Element attr = (Element)nl.item(i);
			
			result.put(attr.getAttribute("name"),new XsdAttribute(this, nl.item(i)));
		}
		Node ext = mOwner.findSingleNode(".//xs:extension", mXsdDef);
		if(ext != null){
			String baseType = ext.getAttributes().getNamedItem("base").getNodeValue();
			XsdDocument doc = XsdDocument.getDocumentForElementType(baseType);
			XsdElement baseElement = doc.getElement(baseType);
			Map<String,XsdAttribute> attrList = baseElement.findAttributes();
			for(XsdAttribute a : attrList.values()){
				result.put(a.getName(),a);
			}
		}

		NodeList groups =  mOwner.findNode(".//xs:attributeGroup", mXsdDef);
		for(int i=0; i<groups.getLength(); i++){
			String ref = groups.item(i).getAttributes().getNamedItem("ref").getNodeValue();
			XsdDocument doc = XsdDocument.getDocumentForElementType(ref);
			XsdElement refElement = doc.getAttributeGroupDef(ref);
			Map<String, XsdAttribute> attrList = refElement.findAttributes();
			for(XsdAttribute a : attrList.values()){
				result.put(a.getName(),a);
			}			
		}
		return result;
	}
	
	public void findChildElements(Map<String,XsdElement> map, List<XsdElement> list){
		
		
		NodeList nl = mOwner.findNode(".//xs:element", mXsdDef);		
		for(int i=0; i<nl.getLength(); i++){
			Element child = (Element)nl.item(i);
			XsdElement e = new XsdElement(mOwner,child);
			map.put(child.getAttribute("name"),e);
			list.add(e);
		}
		
		Node ext = mOwner.findSingleNode("./xs:complexContent/xs:extension", mXsdDef);
		if(ext != null){
			String baseType = ext.getAttributes().getNamedItem("base").getNodeValue();
			XsdDocument doc = XsdDocument.getDocumentForElementType(baseType);
			XsdElement baseElement = doc.getElement(baseType);
			baseElement.findChildElements(map, list);
		}
		
		
		NodeList groups =  mOwner.findNode("./xs:group", mXsdDef);
		for(int i=0; i<groups.getLength(); i++){
			String ref = groups.item(i).getAttributes().getNamedItem("ref").getNodeValue();
			XsdDocument doc = XsdDocument.getDocumentForElementType(ref);
			XsdElement refElement = doc.getGroupDef(ref);
			refElement.findChildElements(map,list);
		}
		
		
	}
	
	/*public Map<String, XsdChoice> findChoiceElementMap(){
		HashMap<String, XsdChoice> result = new HashMap<String,XsdChoice>();
		NodeList choiceList = mOwner.findNode("./xs:choice", mXsdDef);
		for(int c=0; c<choiceList.getLength(); c++){
			Element choiceElement = (Element)choiceList.item(c);
			XsdChoice choice = new XsdChoice(mOwner, choiceElement);
			NodeList nl = mOwner.findNode("./xs:element", choiceList.item(c));			
			for(int i=0; i<nl.getLength(); i++){
				Element child = (Element)nl.item(i);
				result.put(child.getAttribute("name"), choice);
			}			
		}		
		return result;
	}*/

	public List<XsdChoice> findChoiceElement(){
		List<XsdChoice> result = new ArrayList<XsdChoice>();
		NodeList choiceList = mOwner.findNode(".//xs:choice", mXsdDef);
		for(int c=0; c<choiceList.getLength(); c++){
			Element choiceElement = (Element)choiceList.item(c);
			XsdChoice choice = new XsdChoice(mOwner, choiceElement);
			result.add(choice);
		}		
		return result;
	}

	
	
	public boolean isNillable(){
		return mXsdDef.hasAttribute("nillable") ? mXsdDef.getAttribute("nillable").equals("true") : false;
	}

	public int minOccurs(){
		return mXsdDef.hasAttribute("minOccurs") ? Integer.parseInt(mXsdDef.getAttribute("minOccurs")) : 0;
	}
	
	public String getName() {
		return mXsdDef.getAttribute("name");
	}

	public XsdDocument getOwner() {
		return mOwner;
	}

	public void setOwner(XsdDocument owner) {
		mOwner = owner;
	}


	public Element getXsdDef() {
		return mXsdDef;
	}

	public void setXsdDef(Element xsdDef) {
		mXsdDef = xsdDef;
	}

	public String getDataType() {
		return mXsdDef.getAttribute("type");
	}

	public boolean isChoice() {
		boolean result = false;
		if(mXsdDef.getParentNode()!= null){
				Element parent = (Element)mXsdDef.getParentNode();
				result = parent.getTagName().equals("xs:choice");
		}
		return result;
	}

	
	
	
	
}
