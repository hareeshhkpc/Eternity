package com.hin.hl7messaging.editor;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;

import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

import org.apache.log4j.Logger;
import org.junit.Test;

public class EditorTransformTest {

	private static Logger logger = Logger.getLogger(EditorTransformTest.class.getName());
	
	@Test
	public void testEditorDOMCreate() throws IOException {
		File editorHTMLFile = new File("src/main/webapp/editor-definition/DATATYPE_EDITOR_FORM.html");
		StringBuffer dom = new StringBuffer();
		BufferedReader br = new BufferedReader(new FileReader(editorHTMLFile));
		String line = null;
		while((line = br.readLine()) != null){
			line = line.replace('\t', ' ');
			line = line.replace("\"", "\\\"");			
			dom.append(line);
		}
		
		System.out.println(dom);
	}
	
	@Test
	public void testEditorDOMGenerate() throws Exception{

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

}
