/**
 * 
 */
package com.hin.hl7messaging.configuration;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.PrintWriter;

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
public class ConfigToHLMLGen {
	
	private static Logger logger = Logger.getLogger(ConfigToHLMLGen.class.getName());

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		/*File out = new File("E:\\HIN\\source\\message-configuration\\src\\out\\UI.js");
		File xsl = new File("E:\\HIN\\source\\message-configuration\\src\\main\\resources\\transform\\datatype\\v_105\\Root.xsl");
		File config = new File("E:\\HIN\\source\\message-configuration\\src\\out\\Conf.xml");*/
		File out = new File("E:\\HIN\\source\\message-configuration\\src\\test\\java\\com\\hin\\hl7messaging\\sample\\UI.js");
		File xsl = new File("E:\\HIN\\source\\message-configuration\\src\\main\\resources\\transform\\datatype\\v_107\\Root.xsl");
		/*File config = new File("E:\\HIN\\source\\message-configuration\\src\\main\\resources\\messageconfig\\POLB_IN224200.xml");*/
		File config = new File("E:\\HIN\\source\\message-configuration\\src\\out\\Conf.xml");
		
		
		TransformerFactory tFactory = TransformerFactory.newInstance();

		StreamSource source = new StreamSource(xsl);
		source.setSystemId(xsl);
		
		Transformer tr = null;
		try {
			tr = tFactory.newTransformer(source);	
			//tr.setParameter("xml", "<hello>World</hello>");
		} catch (TransformerConfigurationException e1) {
			logger.error("An error occured in transforming xsl: "+e1.getMessage());
		}
		try {
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			StreamResult result = new StreamResult(baos);
			StreamSource docSrc = new StreamSource(config);
			docSrc.setSystemId(config);
			String typeDelim = "!--##$--!";
			tr.setParameter("typeDelim", typeDelim);
			tr.transform(docSrc, result);
			
			String xml = new String(baos.toByteArray(), "UTF-8");			
			int i = xml.indexOf(typeDelim);			
			while(i < xml.length() && i > -1){
				int s = i;
				int e = xml.indexOf(typeDelim, s + typeDelim.length()) + typeDelim.length();
				String typeString = xml.substring(s, e);				
				String actualString = typeString.replace("\\\"", "\"");
				actualString = actualString.replace("\"", "\\\"");
				actualString = actualString.replace(typeDelim, "\"");
				actualString = actualString.replace('\r', ' ');
				actualString = actualString.replace('\n', ' ');
				actualString = actualString.replace('\t', ' ');
				//actualString = actualString.replace(" ", "");
				xml = xml.replace(typeString, actualString);
				i = xml.indexOf(typeDelim);
			}
			
			PrintWriter pw = new PrintWriter(out);
			pw.print(xml);
			pw.flush();
			pw.close();			
		} catch (Exception e) {
			logger.error("An error occured in trasformation: "+e.getMessage());
		} finally {
			
		}
	}
}
