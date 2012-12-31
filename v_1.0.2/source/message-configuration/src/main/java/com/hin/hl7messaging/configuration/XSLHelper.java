package com.hin.hl7messaging.configuration;

import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.dom.DOMSource;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.apache.log4j.Logger;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

/**
 * @author swetha.murthy
 * 
 */
public class XSLHelper {

	public ArrayList<String> visits = new ArrayList<String>();
	private Integer panelId = 1;
	private Logger logger = Logger.getLogger(XSLHelper.class.getName());

	public String getLastId() {
		return "panelId" + (panelId++);
	}

	public String toUpper(String str) {
		return str.toUpperCase();
	}

	/**
	 * used to maintain a list of visited nodes in the ArrayList "visits"
	 * 
	 * @param attrValue
	 *            : value of the attribute which is the name of the node
	 * @return value of the attribute
	 */
	public String keepVisited(String attrValue) {
		visits.add(attrValue);
		return attrValue;
	}

	/**
	 * used to check if the node is visited
	 * 
	 * @param attrVlaue
	 *            : value of the attribute which is the name of the node
	 * @returns true if the attribute value exists in the ArrayList "visits"
	 */
	public Boolean hasVisited(String attrVlaue) {
		return (visits.contains(attrVlaue));

	}

	/**
	 * used to assign dynamic values to the buttons
	 */
	public Object getOutComes(String outcomes, String spliter)
			throws ParserConfigurationException, XPathExpressionException {
		DOMSource ds = new DOMSource();

		DocumentBuilderFactory domFactory = DocumentBuilderFactory
				.newInstance();
		DocumentBuilder domBuilder = domFactory.newDocumentBuilder();

		Document newDoc = domBuilder.newDocument();
		Element rootElement = newDoc.createElement("outcomes");
		newDoc.appendChild(rootElement);

		Element element = null;
		for (String member : outcomes.split(spliter)) {
			element = newDoc.createElement("name");
			element.setTextContent(member);
			rootElement.appendChild(element);
		}

		ds.setNode(newDoc);

		XPathExpression xpe = XPathFactory.newInstance().newXPath()
				.compile("/");
		Object expRes = xpe.evaluate(newDoc, XPathConstants.NODESET);

		return expRes;
	}

	/**
	 * used to assign dynamic values to the combo box
	 */
	public Object getRecipients(HashMap<String, String> recipients)
			throws ParserConfigurationException, XPathExpressionException {

		DOMSource ds = new DOMSource();

		DocumentBuilderFactory domFactory = DocumentBuilderFactory
				.newInstance();
		DocumentBuilder domBuilder = domFactory.newDocumentBuilder();

		Document newDoc = domBuilder.newDocument();
		Element rootElement = newDoc.createElement("recipients");
		newDoc.appendChild(rootElement);

		Element element = null;

		for (String label : recipients.keySet()) {
			String value = recipients.get(label);
			Element recipient = newDoc.createElement("recipient");
			rootElement.appendChild(recipient);
			element = newDoc.createElement("label");
			element.setTextContent(label);
			recipient.appendChild(element);
			element = newDoc.createElement("value");
			element.setTextContent(value);
			recipient.appendChild(element);
		}

		ds.setNode(newDoc);

		XPathExpression xpe = XPathFactory.newInstance().newXPath()
				.compile("/");
		Object expRes = xpe.evaluate(newDoc, XPathConstants.NODESET);

		return expRes;
	}

	/*
	 * public static void main (String args[]){ XSLHelper obj= new XSLHelper();
	 * obj.hasVisited("","");
	 * 
	 * }
	 */
	/**
	 * used to convert timeStamp to Simple Date Format
	 * 
	 * @param timeStamp
	 *            : timeStamp value from the xml
	 * @return formated Date
	 */
	public String testRetrieveDate(String timeStamp) {
		Calendar c = Calendar.getInstance();
		if (timeStamp != null && timeStamp.length() > 0) {
			SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmss");
			SimpleDateFormat outFormat = new SimpleDateFormat(
					"dd/MM/yyyy HH:mm");
			Date creationDate = null;

			try {
				c.setTime(format.parse(timeStamp));
				creationDate = c.getTime();
				return outFormat.format(creationDate);
			} catch (ParseException e) {
				logger.error("Error in parsing:" + e.getMessage());
				format = new SimpleDateFormat("yyyyMMdd");
				outFormat = new SimpleDateFormat("dd/MM/yyyy");
				creationDate = null;

				try {
					c.setTime(format.parse(timeStamp));
					creationDate = c.getTime();
					return outFormat.format(creationDate);
				} catch (ParseException e1) {
					logger.error("Error in parsing:" + e.getMessage());
					System.out.println("XSLHeper Date Parse Error");
				}
			}
		}

		return "";
	}
}
