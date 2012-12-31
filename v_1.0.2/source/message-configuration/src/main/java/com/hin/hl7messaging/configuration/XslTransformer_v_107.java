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
public class XslTransformer_v_107 {
	private static Logger logger = Logger.getLogger(XslTransformer_v_107.class.getName());

	/**
	 * @param args
	 */  
	
	public static void main(String[] args) {		
		File xml = new File("E:/ict-projects/hin-eternity/source/hin-web/src/main/webapp/html/pages/test/xml/personRegLayoutConfig.xml");
		File xsl = new File("E:/ict-projects/hin-eternity/source/hin-web/src/main/webapp/html/pages/test/xsl/personRegLayoutView.xsl");
		File out = new File("E:/ict-projects/hin-eternity/source/hin-web/src/main/webapp/html/pages/test/html/personReg.html");
		out = new File("E:/apache-tomcat-7.0.22/webapps/hin-web/html/pages/patient/form.html");
		out = new File("E:/ict-projects/hin-eternity/source/hin-web/src/main/webapp/html/pages/patient/form.html");
		out = new File("E:/apache-tomcat-7.0.22/webapps/hin-web/html/pages/form/PRPA_IN203000HT04.html");
		out = new File("E:/ict-projects/hin-eternity/source/hin-web/src/main/webapp/html/pages/form/PRPA_IN203000HT04.html");
		//File out = new File("E:/ict-projects/hin-eternity/source/hin-web/src/main/webapp/mobile/viewedit/html/personRegView.html");
		//File out = new File("E:/ict-projects/hin-eternity/source/hin-web/src/main/webapp/html/pages/form/form.html");
		//File out = new File("E:/ict-projects/hin-eternity/source/hin-web/src/main/webapp/html/pages/patient/form.html");
		//File out = new File("E:/apache-tomcat-7.0.22/webapps/hin-web/html/pages/form/form.html");
		//File out = new File("E:/apache-tomcat-7.0.22/webapps/hin-web/html/pages/patient/form.html");
		
		



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
			System.out.println(out.getAbsolutePath());
		} catch (Exception e) {
			logger.error("Transformation error:"+e.getMessage());
		} finally {
			
		}
	}
}
