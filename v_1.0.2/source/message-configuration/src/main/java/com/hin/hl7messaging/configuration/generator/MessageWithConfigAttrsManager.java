package com.hin.hl7messaging.configuration.generator;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Stack;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Result;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.xpath.XPathConstants;

import org.apache.log4j.Logger;
import org.w3c.dom.Document;
import org.w3c.dom.DocumentType;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

public class MessageWithConfigAttrsManager {
	private Document messageDoc, configDoc;
	private Map<String, Integer> visits = new HashMap<String, Integer>();
	private List<String> configAttrList = new ArrayList<String>();
	private String idAttributeName = "id";
	private Stack<String> treeStack = new Stack<String>();
	private Logger logger =  Logger.getLogger(MessageWithConfigAttrsManager.class.getName());
	
	public MessageWithConfigAttrsManager(){
	}
	
	public void setConfigAttrs(String... configtAttrs){
		for(String attr : configtAttrs)
			configAttrList.add(attr);
	}
	
	public String generateConfigAttrsForMessage(String messageContent, String configContent) throws ParserConfigurationException, SAXException, IOException {
		messageDoc = getDocumentFromContent(messageContent);
		configDoc = getDocumentFromContent(configContent);		
		
		String messageRootElementName = messageDoc.getDocumentElement().getNodeName();
		Element messageRootElement = messageDoc.getDocumentElement();
			
		String rootElementXPath = "config/root-elements/element[@name='" + messageRootElementName + "']";
		Element rootElement = (Element) XMLHelper.read(configDoc, rootElementXPath, XPathConstants.NODE);
		
		String rootElementType = rootElement.getAttribute("type");
		String rootElementName = rootElement.getAttribute("name");	
		//System.out.println("Configuration Root Type: " + rootElementType);
		
		treeStack.push(rootElement.getAttribute(idAttributeName));
		treeStack.push("1");
						
		if (rootElementName.equals(messageRootElementName)) {
			//System.out.println("Root Element Matched");
			setAttribute(rootElement, messageRootElement, "1");
			
			String rootXPath = "/".concat(rootElementName);
			
			visits.put(rootXPath, 1);
			
			traverseMessageDocument("/".concat(rootElementName), rootElementType, true);
			treeStack.pop();
			treeStack.pop();
			
			String result = convertDocToString(messageDoc);
			return result;
		}
		
		return null;	
	}
	
	private void traverseMessageDocument(String currentXPath, String typeName, boolean isRootType) {		
		Element root = (Element) XMLHelper.read(messageDoc, currentXPath, XPathConstants.NODE);
		
		String configXpath = "";
		if(isRootType){
			configXpath = "/config/anonymTypes/complex/type[@name='##']";
		}
		else {
			configXpath = "/config/message-element-type-definitions/message-element[@name='##']";
		}
		configXpath = configXpath.replace("##", typeName);		
		//System.out.println("Config XPath: " + configXpath);
		
		//System.out.println("Root: " + elementName + ", Child Size: " + getElementChildCount(root));
		NodeList elements = root.getChildNodes();	
		
		Map<String, Integer> similarMap = new HashMap<String, Integer>();
		
		for(int elementId = 0; elementId < elements.getLength(); elementId++){
			if(elements.item(elementId).getNodeType() == Node.ELEMENT_NODE){
				Element e = (Element) elements.item(elementId);	
				
				if(similarMap.containsKey(e.getNodeName())){
					Integer i = similarMap.get(e.getNodeName());
					similarMap.put(e.getNodeName(), ++i);
				} else {
					similarMap.put(e.getNodeName(), 1);
				}
				Integer xpathIndex = similarMap.get(e.getNodeName());
				
				String configElementXpath = configXpath.concat("//element[@name='".concat(e.getNodeName()).concat("']"));
				//System.out.println("ConfigElementXPath: " + configElementXpath);
				Element cE = (Element) XMLHelper.read(configDoc, configElementXpath, XPathConstants.NODE);
				//System.out.println("cE = " + cE);
				
				if(cE != null){
					//String newXPath = currentXPath.concat("/").concat(e.getNodeName()).concat("[" + xpathIndex + "]");
					String absoluteXpath = currentXPath.concat("/").concat(e.getNodeName()).concat("[" + xpathIndex + "]");
					//System.out.println(absoluteXpath);
					treeStack.push(cE.getAttribute(idAttributeName));
					
					/*Integer suffix = null;
					if(visits.containsKey(absoluteXpath)){
						suffix = visits.get(absoluteXpath);
					}
					else{
						suffix = 0;
					}
					
					visits.put(absoluteXpath, ++suffix);*/
					
					treeStack.push(xpathIndex + "");
					setAttribute(cE, e, xpathIndex + "");					
					
					treeStack.pop();
					treeStack.pop();
				}
			}
		}
		
		int elemCount = 0;
		
		similarMap = new HashMap<String, Integer>();
		
		for(int elementId = 0; elementId < elements.getLength(); elementId++){
			if(elements.item(elementId).getNodeType() == Node.ELEMENT_NODE){
				Element e = (Element) elements.item(elementId);	
				
				if(similarMap.containsKey(e.getNodeName())){
					Integer i = similarMap.get(e.getNodeName());
					similarMap.put(e.getNodeName(), ++i);
				} else {
					similarMap.put(e.getNodeName(), 1);
				}
				Integer xpathIndex = similarMap.get(e.getNodeName());				
							
				String newXPath = currentXPath.concat("/").concat(e.getNodeName()).concat("[" + xpathIndex + "]");
				//System.out.println(newXPath);
				
				String configElementXpath = configXpath.concat("//element[@name='").concat(e.getNodeName()).concat("']");
				//System.out.println("ConfigElementXPath: " + configElementXpath);
				Element cE = (Element) XMLHelper.read(configDoc, configElementXpath, XPathConstants.NODE);
				
				//Element cE = (Element) XMLHelper.read(configDoc, configElementXpath, XPathConstants.NODE);
				
				if(cE != null && cE.getAttribute("category").equals("rim")){		
					//System.out.println("Explore Type: " + cE.getAttribute("type"));
					treeStack.push(cE.getAttribute(idAttributeName));
					treeStack.push(xpathIndex + "");
					traverseMessageDocument(newXPath, cE.getAttribute("type"), false);
					treeStack.pop();
					treeStack.pop();
				}				
			}
		}		
	}
	
	private void setAttribute(Node node, Element element, String idSuffix){		
		//System.out.println("treeStack: " + treeStack);
		for(String attrName : configAttrList){
			if(node != null && node.getAttributes().getNamedItem(attrName) != null){
				if(idSuffix != null && attrName.equals(idAttributeName)){
					String id = "";
					for(String treeId : treeStack){
						if(id.length() < 1)
							id = id.concat(treeId);
						else
							id = id.concat("_").concat(treeId);
					}
					element.setAttribute(attrName, id);
				}
				else{
					element.setAttribute(attrName, node.getAttributes().getNamedItem(attrName).getNodeValue());
				}
			}
		}
	}
	
	@SuppressWarnings("unused")
	private int getElementChildCount(Element element){
		int count = 0;
		NodeList elements = element.getChildNodes();		
		for(int elementId = 0; elementId < elements.getLength(); elementId++){
			if(elements.item(elementId).getNodeType() == Node.ELEMENT_NODE){
				count++;
			}
		}
		return count;
	}
	
	private String convertDocToString(Document document){
		try {
			Transformer transformer = TransformerFactory.newInstance()
					.newTransformer();
			DocumentType documentType = document.getDoctype();

			if (documentType != null) {
				String pub = documentType.getPublicId();
				if (pub != null) {
					transformer.setOutputProperty(OutputKeys.DOCTYPE_PUBLIC,
							pub);
				}
				transformer.setOutputProperty(OutputKeys.DOCTYPE_SYSTEM,
						documentType.getSystemId());
			}

			transformer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");
			transformer.setOutputProperty(OutputKeys.INDENT, "yes");
			transformer.setOutputProperty(
					"{http://xml.apache.org/xslt}indent-amount", "4");

			Source source = new DOMSource(document);
			ByteArrayOutputStream out = new ByteArrayOutputStream();
			Result result = new StreamResult(out);
			transformer.transform(source, result);
			String resultStr = new String(out.toByteArray(), "UTF-8");
			return resultStr;
		} catch (Exception e) {
			logger.error("Transformation error:"+e.getMessage());
		} 
		return null;
	}
	
	public Document getDocumentFromContent(String content) throws ParserConfigurationException, SAXException, IOException{		
		DocumentBuilderFactory builderFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder builder = builderFactory.newDocumentBuilder();		
		ByteArrayInputStream input = new ByteArrayInputStream(content.getBytes());
		Document doc = builder.parse(input);
		return doc;	
	}

	public List<String> getConfigAttrList() {
		return configAttrList;
	}

	public void setConfigAttrList(List<String> configAttrList) {
		this.configAttrList = configAttrList;
	}

	public String getIdAttributeName() {
		return idAttributeName;
	}

	public void setIdAttributeName(String idAttributeName) {
		this.idAttributeName = idAttributeName;
	}
}
