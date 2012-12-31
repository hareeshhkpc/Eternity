/**
 * 
 */
package com.hin.hl7messaging.configuration.generator;

import java.io.File;

import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

import org.apache.log4j.Logger;

import com.hin.hl7messaging.configuration.XSLHelper;

/**
 * @author admin
 * 
 */
public class MessageDisplayGen {
	
	private static Logger logger = Logger.getLogger(MessageDisplayGen.class.getName());

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		
		File out = new File("src/out/out_v_105/POLB_IN224200.html");
		File xsl = new File("src/main/resources/transform/messagedef/MessageDisplay.xsl");
		File xml = new File("src/main/resources/messageconfig/POLB_IN224200.xml");

		TransformerFactory tFactory = TransformerFactory.newInstance();

		StreamSource source = new StreamSource(xsl);
		source.setSystemId(xsl);
		
		Transformer tr = null;
		try {
			tr = tFactory.newTransformer(source);			
			tr.setParameter("helper", new XSLHelper());
			tr.setParameter("idElementName", "e_id");
			tr.setParameter("idValuePrefix", "id");
			tr.setParameter("labelElementName", "label");
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