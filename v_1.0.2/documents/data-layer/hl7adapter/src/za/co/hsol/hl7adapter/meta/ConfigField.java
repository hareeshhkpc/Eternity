package za.co.hsol.hl7adapter.meta;

import java.util.ArrayList;
import java.util.List;

import javax.xml.xpath.XPathExpressionException;

import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;

public class ConfigField {
 
	private Element mFieldNode;

	public ConfigField(Element fieldNode){
		mFieldNode = fieldNode;
	}
	

	public String getProperty(String propertyName){
		return mFieldNode.getAttribute(propertyName);
	}
	
    public List<String>getPropertyNames() {
   	 ArrayList<String> l = new ArrayList<String>();
   	 NamedNodeMap map = mFieldNode.getAttributes();
   	 for(int i=0; i<map.getLength();i++) l.add(map.item(i).getNodeName());
   	 return l;
    }   
	
	public Class getType(Object value){
		return value.getClass();
		// maybe these should be enums?
	}

	public String getFieldName(){
		return getProperty("tagName");
	}

	public int getMinOccurs() {
		
		return Integer.parseInt(getProperty("minOccurs"));
	}


	public String getDataType() {
		
		return getProperty("type");
	}
}
