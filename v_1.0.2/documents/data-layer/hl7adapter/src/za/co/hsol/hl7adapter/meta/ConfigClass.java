package za.co.hsol.hl7adapter.meta;

import java.util.ArrayList;
import java.util.List;

import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

public class ConfigClass {
	private Element mRootNode = null;
	private XPath mXpath;

	public ConfigField getField(String fieldname) {
		Element fieldnode = null;
		try {
			fieldnode = (Element) mXpath.evaluate("Field[@tagName='"
					+ fieldname + "']", mRootNode, XPathConstants.NODE);
		} catch (XPathExpressionException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		if (fieldnode == null)
			return null;
		else
			return new ConfigField(fieldnode);
	}

	public String getProperty(String propertyName) {

		return mRootNode.getAttribute(propertyName);
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
			classnode = (Element) mXpath.evaluate(expr, mRootNode,
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
			list = (NodeList) mXpath.evaluate(expression, mRootNode,
					XPathConstants.NODESET);
			for (int i = 0; i < list.getLength(); i++)
				result.add(list.item(i).getNodeValue());
		} catch (XPathExpressionException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return result;

	}

	public List<String> getFieldNames() {
		return getNodeNames("Field/@tagName");
	}

	public List<String> getChildClassNames() {
		return getNodeNames("Class/@tagName");
	}

	public List<String> getPropertyNames() {
		return getNodeNames("@*");
	}

	public ConfigClass(Element rootNode) {
		mRootNode = rootNode;
		mXpath = XPathFactory.newInstance().newXPath();
	}

	public String getConfigClassName() {
		return getProperty("tagName");
	}

	public String getDatatype() {
		return getProperty("type");
	}

}
