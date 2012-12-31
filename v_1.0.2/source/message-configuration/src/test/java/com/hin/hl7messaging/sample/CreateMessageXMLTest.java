package com.hin.hl7messaging.sample;

import static org.junit.Assert.*;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

import org.junit.Test;

import com.hin.hl7messaging.configuration.XSLHelper;

public class CreateMessageXMLTest {

	@Test
	public void test() {
		/* fail("Not yet implemented"); */
		File xml = new File(
				"src\\test\\java\\com\\hin\\hl7messaging\\sample\\PRPA_EX001001.xml");
		File xml1 = new File(
				"src\\test\\java\\com\\hin\\hl7messaging\\sample\\PRPA_EX2.xml");
		File xml2 = new File(
				"src\\test\\java\\com\\hin\\hl7messaging\\sample\\PRPA_EX3.xml");
		File xml3 = new File(
				"src\\test\\java\\com\\hin\\hl7messaging\\sample\\PRPA_EX4.xml");
		File xml4 = new File(
				"src\\test\\java\\com\\hin\\hl7messaging\\sample\\PRPA_IN101001UV01.xml");
		File xsl = new File(
				"src\\test\\java\\com\\hin\\hl7messaging\\sample\\MessageInboxView.xsl");
		/*
		 * File out = new
		 * File("src\\test\\java\\com\\hin\\hl7messaging\\sample\\Message1.xml"
		 * );
		 */

		List<File> inboxMessages=new ArrayList<File>() ;
		
		inboxMessages.add(xml4);
		/*inboxMessages[1] = xml1;
		inboxMessages[2] = xml2;
		inboxMessages[3] = xml3;
		inboxMessages[4] =xml ;*/

		TransformerFactory tranObj = TransformerFactory.newInstance();
		Transformer tr = null;
		try {
			tr = tranObj.newTransformer(new StreamSource(xsl));
			tr.setParameter("helper", new XSLHelper());
		} catch (TransformerConfigurationException e1) {
			e1.printStackTrace();
		}

		StringBuffer outputBuff = new StringBuffer();

		for (File file : inboxMessages) {
			System.out.println("my files are: " + file);
			String output = extractThumbnailView(file, tr);
			outputBuff.append(output);
			tr.reset();
			/* System.out.println(output); */
		}

		File inboxView = new File("src\\out\\InboxView.html");
		PrintWriter pw;
		try {
			pw = new PrintWriter(inboxView);

			pw.println(outputBuff.toString());
			pw.flush();
			pw.close();

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private String extractThumbnailView(File xml, Transformer tr) {
		try {
			/* System.out.println("myXml: "+xml); */
			ByteArrayOutputStream stream = new ByteArrayOutputStream();
			StreamResult result = new StreamResult(stream);
			/* System.out.println("result: "+result); */
			FileInputStream inputStream = new FileInputStream(xml);
			int c = -1;
			String str = new String();
			do {
				c = inputStream.read();
				str = str.concat(""+(char) c);
			} while (c != -1);

			StreamSource docSrc = new StreamSource(str);
			docSrc.setSystemId(xml);
			tr.transform(docSrc, result);
			System.out.println("stream returned : " + stream);
			return new String(stream.toByteArray());

		} catch (Exception e) {
			e.printStackTrace();
			return null;
		} /*
		 * finally {
		 * 
		 * }
		 */

	}

}
