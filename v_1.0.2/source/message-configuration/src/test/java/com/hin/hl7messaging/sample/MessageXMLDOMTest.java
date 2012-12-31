package com.hin.hl7messaging.sample;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.UnsupportedEncodingException;

import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

import org.junit.Test;
import org.w3c.dom.Document;

import com.hin.hl7messaging.configuration.generator.RecurseHelper;
import com.hin.hl7messaging.utils.XMLHelper;
public class MessageXMLDOMTest {

	@Test
	public void testCreateMessageForm() throws UnsupportedEncodingException {
		
		String artifactID = "";

		artifactID = "PRPA_IN000001";
		
		/*artifactID = "PRPA_IN400000";*/
		artifactID = "PRPA_IN410001";
		//artifactID = "COCT_MT150000";

		
		//DataTypeHTMLGenerator.xsl
		
		File xslDataTypeJs = new File("src/sample/DataTypeJSGenerator.xsl");		
		File xslDataTypeHtml = new File("src/sample/DataTypeHTMLGenerator.xsl");
		
		File xml = new File("src/main/resources/messageconfig/" + artifactID + ".xml");				
		File messageJSout = new File("../hin-web/src/main/webapp/transformers/" + artifactID + ".js");

		File xslmessageJs = new File("src/sample/MessageFormJSGenerator.xsl");		
		File xslmessageHtml = new File("src/sample/MessageFormHTMLGenerator.xsl");
		/*File emptyStructureXsl = new File("src/main/resources/transform/messagedef/empty-message-gen-v_101.xsl");*/
		File emptyStructureXml = new File("src/sample/" + artifactID + ".xml");
		
		ByteArrayOutputStream memoryOut = null;
		//File memoryOut = new File("src/sample/PRPA_IN101001UV01_MessageForm.html");
		
		TransformerFactory tranObj = TransformerFactory.newInstance();
		Transformer tr = null;
		try {
			tr = tranObj.newTransformer(new StreamSource(xslDataTypeHtml));
			
			memoryOut = new ByteArrayOutputStream();
			StreamResult result = new StreamResult(memoryOut);
			StreamSource docSrc = new StreamSource(xml);
			docSrc.setSystemId(xml);
			tr.transform(docSrc, result);
			
			String dataTypeTemplateData = new String(memoryOut.toByteArray(), "UTF-8");
			dataTypeTemplateData = dataTypeTemplateData.replace("\n", "");
			dataTypeTemplateData = dataTypeTemplateData.replace("\r", "");
			dataTypeTemplateData = dataTypeTemplateData.replace("\"", "'");
			
			tr = tranObj.newTransformer(new StreamSource(xslDataTypeJs));
			tr.setParameter("dataTypeUI",  dataTypeTemplateData);
			tr.setParameter("rootElementName", artifactID);
			
			memoryOut = new ByteArrayOutputStream();
			result = new StreamResult(memoryOut);
			docSrc = new StreamSource(xml);
			docSrc.setSystemId(xml);
			tr.transform(docSrc, result);
			
			// Data type JS is generated
			String dataTypeJS = new String(memoryOut.toByteArray(), "UTF-8");
			
			////////////////////////////
			tr = tranObj.newTransformer(new StreamSource(xslmessageHtml));
			
			memoryOut = new ByteArrayOutputStream();
			result = new StreamResult(memoryOut);
			docSrc = new StreamSource(xml);
			docSrc.setSystemId(xml);
			tr.transform(docSrc, result);			
			
			String templateData = new String(memoryOut.toByteArray(), "UTF-8");
			templateData = templateData.replace("\n", "");
			templateData = templateData.replace("\r", "");
			templateData = templateData.replace("\"", "\\\"");
			
			Document document = XMLHelper.getXMLDocument(emptyStructureXml);
			String messageSkelton=XMLHelper.getXMLDocumentAsString(document);
			
			//tr = tranObj.newTransformer(new StreamSource(messageSkelton));
			
			/*memoryOut = new ByteArrayOutputStream();			
			result = new StreamResult(memoryOut);
			docSrc = new StreamSource(xml);
			docSrc.setSystemId(xml);
			tr.transform(docSrc, result);*/
			
			String emptyData = new String(messageSkelton.getBytes(), "UTF-8"); //new String(memoryOut.toByteArray(), "UTF-8");
			emptyData = emptyData.replace("\n", "");
			emptyData = emptyData.replace("\r", "");
			emptyData = emptyData.replace("\"", "'");
			
			tr = tranObj.newTransformer(new StreamSource(xslmessageJs));
			
			tr.setParameter("helper", new MessageJSHeper());
			tr.setParameter("messageFormUI",  templateData);
			tr.setParameter("dataTypeJS",  dataTypeJS);
			
			tr.setParameter("emptyMessageStructure",  emptyData);
			
			result = new StreamResult(messageJSout);
			docSrc = new StreamSource(xml);
			docSrc.setSystemId(xml);
			tr.transform(docSrc, result);
		} catch (TransformerConfigurationException e1) {
			e1.printStackTrace();
		} catch (TransformerException e) {
			e.printStackTrace();
		}	
		
		// compress
		try {
			File compressedOut = new File("../hin-web/src/main/webapp/transformers/" + artifactID + ".js");
			File jsInput = new File("src/sample/" + artifactID + "_MessageForm.js");
			//YUICompressor.main(new String[]{"--type", "js", "-o", compressedOut.getAbsolutePath(), jsInput.getAbsolutePath()});
			//System.out.println("Compressed");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	@Test
	public void testConfigToMessageFormJSGeneration() throws UnsupportedEncodingException {
		
		// Call data type JS generation first
		testConfigToDataTypeJSGeneration();
		
		File xml = new File("src/main/resources/messageconfig/PRPA_IN101001UV01.xml");				
		File out = new File("src/sample/PRPA_IN101001UV01_MessageForm.js");

		File xslJs = new File("src/sample/MessageFormJSGenerator.xsl");		
		File xslHtml = new File("src/sample/MessageFormHTMLGenerator.xsl");
		File emptyStructureXsl = new File("src/main/resources/transform/messagedef/empty-message-gen-v_101.xsl");
		
		ByteArrayOutputStream memoryOut = null;
		//File memoryOut = new File("src/sample/PRPA_IN101001UV01_MessageForm.html");
		
		TransformerFactory tranObj = TransformerFactory.newInstance();
		Transformer tr = null;
		try {
			tr = tranObj.newTransformer(new StreamSource(xslHtml));
			
			memoryOut = new ByteArrayOutputStream();
			StreamResult result = new StreamResult(memoryOut);
			StreamSource docSrc = new StreamSource(xml);
			docSrc.setSystemId(xml);
			tr.transform(docSrc, result);			
			
			String templateData = new String(memoryOut.toByteArray(), "UTF-8");
			templateData = templateData.replace("\n", "");
			templateData = templateData.replace("\r", "");
			templateData = templateData.replace("\"", "\\\"");
			
			tr = tranObj.newTransformer(new StreamSource(emptyStructureXsl));
			
			memoryOut = new ByteArrayOutputStream();			
			result = new StreamResult(memoryOut);
			docSrc = new StreamSource(xml);
			docSrc.setSystemId(xml);
			tr.transform(docSrc, result);
			
			String emptyData = new String(memoryOut.toByteArray(), "UTF-8");
			emptyData = emptyData.replace("\n", "");
			emptyData = emptyData.replace("\r", "");
			emptyData = emptyData.replace("\"", "'");
			
			tr = tranObj.newTransformer(new StreamSource(xslJs));
			
			tr.setParameter("helper", new MessageJSHeper());
			tr.setParameter("messageFormUI",  templateData);
			tr.setParameter("emptyMessageStructure",  emptyData);
			
			result = new StreamResult(out);
			docSrc = new StreamSource(xml);
			docSrc.setSystemId(xml);
			tr.transform(docSrc, result);
		} catch (TransformerConfigurationException e1) {
			e1.printStackTrace();
		} catch (TransformerException e) {
			e.printStackTrace();
		}	
	}
	
	@Test
	public void testConfigToDataTypeJSGeneration() throws UnsupportedEncodingException {
		
		File xml = new File("src/main/resources/messageconfig/PRPA_IN101001UV01.xml");				
		File out = new File("src/sample/PRPA_IN101001UV01_DataType.js");
		//DataTypeHTMLGenerator.xsl
		File xslJs = new File("src/sample/DataTypeJSGenerator.xsl");		
		File xslHtml = new File("src/sample/DataTypeHTMLGenerator.xsl");
		
		ByteArrayOutputStream memoryOut = new ByteArrayOutputStream();
		
		TransformerFactory tranObj = TransformerFactory.newInstance();
		Transformer tr = null;
		try {
			tr = tranObj.newTransformer(new StreamSource(xslHtml));
			
			StreamResult result = new StreamResult(memoryOut);
			StreamSource docSrc = new StreamSource(xml);
			docSrc.setSystemId(xml);
			tr.transform(docSrc, result);
			
			String templateData = new String(memoryOut.toByteArray(), "UTF-8");
			templateData = templateData.replace("\n", "");
			templateData = templateData.replace("\r", "");
			templateData = templateData.replace("\"", "'");
			
			tr = tranObj.newTransformer(new StreamSource(xslJs));
			tr.setParameter("dataTypeUI",  templateData);
			
			result = new StreamResult(out);
			docSrc = new StreamSource(xml);
			docSrc.setSystemId(xml);
			tr.transform(docSrc, result);
		} catch (TransformerConfigurationException e1) {
			e1.printStackTrace();
		} catch (TransformerException e) {
			e.printStackTrace();
		}	
	}
	
	@Test
	public void testConfigToDataTypeUIGeneration() {
		
		File xml = new File("src/main/resources/messageconfig/PRPA_IN101001UV01.xml");				
		File out = new File("src/sample/PRPA_IN101001UV01_DataType.html");		
		File xsl = new File("src/sample/DataTypeUIGenerator.xsl");		
		
		TransformerFactory tranObj = TransformerFactory.newInstance();
		Transformer tr = null;
		try {
			tr = tranObj.newTransformer(new StreamSource(xsl));
			tr.setParameter("recurseHelper",  new RecurseHelper());
			
			StreamResult result = new StreamResult(out);
			StreamSource docSrc = new StreamSource(xml);
			docSrc.setSystemId(xml);
			tr.transform(docSrc, result);
		} catch (TransformerConfigurationException e1) {
			e1.printStackTrace();
		} catch (TransformerException e) {
			e.printStackTrace();
		}		
	}
	
	@Test
	public void testHTMLViewXSLToHTMLDOM() {
		
		File xml = new File("src/main/resources/messageconfig/test/XML/PRPA_EX101001UV01_01.xml");				
		File out = new File("src/sample/PRPA_IN101001UV01_View.html");		
		File xsl = new File("src/sample/PRPA_IN101001UV01_View.xsl");		
		
		TransformerFactory tranObj = TransformerFactory.newInstance();
		Transformer tr = null;
		try {
			tr = tranObj.newTransformer(new StreamSource(xsl));
			tr.setParameter("recurseHelper",  new RecurseHelper());
			
			StreamResult result = new StreamResult(out);
			StreamSource docSrc = new StreamSource(xml);
			docSrc.setSystemId(xml);
			tr.transform(docSrc, result);
		} catch (TransformerConfigurationException e1) {
			e1.printStackTrace();
		} catch (TransformerException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}		
	}
	
	@Test
	public void testMessageDefToHTMLViewXSL() {
		
		File xml = new File("src/main/resources/messageconfig/PRPA_IN101001UV01.xml");		
		//File out = new File("../hin-web/src/main/webapp/main-screen/message-dom/PRPA_IN101001UV01.html");
		
		File out = new File("src/sample/PRPA_IN101001UV01_View.xsl");		
		File xsl = new File("src/sample/MessageDefToHTMLViewXSL.xsl");		
		
		TransformerFactory tranObj = TransformerFactory.newInstance();
		Transformer tr = null;
		try {
			tr = tranObj.newTransformer(new StreamSource(xsl));
			tr.setParameter("recurseHelper",  new RecurseHelper());
			
			StreamResult result = new StreamResult(out);
			StreamSource docSrc = new StreamSource(xml);
			docSrc.setSystemId(xml);
			tr.transform(docSrc, result);
		} catch (TransformerConfigurationException e1) {
			e1.printStackTrace();
		} catch (TransformerException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}		
	}
	
	@Test
	public void testMessageDefToHTMLForm() {
		
		File xml = new File("src/main/resources/messageconfig/POLB_IN224200.xml");		
		File out = new File("../hin-web/src/main/webapp/main-screen/transformers/POLB_IN224200.html");
		//File out = new File("src/sample/POLB_IN224200.html");
		
		File xsl = new File("src/sample/MessageView.xsl");
		
		File message = new File("src/sample/POLB_IN224200.xml");
		
		StringBuffer messageContent = new StringBuffer();
		try {
			BufferedReader br = new BufferedReader(new FileReader(message));
			String line = "";
			while((line = br.readLine()) != null){
				messageContent.append(line);
			}
			br.close();
		} catch (IOException e2) {
			System.out.println("Error reading message file: " + e2);
			return;
		}		
		
		TransformerFactory tranObj = TransformerFactory.newInstance();
		Transformer tr = null;
		try {
			tr = tranObj.newTransformer(new StreamSource(xsl));
			//tr.setParameter("helper",  new XSLHelper());
			//String messageData = messageContent.toString().replace('"', '\'');
			//tr.setParameter("messageData", messageData);
			
			StreamResult result = new StreamResult(out);
			StreamSource docSrc = new StreamSource(xml);
			docSrc.setSystemId(xml);
			tr.transform(docSrc, result);
		} catch (TransformerConfigurationException e1) {
			e1.printStackTrace();
		} catch (TransformerException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}		
	}
}
