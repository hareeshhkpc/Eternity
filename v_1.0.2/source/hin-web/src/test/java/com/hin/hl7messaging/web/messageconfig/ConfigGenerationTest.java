/**
 * 
 */
package com.hin.hl7messaging.web.messageconfig;

import java.io.File;
import java.io.FileFilter;

import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

import org.apache.log4j.Logger;
import org.junit.Before;
import org.junit.Test;

import com.hin.domain.config.ConfigGeneratorParam;
import com.hin.domain.config.HL7MessageConfiguration;
import com.hin.hl7messaging.configuration.web.rest.ConfigSerializer;
import com.thoughtworks.xstream.XStream;

/**
 * @author Administrator
 *
 */
public class ConfigGenerationTest {

	private static Logger logger = Logger.getLogger(ConfigGenerationTest.class.getName());
	
	private ConfigSerializer serializer;
	private XStream streamSerializer;
	
	@Before
	public void init(){
		serializer = new ConfigSerializer();
	}
	
	@Test
	public void testCreateConfiguration() throws Exception{
		File confFile = new File("src/main/webapp/message-configuration-params/CDA-conf-Program.xml");	
		
		HL7MessageConfiguration configuration = serializer.createConfiguration(confFile);
		System.out.println(configuration);
	}
	
	@Test
	public void testCreateConfigurationFromFolder() throws Exception{
		File[] confFiles = new File("src/main/webapp/message-configuration-params").listFiles(new FileFilter() {
			
			@Override
			public boolean accept(File pathname) {
				return pathname.getName().endsWith(".xml");
			}
		});	
		
		int count = confFiles.length;
		int doneCount = count;
		System.out.println("Total Files: " + count);
		for(File confParamFile: confFiles){
			serializer = new ConfigSerializer();
			HL7MessageConfiguration configuration = serializer.createConfiguration(confParamFile);
			System.out.println(configuration);
			doneCount--;
		}
		System.out.println("Total Conf Generated: " + (count - doneCount));
	}
	
	@Test
	public void testEmptyMessageGenerate() throws Exception{

		File out = new File("src/main/webapp/message-skeleton/ROLE_PERMISSION.xml");
		File xsl = new File("../message-configuration/src/main/resources/generator/xsl/global-xmlGenrator-4api.xsl");
		File xml = new File("src/main/webapp/message-configuration/ROLE_PERMISSION.xml");

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
	
	@Test
	public void testCreateConfigParam() throws Exception{
		File confFile = new File("src/main/webapp/message-configuration/Observarion-conf.xml");
		streamSerializer = new XStream();
		streamSerializer.processAnnotations(ConfigGeneratorParam.class);
		ConfigGeneratorParam param = (ConfigGeneratorParam) streamSerializer.fromXML(confFile);
		param.initDefaults();
		System.out.println(param);
	}
}
