package com.hin.hl7messaging.sample;

import java.io.File;

import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

import org.junit.Test;

import com.hin.hl7messaging.configuration.generator.RecurseHelper;

public class EmptyMessageXMLGenerationTest {

	@Test
	public void test() {
		
		File xml = new File("src/main/resources/messageconfig/PRPA_IN000001.xml");		
		File out = new File("src/sample/PRPA_IN000001.xml");
		File xsl = new File("src/main/resources/transform/messagedef/empty-message-gen-v_101.xsl");
		
		TransformerFactory tranObj = TransformerFactory.newInstance();
		Transformer tr = null;
		try {
			tr = tranObj.newTransformer(new StreamSource(xsl));
			tr.setParameter("recurseHelper",  new RecurseHelper());
			//tr.setParameter("idAttributeName",  "_-i");
			
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
