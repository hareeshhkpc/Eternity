package com.hin.hl7messaging.web.messageconfig;

import java.io.File;

import junit.framework.TestCase;

import org.junit.Before;
import org.junit.Test;

import com.hin.hl7messaging.configuration.web.rest.SchemaArchiveManager;

public class MessageSchemaZipTest extends TestCase {

	private SchemaArchiveManager schemaArchiveManager = new SchemaArchiveManager();
	
	@Before
	public void initTest(){
		schemaArchiveManager = new SchemaArchiveManager();
	}
	
	@Test
	public void testUnzipSchemaZip() throws Exception {
		//File zipFile = new File("src/main/webapp/WEB-INF/imported_messages/zipped/PRPA_IN400001.zip");
		File zipFile = new File("src/main/webapp/WEB-INF/imported_messages/zipped/prpa_in410001.zip");
		//File targetFile = new File("src/main/webapp/WEB-INF/imported_messages/extracted/PRPA_IN400001");
		File targetFile = new File("src/main/webapp/WEB-INF/imported_messages/extracted/prpa_in000001");
		schemaArchiveManager.extractZipContents(zipFile, targetFile);
	}
	
	@Test
	public void testCreateSchemaZip() throws Exception{
		File messageSchema = new File("src/main/webapp/WEB-INF/hl7/schemas/POCD_MT000040UV.xsd");
		
		File coreSchema = new File("src/main/webapp/WEB-INF/htb/coreschemas");
		File zipFile = new File("src/main/webapp/WEB-INF/imported_messages/zipped/POCD_MT000040UV.zip");
		
		// create zip file
		//createZipFile(new File("src/main/webapp/WEB-INF/imported_messages/zipped/PRPA_IN400001.zip"), list, coreSchema);
		schemaArchiveManager.createZipFile(zipFile, messageSchema, coreSchema);
	}	
}
