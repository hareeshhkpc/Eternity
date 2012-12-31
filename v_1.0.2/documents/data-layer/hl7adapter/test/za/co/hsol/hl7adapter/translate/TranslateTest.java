package za.co.hsol.hl7adapter.translate;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

import javax.xml.parsers.ParserConfigurationException;

import org.junit.Test;
import org.w3c.dom.Document;
import org.xml.sax.SAXException;

import za.co.hsol.hl7adapter.defs.TranslateToHL7;
import za.co.hsol.hl7adapter.defs.XsdResolver;
import za.co.hsol.hl7adapter.helper.XmlHelper;
import za.co.hsol.hl7adapter.meta.ConfigDocument;
import za.co.hsol.hl7adapter.smo.SMOMessage;
import za.co.hsol.hl7adapter.smo.SMOObject;
import za.co.hsol.hl7adapter.smo.SMOObject.InvalidFieldNameException;
import za.co.hsol.hl7adapter.smo.SMOValue;

public class TranslateTest {

	@Test
	public void test() throws SAXException, IOException, InvalidFieldNameException, ParserConfigurationException {
		//XsdResolver.buildIndexes();
		
		TranslateToHL7 hl7 = new TranslateToHL7();
		FileInputStream in = new FileInputStream(new File("test/artifacts/schemas/PRPA_MT410001HT02/PRPA_MT410001HT02.xml"));
		ConfigDocument config = ConfigDocument.loadConfigFile(in);
		SMOMessage msg = config.createMessage();
		SMOObject obj = msg.createObject("PRPA_MT410001HT02");

		SMOValue id = obj.getNewValue("id");
		id.setValue("root", "1.2.3.4");
		id.setValue("extension", "1");
		
		SMOValue code = obj.getNewValue("code");
		code.setValue("code", "1554-5");
		code.setValue("codeSystemName", "LN");
		code.setValue("codeSystem", "2.16.840.1.113883.6.1");
		code.setValue("displayName", "GLUCOSE^POST 12H CFST:MCNC:PT:SER/PLAS:QN");
		code.setValue("originalText", "some original text");
		
		SMOValue statusCode = obj.getNewValue("statusCode");
		statusCode.setValue("code","complete");
		
		SMOObject subject = obj.createObject("subject");
		SMOObject patient = subject.createObject("patient");
		SMOValue patientid = patient.getNewValue("id");
		patientid.setValue("root", "5.6.7.8");
		patientid.setValue("extension", "1");
		
		SMOObject responsibleParty = obj.createObject("responsibleParty");
		SMOObject assignedEntityOrganization = responsibleParty.createObject("assignedEntityOrganization");
		SMOObject assignedOrganization = assignedEntityOrganization.createObject("assignedOrganization");
		SMOValue assignedOrganizationid = assignedOrganization.getNewValue("id");
		assignedOrganizationid.setValue("root", "1.2.3.4");
		assignedOrganizationid.setValue("extension", "1");	

		msg.toFile("/home/schalk/tmp/smo.xml");
		
		Document result = hl7.translate(msg);
		XmlHelper.writeXmlToFile(result, "/home/schalk/tmp/hl7.xml");
		
		//TranslateToHL7.testXmlFile("/home/schalk/workspacextend/HL7Adapter/test/artifacts/schemas/PRPA_MT410001HT02/example.xml", "test/artifacts/schemas/PRPA_MT410001HT02/simple_PRPA_MT410001HT02.xsd");
		XmlHelper.testXmlFile("/home/schalk/tmp/hl7.xml", "test/artifacts/schemas/PRPA_MT410001HT02/simple_PRPA_MT410001HT02.xsd");
	}
	
	@Test
	public void testJs() throws SAXException, IOException, ParserConfigurationException{
		TranslateToHL7 hl7 = new TranslateToHL7();
		FileInputStream in = new FileInputStream(new File("test/artifacts/schemas/PRPA_MT410001HT02/PRPA_MT410001HT02.xml"));
		ConfigDocument config = ConfigDocument.loadConfigFile(in);
		SMOMessage msg = config.createMessage();
		FileInputStream jsin = new FileInputStream(new File("/home/schalk/tmp/smojs.xml"));
		msg.load(jsin);
		Document result = hl7.translate(msg);
		XmlHelper.writeXmlToFile(result, "/home/schalk/tmp/hl7js.xml");
		XmlHelper.testXmlFile("/home/schalk/tmp/hl7js.xml", "test/artifacts/schemas/PRPA_MT410001HT02/simple_PRPA_MT410001HT02.xsd");
	}

}
