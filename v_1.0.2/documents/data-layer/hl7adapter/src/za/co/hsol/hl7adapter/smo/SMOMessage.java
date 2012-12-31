package za.co.hsol.hl7adapter.smo;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Result;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import za.co.hsol.hl7adapter.helper.XmlHelper;
import za.co.hsol.hl7adapter.meta.ConfigClass;
import za.co.hsol.hl7adapter.meta.ConfigDocument;

public class SMOMessage {
	private ConfigDocument mConfigDocument;
	private Document mMessageDoc;
	private XPath mXpath;
	private DocumentBuilder mDocBuilder;

	public SMOMessage(ConfigDocument doc) {
		mConfigDocument = doc;
		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
		dbf.setNamespaceAware(true);
		try {
			mDocBuilder = dbf.newDocumentBuilder();
			clearMessage();
		} catch (ParserConfigurationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		mXpath = XPathFactory.newInstance().newXPath();
	}
	
	public void load(InputStream in) throws SAXException, IOException{
		mMessageDoc = mDocBuilder.parse(in);
	}

	public ConfigDocument getConfigDocument() {
		return mConfigDocument;
	}

	public void setConfigDocument(ConfigDocument configDocument) {
		mConfigDocument = configDocument;
	}

	public SMOObject createObject(String configClassName) {
		SMOObject result;
		ConfigClass cl = mConfigDocument.getChildClass(configClassName);
		if(cl!=null){
			Element elt = mMessageDoc.createElement(configClassName);
			mMessageDoc.appendChild(elt);
			result = new SMOObject(cl, elt);
		} else {
			result = null;
		}
		return result;
	}


	public List<SMOObject> findObject(String expression) { // limited to first child only - TODO: fix
		ArrayList<SMOObject> result = new ArrayList<SMOObject>();
		NodeList list;
		try {
			list = (NodeList) mXpath.evaluate(expression, mMessageDoc,
					XPathConstants.NODESET);
			for (int i = 0; i < list.getLength(); i++) {
				Element elt = (Element) list.item(i);
				ConfigClass configClass = mConfigDocument.getChildClass(elt
						.getTagName());
				result.add(new SMOObject(configClass, elt));
			}
		} catch (XPathExpressionException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return result;
	}

	public void clearMessage() {
		mMessageDoc = mDocBuilder.newDocument();
		
	}

	public boolean validateMessage() {
		boolean result=true;
		List<SMOObject> l = findObject("*");
		for(SMOObject obj : l){
			result &= obj.validate();
		}
		
		return result;
	}
	

	public Document getEmptyXMLDoc(){
		return mDocBuilder.newDocument();
	}

	public SMOObject rootObject() {
		return findObject("/*").get(0);
	}
	
	public String toString(){
		return XmlHelper.writeXmlToString(mMessageDoc);
	}

	public void toFile(String file){
		XmlHelper.writeXmlToFile(mMessageDoc, file);
	}
	

}
