package za.co.hsol.hl7adapter.helper;

import java.io.File;
import java.io.IOException;

import javax.xml.XMLConstants;
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
import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.Schema;
import javax.xml.validation.SchemaFactory;
import javax.xml.validation.Validator;

import org.w3c.dom.Document;
import org.xml.sax.SAXException;

import za.co.hsol.hl7adapter.defs.XsdResolver;

public class XmlHelper {
	public static void writeXmlToFile(Document doc, String filename) {
		File file = new File(filename);
		Result result = new StreamResult(file);
		writeXmlToStream(doc, result);

	}

	public static String writeXmlToString(Document doc) {
		String result = "";
		Result streamResult = new StreamResult(result);
		writeXmlToStream(doc, streamResult);
		return result;
	}

	public static String writeXmlToStream(Document doc, Result streamResult) {
		String result = "";
		try {
			// Prepare the DOM document for writing
			Source source = new DOMSource(doc);

			// Write the DOM document to the file
			TransformerFactory tFactory = TransformerFactory.newInstance();
			Transformer xformer = tFactory.newTransformer();
			xformer.setOutputProperty(OutputKeys.INDENT, "yes");
			xformer.setOutputProperty(
					"{http://xml.apache.org/xslt}indent-amount", "2");
			xformer.transform(source, streamResult);
		} catch (TransformerConfigurationException e) {
		} catch (TransformerException e) {
		}
		return result;
	}
	
	
	public static void testXmlFile(String xmlDoc, String xsdDoc) throws SAXException, ParserConfigurationException, IOException{

		    DocumentBuilderFactory builderFactory = DocumentBuilderFactory.newInstance();
		    builderFactory.setNamespaceAware(true);

		    DocumentBuilder parser = builderFactory
		            .newDocumentBuilder();

		    // parse the XML into a document object
		    Document document = parser.parse(new File(xmlDoc));

		    SchemaFactory factory = SchemaFactory
		            .newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);

		    // associate the schema factory with the resource resolver, which is responsible for resolving the imported XSD's
		    factory.setResourceResolver(XsdResolver.getResourceResolver());

		    Source schemaFile = new StreamSource(new File(xsdDoc));
		    Schema schema = factory.newSchema(schemaFile);

		    Validator validator = schema.newValidator();
		    validator.validate(new DOMSource(document));
		
		
	}

}
