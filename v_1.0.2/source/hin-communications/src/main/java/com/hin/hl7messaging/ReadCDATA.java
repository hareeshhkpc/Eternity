package com.hin.hl7messaging;
import java.io.*;

import org.apache.log4j.Logger;
import org.w3c.dom.*;
import javax.xml.parsers.*;

public class ReadCDATA {
	private static Logger logger = Logger.getLogger(ReadCDATA.class.getName());
  public static void main(String[] args) throws Exception {
   
    try {
    	 
    	File fXmlFile = new File("c:\\chart\\2011-10-30\\Shilpa-1-7-247.xml");
		DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
		Document doc = dBuilder.parse(fXmlFile);
		doc.getDocumentElement().normalize();
		
		//System.out.println("Root element :" + doc.getDocumentElement().getNodeName());
		NodeList nList = doc.getElementsByTagName("charting");
		//System.out.println("-----------------------"); 
		for (int temp = 0; temp < nList.getLength(); temp++) {
			
		   Node nNode = nList.item(temp);
		   if (nNode.getNodeType() == Node.ELEMENT_NODE) {
 
		      Element eElement = (Element) nNode;
 
		    //  System.out.println("First Name : " + getTagValue("sender", eElement));
		     // System.out.println(getTagValue("sender", eElement)+ " : " + getTagValue("message", eElement));
	          //    System.out.println("Nick Name : " + getTagValue("nickname", eElement));
		     // System.out.println("Salary : " + getTagValue("salary", eElement));
 
		   }
		}
	  } catch (Exception e) {
		e.printStackTrace();
		logger.error("An error occured while loading the file: "+e.getMessage());
	  }
  }
 
  private static String getTagValue(String sTag, Element eElement) {
	NodeList nlList = eElement.getElementsByTagName(sTag).item(0).getChildNodes();
 
        Node nValue = (Node) nlList.item(0);
 
	return nValue.getNodeValue();
  }
}
