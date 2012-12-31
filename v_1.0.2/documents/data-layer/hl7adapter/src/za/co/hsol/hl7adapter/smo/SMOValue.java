package za.co.hsol.hl7adapter.smo;

import java.util.ArrayList;
import java.util.List;

import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

public class SMOValue {
    private Element mRoot = null;
	private XPath mXpath;
     
     
     public SMOValue(Element root){
    	 mRoot = root;
    	 mXpath = XPathFactory.newInstance().newXPath();
     }
     
     
     private NodeList findNode(String expression) { 
 		NodeList list=null;
 		try {
 			list = (NodeList) mXpath.evaluate(expression, mRoot,
 					XPathConstants.NODESET);
 		} catch (XPathExpressionException e) {
 			// TODO Auto-generated catch block
 			e.printStackTrace();
 		}
 		return list;
 	}
     
     public void setValue(String name, String value){
    	 setValue(name, new String[]{value});
     }
     
     public void setValue(String name, String[] value){
    	 NodeList nl = findNode(name);
    	 for(int i =0; i<nl.getLength(); i++){
    		 mRoot.removeChild(nl.item(i));
    	 }    	 
    	 
    	 for(String v:value){
	    	 Element e = mRoot.getOwnerDocument().createElement(name);
	    	 e.setTextContent(v);
	    	 mRoot.appendChild(e);
    	 }
     }
     
     public List<String> getValue(String name){
    	 ArrayList<String> result = new ArrayList<String>(); 
    	 NodeList nl = findNode(name);
    	 for(int i=0; i< nl.getLength(); i++){
    		 result.add(nl.item(i).getNodeName());
    	 }
    	 return result;
     }
     
     public String getValueAsString(String name){
    	 List<String> resultList = getValue(name);
    	 String result=null;
    	 if(resultList.size()>0){
    		 result = resultList.get(0);
    	 } 
    	 return result;
     }

     public SMOValue createChild(String childName){
    	 Element e = mRoot.getOwnerDocument().createElement(childName);
    	 mRoot.appendChild(e);
    	 return new SMOValue(e);
     }
     
     public List<SMOValue> getChild(String childName){
    	 NodeList nl = findNode(childName);
    	 ArrayList<SMOValue> result = new ArrayList<SMOValue>();
    	 for(int i=0; i< nl.getLength(); i++){
    		 result.add(new SMOValue((Element)nl.item(i)));
    	 }
    	 return result;
     }
     
     public void addChild(SMOValue value){
    	 Node dup = mRoot.getOwnerDocument().importNode(value.mRoot, true);
    	 mRoot.appendChild(dup);
     }
     
     public void removeChild(SMOValue value){
    	 mRoot.removeChild(value.mRoot);
     }
     
     public Element getElement(){
    	 return mRoot;
     }


	public String getName() {
		// TODO Auto-generated method stub
		return mRoot.getNodeName();
	}
     
}
