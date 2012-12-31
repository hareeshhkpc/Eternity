package com.hin.hl7messaging.web;

import java.io.File;

import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

import org.apache.log4j.Logger;
import org.junit.Test;

public class MessageConfigurationTransformTest {

	private static Logger logger = Logger.getLogger(MessageConfigurationTransformTest.class.getName());
	
	@Test
	public void testJSGenerate() throws Exception{

		File out = new File("src/sample/ui/JS_OrganizationRegistratonConfiguration.js");
		File xsl = new File("src/sample/ui/js-generator.xsl");
		File xml = new File("src/sample/ui/OrganizationRegistratonConfiguration.xml");

		TransformerFactory tFactory = TransformerFactory.newInstance();

		StreamSource source = new StreamSource(xsl);
		source.setSystemId(xsl);
		Transformer tr = null;
		try {
			tr = tFactory.newTransformer(source);			
			//tr.setParameter("helper", new XSLHelper());
			//tr.setParameter("idElementName", "e_id");
			//tr.setParameter("idValuePrefix", "id");
			//tr.setParameter("labelElementName", "label");
		} catch (TransformerConfigurationException e1) {
			logger.error("Transformation error:"+e1.getMessage());
		}
		try {
			StreamResult result = new StreamResult(out);
			StreamSource docSrc = new StreamSource(xml);
			docSrc.setSystemId(xml);
			tr.transform(docSrc, result);
		} catch (Exception e) {
			logger.error("Transformation error:"+e.getMessage());
		} finally {
			
		}
	}
	
	@Test
	public void testGuiGenerate() throws Exception{

		File out = new File("E:\\HIN\\source\\hin-web\\src\\main\\webapp\\main-screen\\profile\\html\\Gui_OrganisationRegistration.html");
		File xsl = new File("E:\\HIN\\source\\hin-web\\src\\main\\webapp\\main-screen\\profile\\xsl\\OrganisationRegistration.xsl");
		File xml = new File("E:\\HIN\\source\\hin-web\\src\\main\\webapp\\main-screen\\profile\\OrganizationRegistratonConfiguration.xml");

		TransformerFactory tFactory = TransformerFactory.newInstance();

		StreamSource source = new StreamSource(xsl);
		source.setSystemId(xsl);
		
		Transformer tr = null;
		try {
			tr = tFactory.newTransformer(source);			
			//tr.setParameter("helper", new XSLHelper());
			//tr.setParameter("idElementName", "e_id");
			//tr.setParameter("idValuePrefix", "id");
			//tr.setParameter("labelElementName", "label");
		} catch (TransformerConfigurationException e1) {
			logger.error("Transformation error:"+e1.getMessage());
		}
		try {
			StreamResult result = new StreamResult(out);
			StreamSource docSrc = new StreamSource(xml);
			docSrc.setSystemId(xml);
			tr.transform(docSrc, result);
		} catch (Exception e) {
			logger.error("Transformation error:"+e.getMessage());
		} finally {
			
		}
	}
	
	@Test
	public void testEmptyMessageGenerate() throws Exception{

		File out = new File("src/main/webapp/message-skeleton/samples/PRPA_MT410001HT02/App1.xml");
		File xsl = new File("../message-configuration/src/main/resources/generator/xsl/global-xmlGenrator-4api.xsl");
		File xml = new File("src/main/webapp/message-configuration/PRPA_MT410001HT02.xml");
		

		TransformerFactory tFactory = TransformerFactory.newInstance();

		StreamSource source = new StreamSource(xsl);
		source.setSystemId(xsl);
		
		Transformer tr = null;
		try {
			tr = tFactory.newTransformer(source);			
			//tr.setParameter("helper", new XSLHelper());
			//tr.setParameter("idElementName", "e_id");
			//tr.setParameter("idValuePrefix", "id");
			//tr.setParameter("labelElementName", "label");
		} catch (TransformerConfigurationException e1) {
			logger.error("Transformation error:"+e1.getMessage());
		}
		try {
			StreamResult result = new StreamResult(out);
			StreamSource docSrc = new StreamSource(xml);
			docSrc.setSystemId(xml);
			tr.transform(docSrc, result);
		} catch (Exception e) {
			logger.error("Transformation error:"+e.getMessage());
		} finally {
			
		}
	}

}
