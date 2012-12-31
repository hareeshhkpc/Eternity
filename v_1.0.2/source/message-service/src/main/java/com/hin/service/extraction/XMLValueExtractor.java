/**
 * 
 */
package com.hin.service.extraction;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.xml.xpath.XPathConstants;

import org.apache.log4j.Logger;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;

import ca.uhn.hl7v2.model.Message;
import ca.uhn.hl7v2.model.v23.message.ACK;
import ca.uhn.hl7v2.parser.DefaultXMLParser;
import ca.uhn.hl7v2.parser.PipeParser;
import ca.uhn.hl7v2.parser.XMLParser;
import ca.uhn.hl7v2.validation.impl.ValidationContextFactory;

import com.hin.hl7messaging.api.IValueExtractor;
import com.hin.hl7messaging.utils.XMLHelper;

/**
 * @author salam.halley
 * 
 */
public class XMLValueExtractor implements IValueExtractor {

	private Logger logger = Logger.getLogger(IValueExtractor.class.getName());

	
	@Override
	public List<ExtractedValue> extractValues(String filePath) {
		// System.out.println("XML extractor");
		List<ExtractedValue> extractedValues = new ArrayList<ExtractedValue>();

		System.out.println("Extracting: " + filePath);
		
		String message = getXMLMessage(filePath);
		// System.out.println("xmlMessage:\n" + message);
		Document messageDocument = XMLHelper.getXMLDocument(message);

		String xpath = "ORU_R01/ORU_R01.RESPONSE/ORU_R01.ORDER_OBSERVATION/ORU_R01.OBSERVATION";
		NodeList fields = (NodeList) XMLHelper.read(messageDocument, xpath,
				XPathConstants.NODESET);
		int fieldsSize = fields.getLength();
		// System.out.println("size: "+fieldsSize);

		for (int i = 1; i <= fieldsSize; i++) {
			ExtractedValue exValue = new ExtractedValue();
			String xpathLabel = xpath + "[" + i + "]/OBX/OBX.3/CE.2";
			String xpathValue = xpath + "[" + i + "]/OBX/OBX.5";
			String labelName = (String) XMLHelper.read(messageDocument,
					xpathLabel, XPathConstants.STRING);
			String value = (String) XMLHelper.read(messageDocument, xpathValue,
					XPathConstants.STRING);

			exValue.setName(labelName);
			Class<? extends String> classType = value.getClass();
			String type = classType.toString();
			type = type.split("\\.")[2];
			exValue.setValue(value);
			if (type.equals("String")) {
				exValue.setDataType(DATA_TYPE.TEXT);
			} else if (type.equals("Integer") || type.equals("Double")
					|| type.equals("Float")) {
				exValue.setDataType(DATA_TYPE.NUMERIC);
			} else if (type.equals("Date")) {
				exValue.setDataType(DATA_TYPE.DATE);
			}
			extractedValues.add(exValue);

		}

		return extractedValues;

	}

	public String getXMLMessage(String filePath) {
		String messageFromFile = "";
		BufferedReader reader = null;

		try {
			reader = new BufferedReader(new FileReader(filePath));
		} catch (Exception e1) {
			logger.error("Error while reading file: ", e1);
		}

		try {

			String line = null;
			StringBuilder stringBuilder = new StringBuilder();
			String ls = "\r\n"; //System.getProperty("line.separator");

			try {
				while ((line = reader.readLine()) != null) {
					stringBuilder.append(line);
					stringBuilder.append(ls);
				}
			} catch (IOException error) {
				logger.error("Error while reading .txt file: ", error);
			}

			String ackMessageString = stringBuilder.toString();
			PipeParser pipeParser = new PipeParser();

			try {
				pipeParser.setValidationContext(ValidationContextFactory.noValidation());
				// parse the message string into a Message object
				Message message = pipeParser.parse(ackMessageString);
				

				if (message instanceof ACK) {
					ACK ack = (ACK) message;
					ack.getMSH().getProcessingID().getProcessingMode()
							.setValue("P");
				}

				// instantiate an XML parser
				XMLParser xmlParser = new DefaultXMLParser();
				
				// encode message in XML
				String ackMessageInXML = xmlParser.encode(message);
				// print XML-encoded message to standard out
				// System.out.println(ackMessageInXML);
				messageFromFile = ackMessageInXML;

			} catch (Exception error) {
				logger.error("Error while parsing the message string into a Message object: ", error);
			}

		} catch (Exception error) {
			logger.error("Error while creating the message: ", error);
		}

		return messageFromFile;

	}

}
