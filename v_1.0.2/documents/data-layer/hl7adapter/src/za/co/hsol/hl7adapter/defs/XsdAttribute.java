package za.co.hsol.hl7adapter.defs;

import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

public class XsdAttribute {
     private Node mAttr;
	private XsdElement mOwner;
     
     public XsdAttribute(XsdElement owner, Node attr){
    	 mOwner = owner;
    	 mAttr = attr;
     }
     
     public String getName(){
    	 
    	 return mAttr.getAttributes().getNamedItem("name").getNodeValue();
     }
     
     
     public boolean isRequired(){
    	 boolean result = false;
    	 Node use = mAttr.getAttributes().getNamedItem("use");
  		 if(use != null){
				result = use.getNodeValue().equals("required");
         }
  		 return result;
     }

	public String getDefaultValue() {
			String result = null;
			MifDocument mif = mOwner.getOwner().getMifDocument();
			
			NodeList nl = mif.findDefaultValue(mOwner.getName(), getName());
			if(nl.getLength()!=0){
				Element n = (Element)nl.item(0);
				result = n.getAttribute("mnemonic");
			}

			return result;

	}
     
}
