package com.hin.hl7messaging.configuration;




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
		
		File xml = new File("E:\\HIN\\source\\message-configuration\\src\\out\\Conf.xml");
		/*File xml = new File("E:\\HIN\\source\\message-configuration\\src\\main\\resources\\messageconfig\\POLB_IN224200.xml");*/
		/*File xsl = new File("E:\\Workspace\\UITransform\\resource\\xsl\\v_102\\MCCI_MT000100UV01.Agent.xsl");
		File out = new File("E:\\Workspace\\UITransform\\resource\\out2\\MCCI_MT000100UV01.Agent.html");*/
		
		/*File xsl = new File("E:\\HIN\\source\\message-configuration\\src\\main\\resource\\transform\\datatype\\v_104\\AD.xsl");
		File out = new File("E:\\HIN\\source\\message-configuration\\src\\out\\out_v_104\\AD.html");*/
		

		File xsl = new File("E:\\HIN\\source\\message-configuration\\src\\main\\resources\\transform\\datatype\\v_106\\BL.xsl");
		File out = new File("E:\\HIN\\source\\message-configuration\\src\\out\\BL_v_106.html");
		
		/*File xml = new File("E:\\HIN\\source\\message-configuration\\src\\main\\resources\\messageconfig\\POLB_IN224200.xml");
		File xsl = new File("E:\\HIN\\source\\message-configuration\\src\\test\\java\\com\\hin\\hl7messaging\\sample\\MappingXmlWithXpath.xsl");
		File out = new File("E:\\HIN\\source\\message-configuration\\src\\test\\java\\com\\hin\\hl7messaging\\sample\\MappingXmlWithXpath.html");*/
		
		/*File xml = new File("E:\\HIN\\source\\message-configuration\\src\\test\\java\\com\\hin\\hl7messaging\\sample\\PRPA_EX001001.xml");*/
		/*File xml = new File("E:\\HIN\\source\\message-configuration\\src\\out\\Conf.xml");
		File xsl = new File("E:\\HIN\\source\\message-configuration\\src\\test\\java\\com\\hin\\hl7messaging\\sample\\MessageInboxView.xsl");
		File out = new File("E:\\HIN\\source\\message-configuration\\src\\test\\java\\com\\hin\\hl7messaging\\sample\\MessageInboxView.html");*/
		
	/*	File xml = new File("src\\main\\resources\\messageconfig\\POLB_IN224200.xml");
		File xsl = new File("src\\test\\java\\com\\hin\\hl7messaging\\sample\\GenEmptyConfig.xsl");
		File out = new File("src\\test\\java\\com\\hin\\hl7messaging\\sample\\GenEmptyConfig.xml");*/
		
		



		TransformerFactory tFactory = TransformerFactory.newInstance();

		StreamSource source = new StreamSource(xsl);
		source.setSystemId(xsl);
		
		Transformer tr = null;
		try {
			tr = tFactory.newTransformer(source);

			/*File list = new File(((String)tr.getParameter("baseDirFullPath")).concat(((String)tr.getParameter("baseDirFullPath"))))*/
			/*tr.setParameter("helper",  new XSLHelper());*/
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
