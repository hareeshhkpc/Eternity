package za.co.hsol.hl7adapter.meta;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import za.co.hsol.hl7adapter.smo.SMOMessage;

public class ConfigDocument {
	private String mConfigFileName;
	private Element mConfig;
	private XPath mXpath;

	public String getConfigFileName() {
		return mConfigFileName;
	}

	public void setConfigFileName(String configFileName) {
		mConfigFileName = configFileName;
	}

	public static ConfigDocument loadConfigFile(InputStream in)
			throws SAXException, IOException {

		org.w3c.dom.Element elt = null;
		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
		DocumentBuilder db = null;
		try {
			db = dbf.newDocumentBuilder();
			Document doc = db.parse(in);
			elt = doc.getDocumentElement();

		} catch (ParserConfigurationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return new ConfigDocument(elt);
	}

	public ConfigDocument(Element configElement) {
		mConfig = configElement;
		mXpath = XPathFactory.newInstance().newXPath();
	}

	public String getArtifactId() {
		Element metaInfo = null;
		try {
			metaInfo = (Element) mXpath.evaluate("MetaInfo", mConfig,
					XPathConstants.NODE);
		} catch (XPathExpressionException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		if (metaInfo == null)
			return null;
		else
			return metaInfo.getAttribute("artifactID");
	}

	public ConfigClass getChildClass(String className) {
		String[] cl = className.split("\\.");
		StringBuilder expression = new StringBuilder();
		for (int i = 0; i < cl.length; i++) {
			expression.append("Class[@tagName='" + cl[i] + "']");
			if (i != cl.length - 1)
				expression.append("/");
		}
		String expr = expression.toString();
		Element classnode = null;
		try {
			classnode = (Element) mXpath.evaluate(expr, mConfig,
					XPathConstants.NODE);
		} catch (XPathExpressionException e) {
			e.printStackTrace();
		}
		if (classnode == null)
			return null;
		return new ConfigClass(classnode);
	}

	
	private List<String> getNodeNames(String expression) {
		ArrayList<String> result = new ArrayList<String>();
		NodeList list;
		try {
			list = (NodeList) mXpath.evaluate(expression, mConfig,
					XPathConstants.NODESET);
			for (int i = 0; i < list.getLength(); i++)
				result.add(list.item(i).getNodeValue());
		} catch (XPathExpressionException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return result;

	}


	public List<String> getChildClassNames() {
		return getNodeNames("Class/@tagName");
	}



	public SMOMessage createMessage() {
		return new SMOMessage(this);
	}

	public void clearMessage(SMOMessage message) {
		message.clearMessage();
	}

	public boolean validateMessage(SMOMessage message) {
		return message.validateMessage();
	}

}
