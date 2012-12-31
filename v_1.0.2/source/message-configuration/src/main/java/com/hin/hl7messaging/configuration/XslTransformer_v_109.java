package com.hin.hl7messaging.configuration;




import java.io.File;

import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

import org.apache.log4j.Logger;

/*import org.junit.Test;*/

/**
 * @author admin
 * 
 */
public class XslTransformer_v_109 {
	
	private static Logger logger = Logger.getLogger(XslTransformer_v_109.class.getName());

/*	@Test
	public void testDataTypeView(){
		File xml = new File("src/main/resources/transform/datatype/v_109/demo.xml");
		File xsl = new File("src/main/resources/transform/datatype/v_109/AbsoluteDataTypeView.xsl");
		File out = new File("src/out/out_v_109/AbsoluteDataTypeView.txt");

		TransformerFactory tFactory = TransformerFactory.newInstance();

		StreamSource source = new StreamSource(xsl);
		source.setSystemId(xsl);
		
		Transformer tr = null;
		try {
			tr = tFactory.newTransformer(source);
		} catch (TransformerConfigurationException e1) {
			e1.printStackTrace();
		}
		try {
			StreamResult result = new StreamResult(out);
			StreamSource docSrc = new StreamSource(xml);
			docSrc.setSystemId(xml);
			tr.transform(docSrc, result);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			
		}
	}*/
	
	/**
	 * @param args
	 */  
	public static void main(String[] args) {
		
		File xml = new File("src/main/resources/messageconfig/POLB_IN224200.xml");
		File xsl = new File("src/main/resources/transform/datatype/v_110/BN.xsl");
		File out = new File("src/out/out_v_110/BN.html");
		
		



		TransformerFactory tFactory = TransformerFactory.newInstance();

		StreamSource source = new StreamSource(xsl);
		source.setSystemId(xsl);
		
		Transformer tr = null;
		try {
			tr = tFactory.newTransformer(source);

			/*	File list = new File(((String)tr.getParameter("baseDirFullPath")).concat(((String)tr.getParameter("baseDirFullPath"))));
			tr.setParameter("helper",  new XSLHelper());*/
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
