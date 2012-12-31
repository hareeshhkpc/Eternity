package com.hin.hl7messaging.web;




import java.io.File;

import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

import org.apache.log4j.Logger;

/**
 * @author admin
 * 
 */
public class XslTransformer {
	private static Logger logger = Logger.getLogger(XslTransformer.class.getName());

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		
		File xml = new File("E:\\HIN\\source\\hin-web\\src\\main\\webapp\\data-layer\\Conf2.xml"); //input file:conf.xml
		File xsl = new File("E:\\HIN\\source\\hin-web\\src\\main\\webapp\\data-layer\\Rim_with_id.xsl");
		File out = new File("E:\\HIN\\source\\hin-web\\src\\main\\webapp\\data-layer\\TranFormed_with_id.xml");

		TransformerFactory tFactory = TransformerFactory.newInstance();

		StreamSource source = new StreamSource(xsl);
		source.setSystemId(xsl);
		
		Transformer tr = null;
		try {
			tr = tFactory.newTransformer(source);
			/*File list = new File(((String)tr.getParameter("baseDirFullPath")).concat(((String)tr.getParameter("baseDirFullPath"))))*/
			tr.setParameter("helper",  new XSLHelper());
		} catch (TransformerConfigurationException e1) {
			logger.error("TransformationConfiguration error: "+e1.getMessage());
		}
		try {
			StreamResult result = new StreamResult(out);
			StreamSource docSrc = new StreamSource(xml);
			docSrc.setSystemId(xml);
			tr.transform(docSrc, result);
		} catch (Exception e) {
			logger.error("Unable to transform: "+e.getMessage());
		} finally {
			
		}
	}
}
