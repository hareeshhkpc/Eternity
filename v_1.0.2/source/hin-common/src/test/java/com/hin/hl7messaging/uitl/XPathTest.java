/**
 * 
 */
package com.hin.hl7messaging.uitl;

import java.io.File;

import javax.xml.xpath.XPathConstants;

import org.junit.Test;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.hin.hl7messaging.utils.XMLHelper;

/**
 * @author Administrator
 * 
 */
public class XPathTest {

	@Test
	public void testXmlNodeToString() {
		File docFile = new File(
				"../hin-web/src/main/webapp/message-configuration/POCD_MT000040UV_PhysicalExamination.xml");
		System.out.println(docFile.getAbsolutePath());
		
		Document doc = XMLHelper.getXMLDocument(docFile);

		Element workflowDef = (Element) XMLHelper.read(doc, "//WorkFlowDefinition[1]", XPathConstants.NODE);
		String str = XMLHelper.getXMLDocumentAsString(workflowDef);
		System.out.println("XML: " + str);
	}
	
	@Test
	public void testXpath() {
		File docFile = new File(
				"../hin-web/src/main/webapp/message-skeleton/samples/PRPA_MT201000HT03/Sample.xml");
		System.out.println(docFile.getAbsolutePath());
		;
		Document doc = XMLHelper.getXMLDocument(docFile);

		String data = (String) XMLHelper
				.read(doc, "/*/*/*/id[root='HIN_MSG_ID']/extension",
						XPathConstants.STRING);
		System.out.println("data: " + data);
	}

	@Test
	public void testXpathConceptSearch() {
		File docFile = new File(
				"D:\\icthealth_projects\\HIN-Eternity\\source\\hin-common\\src\\test\\resources\\concept.xml");
		System.out.println(docFile.getAbsolutePath());
		Document doc = XMLHelper.getXMLDocument(docFile);

		NodeList list = (NodeList) XMLHelper.read(doc,
				"//lookups/lookup[@class='gender']",
				XPathConstants.NODESET);
		for (int i = 0; i < list.getLength(); i++) {
			Element node = (Element)list.item(i);
			System.out.println("Name: " + node.getAttribute("name") + ", Desc: " + node.getAttribute("description"));
		}
	}

}
