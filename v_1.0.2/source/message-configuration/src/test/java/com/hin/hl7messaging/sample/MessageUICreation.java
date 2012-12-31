package com.hin.hl7messaging.sample;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;

import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

import org.junit.Test;

public class MessageUICreation {

	@Test
	public void testCreateMessageUI() {

		File messageTypeXML = new File("src/sample/ui/PRPA_IN000001.xml");
		File messageTypeXSL = new File("src/sample/ui/PRPA_IN000001.xsl");
		File messageTypeHTML = new File("src/sample/ui/PRPA_IN000001.html");
		ByteArrayOutputStream memoryOut = null;
		// File memoryOut = new
		// File("src/sample/PRPA_IN101001UV01_MessageForm.html");

		TransformerFactory tranObj = TransformerFactory.newInstance();
		Transformer tr = null;
		try {
			tr = tranObj.newTransformer(new StreamSource(messageTypeXSL));

			memoryOut = new ByteArrayOutputStream();
			StreamResult result = new StreamResult(memoryOut);
			StreamSource docSrc = new StreamSource(messageTypeXML);
			docSrc.setSystemId(messageTypeXML);
			tr.transform(docSrc, result);
			/*
			 * String ui=new String(memoryOut.toByteArray()); byte[] b=new
			 * byte[memoryOut] System.out.println(messageTypeHTML);
			 */
			FileOutputStream fileOutputStream = new FileOutputStream(
					messageTypeHTML);
			fileOutputStream.write(memoryOut.toByteArray());
			fileOutputStream.flush();
			fileOutputStream.close();

		} catch (Exception e) {
			System.out.println(e);
		}

	}

}
