package za.co.hsol.hl7adapter.defs;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

import javax.xml.namespace.NamespaceContext;
import javax.xml.namespace.QName;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import za.co.hsol.hl7adapter.defs.helper.NamespaceContextMap;

public class XsdDocument {


	
	private String mConfigFileName;
	private Element mConfig;
	private XPath mXpath;
	private NamespaceContext context = new NamespaceContextMap("xs",
			"http://www.w3.org/2001/XMLSchema","mif", "urn:hl7-org:v3/mif");
	private MifDocument mMif;
	private String mDocName;
	private String mElementType;
	

	public String getConfigFileName() {
		return mConfigFileName;
	}

	public void setConfigFileName(String configFileName) {
		mConfigFileName = configFileName;
	}

	public XsdDocument(Element configElement) {
		mConfig = configElement;
		mXpath = XPathFactory.newInstance().newXPath();
		mXpath.setNamespaceContext(context);
	}

	private Element getDef(String xPathStr) {

		Element classnode = null;
		try {
			XPathExpression expr = mXpath.compile(xPathStr);
			NodeList classnodeList = (NodeList) expr.evaluate(
					mConfig.getOwnerDocument(), XPathConstants.NODESET);

			if (classnodeList.getLength() > 0)
				classnode = (Element) classnodeList.item(0);
		} catch (XPathExpressionException e) {
			e.printStackTrace();
		}

		return classnode;
	}

	public XsdElement getElement(String className) {
		String xPathStr = "//xs:complexType[@name='" + className + "']";
		Element x = getDef(xPathStr);
		return new XsdElement(this, x);
	}

	public XsdElement getAttributeGroupDef(String groupName) {
		String xPathStr = "//xs:attributeGroup[@name='" + groupName + "']";
		Element x = getDef(xPathStr);
		return new XsdElement(this, x);
	}

	public XsdElement getGroupDef(String groupName) {
		String xPathStr = "//xs:group[@name='" + groupName + "']";
		Element x = getDef(xPathStr);
		return new XsdElement(this, x);
	}

	public NodeList findNode(String expression, Node node) {
		return (NodeList) xpathNode(expression, node, XPathConstants.NODESET);
	}

	public Node findSingleNode(String expression, Node node) {
		return (Node) xpathNode(expression, node, XPathConstants.NODE);
	}

	private Object xpathNode(String expression, Node node, QName returnQname) {
		Object result = null;
		try {
			result = mXpath.evaluate(expression, node, returnQname);
		} catch (XPathExpressionException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return result;
	}

	public Element getSimpleFieldDef(Element classDef, String fieldName) {
		String expr = "xselement[@name='" + fieldName + "']";
		Element fieldnode = null;
		try {
			fieldnode = (Element) mXpath.evaluate(expr, classDef,
					XPathConstants.NODE);
		} catch (XPathExpressionException e) {
			e.printStackTrace();
		}
		if (fieldnode == null) {

			return null;
		}
		return fieldnode;
	}

	public static XsdDocument getDocumentForElementType(String elementType)   {
		String searchFile = XsdResolver.getXsdDocumentPath(elementType);
	

		FileInputStream in;
		XsdDocument result = null;
		try {
			in = new FileInputStream(new File(searchFile));
			result = loadConfigFile(in);
			result.mDocName = searchFile;
			result.mElementType = elementType;
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SAXException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return result;
	}

	public static XsdDocument loadConfigFile(InputStream in)
			throws SAXException, IOException {

		org.w3c.dom.Element elt = null;
		DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
		dbFactory.setNamespaceAware(true);
		DocumentBuilder db = null;
		try {
			db = dbFactory.newDocumentBuilder();
			Document doc = db.parse(in);
			elt = doc.getDocumentElement();

		} catch (ParserConfigurationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return new XsdDocument(elt);
	}

	public MifDocument getMifDocument() {
		if (mMif == null) {
			mMif = MifDocument.getDocument(XsdResolver.getMifDocumentPath(mElementType));
		}
		return mMif;
	}

	public NodeList findNode(String expression) {
		return findNode(expression, mConfig);
	}

}
