package za.co.hsol.hl7adapter.defs;

import java.util.HashMap;
import java.util.Map;

import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

public class XsdChoice {
	private XsdDocument mOwner;
	private Element mXsdDef;

	public XsdChoice(XsdDocument owner, Element xsdDef){
		mOwner = owner;
		mXsdDef = xsdDef;
	}
	
	public int minOccurs(){
		return mXsdDef.hasAttribute("minOccurs") ? Integer.parseInt(mXsdDef.getAttribute("minOccurs")) : 1;
	}

	public int maxOccurs(){
		return mXsdDef.hasAttribute("maxOccurs") ? Integer.parseInt(mXsdDef.getAttribute("maxOccurs")) : 1;
	}

	public Map<String,XsdElement> findChildElements(){
		HashMap<String,XsdElement> result = new HashMap<String,XsdElement>();
		
		NodeList nl = mOwner.findNode("./xs:element", mXsdDef);		
		for(int i=0; i<nl.getLength(); i++){
			Element child = (Element)nl.item(i);
			result.put(child.getAttribute("name"),new XsdElement(mOwner,child));
		}
		return result;
	}	
	
}
