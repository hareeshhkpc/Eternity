package com.hin.service.integrationtest;

import java.io.File;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;
import org.w3c.dom.Document;

import com.hin.hl7messaging.IndexService;
import com.hin.hl7messaging.utils.XMLHelper;

/**
 * @author krishna.lr
 *
 */

@ContextConfiguration(locations = {
		"classpath:spring/applicationContext-core-test.xml", 
		"classpath:spring/mongodb-test.xml"})
public class IndexServiceTest extends AbstractJUnit4SpringContextTests {
	@Autowired
	private IndexService indexService;
	
	@Test
	public void testReadSampleXMl(){
		File file = new File("../hin-web/src/main/webapp/message-skeleton/samples/PRPA_MT201000HT03/Message_no_image.xml");
		Document doc = XMLHelper.getXMLDocument(file);
		String document = XMLHelper.getXMLDocumentAsString(doc);
		indexService.createIndex(document);
	}
	
}
