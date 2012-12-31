package com.hin.hl7messaging.cassandra;

import java.io.*;
import java.util.Scanner;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.namespace.QName;
import javax.xml.xpath.*;

import org.apache.log4j.Logger;
import org.w3c.dom.Node;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

public class XPATHReader {

	private String xmlFile;
	private Document xmlDocument;
	private XPath xPath;
	private static Logger logger = Logger.getLogger(XPATHReader.class.getName());
	
	public XPATHReader(String xmlFile) {
		this.xmlFile = xmlFile;
		initObjects();
	}

	public XPATHReader(Document doc) {
		this.xmlDocument = doc;
		xPath = XPathFactory.newInstance().newXPath();
	}

	public static void main(String...strings) throws Exception{

		File file = new File("E:\\Messaging\\New\\Resources\\Mesageconfig.xml");
		
		DocumentBuilderFactory f = DocumentBuilderFactory.newInstance();
		DocumentBuilder builder = f.newDocumentBuilder();
		Document document = builder.parse(file);
		//System.out.println(document);
		
		XPATHReader reader = new XPATHReader("E:\\Messaging\\New\\Resources\\Mesageconfig.xml");
		//System.out.println(reader.xmlDocument);
		String exp = (String) reader.read("/message-type/index-fields/field[1]/@name", XPathConstants.STRING);
		//System.out.println(exp);
	}
	
	public void initObjects() {
		FileInputStream stream = null;
		try {
			DocumentBuilder b = DocumentBuilderFactory.newInstance().newDocumentBuilder();
			File file = new File(xmlFile);
			stream = new FileInputStream(file);
			xmlDocument = b.parse(stream);
			xPath = XPathFactory.newInstance().newXPath();
		} catch (IOException ex) {
			logger.error("An error occured while loading the file: "+ex.getMessage());
		} catch (SAXException ex) {
			logger.error("Parser not found: "+ex.getMessage());
		} catch (ParserConfigurationException ex) {
			logger.error("An error occured while parsing the file: "+ex.getMessage());
		} finally {
			if (stream != null) {
				try {
					stream.close();
				} catch (IOException e) {
					System.out.println("Could not close stream");
				}
			}
		}
	}

	public Object read(String expression, QName returnType) {
		try {
			XPathExpression xPathExpression = xPath.compile(expression);
			return xPathExpression.evaluate(xmlDocument, returnType);
		} catch (XPathExpressionException ex) {
			logger.error("An error occured while compiling XPath Expression: "+ex.getMessage());
			return null;
		}
	}

	public String XMLmsg(String fileName) {
		try {
			DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
			InputStream in = new FileInputStream(new File(fileName));
			org.w3c.dom.Document doc = dbf.newDocumentBuilder().parse(in);
			StringWriter stw = new StringWriter();
			Transformer serializer = TransformerFactory.newInstance().newTransformer();
			serializer.transform(new DOMSource(doc), new StreamResult(stw));

			return stw.toString();
		} catch (Exception e) {
			logger.error("An error occured while transforming StringWriter to doc: "+e.getMessage());
			return null;
		}
	}

	public String modifyXML() throws Throwable {
		File file = new File("E:\\Cassandra\\HL7\\NE2006_examples\\XML\\POLB_EX224200_01_australia.xml");
		
		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
		dbf.setCoalescing(true);
		DocumentBuilder db = dbf.newDocumentBuilder();
		Document doc = db.parse(file);
		//System.out.println("old value:");
		Scanner sco = new Scanner(System.in);
		String oldValue = sco.next();
		System.out.println("\nnew value:");
		Scanner scn = new Scanner(System.in);
		String NewValue = scn.next();
		changeValue(doc, oldValue, NewValue);
		save(file, doc);
		return null;
	}

	public void changeValue(Document doc, String oldValue, String NewValue)
			throws Exception {
		//System.out.println("\nTag Name:");
		Scanner sc = new Scanner(System.in);
		String str = sc.next();
		Element root = doc.getDocumentElement();

		NodeList childNodes = root.getElementsByTagName(str);

		for (int i = 0; i < childNodes.getLength(); i++) {
			NodeList subChildNodes = childNodes.item(i).getChildNodes();
			for (int j = 0; j < subChildNodes.getLength(); j++) {
				try {
					if (subChildNodes.item(j).getTextContent().equals(oldValue)) {
						subChildNodes.item(j).setTextContent(NewValue);
					}
				} catch (Exception e) {
					logger.error("An error occured while replacing text of child node: "+e.getMessage());
				}
			}
		}
	}

	public void save(File file, Document doc) throws Exception {

		TransformerFactory factory1 = TransformerFactory.newInstance();
		Transformer transformer = factory1.newTransformer();
		transformer.setOutputProperty(OutputKeys.INDENT, "yes");
		StringWriter writer = new StringWriter();
		StreamResult result = new StreamResult(writer);
		DOMSource source = new DOMSource(doc);
		transformer.transform(source, result);
		String s = writer.toString();
		//System.out.println(s);

		FileWriter fileWriter = new FileWriter(file);
		BufferedWriter bufferedWriter = new BufferedWriter(fileWriter);

		bufferedWriter.write(s);

		bufferedWriter.flush();
		bufferedWriter.close();
	}

	public Document remove(String fileName) {
		try {

			DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
			InputStream in = new FileInputStream(new File(fileName));
			org.w3c.dom.Document doc = dbf.newDocumentBuilder().parse(in);

			TransformerFactory tFactory = TransformerFactory.newInstance();
			Transformer tFormer = tFactory.newTransformer();
			Scanner sr = new Scanner(System.in);
			//System.out.println("Enter the Element which you want to remove:");
			String Sr = sr.next();
			Element element = (Element) doc.getElementsByTagName(Sr).item(0);

			element.getParentNode().removeChild(element);
			doc.normalize();
			Source source = new DOMSource(doc);
			StreamResult dest = new StreamResult(System.out);
			tFormer.transform(source, dest);

			return doc;
		} catch (Exception e) {
			logger.error("An error occured while transforming from String to doc: "+e.getMessage());
			return null;
		}
	}

	public void traverseNodes(NodeList n) {
		for(int index = 0; index < ((NodeList) n).getLength(); index ++){
			Node aNode = ((NodeList) n).item(index);
		    if (aNode.getNodeType() == Node.ELEMENT_NODE){
		    	NodeList childNodes = aNode.getChildNodes();            
		        if (childNodes.getLength() > 0){
					//System.out.println("Node Name-->" + aNode.getNodeName() +" , Node Value-->" + aNode.getTextContent());
				}           
		    }
		}        
	}
}
