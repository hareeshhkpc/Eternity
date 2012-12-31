/**
 * 
 */
package com.hin.hl7messaging.uitl.couch;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;

import org.ektorp.CouchDbConnector;
import org.ektorp.CouchDbInstance;
import org.ektorp.http.HttpClient;
import org.ektorp.http.HttpResponse;
import org.ektorp.http.StdHttpClient;
import org.ektorp.impl.StdCouchDbConnector;
import org.ektorp.impl.StdCouchDbInstance;
import org.junit.Test;

/**
 * @author Administrator
 * 
 */
public class TestCouchUpdate {

	@Test
	public void testCouchUpdate() throws Exception{
		CouchDBUpdater updater = new CouchDBUpdater();
		updater.connectToCouchDB("http://172.25.250.165:4895", "messagestore", true);
		
		/*File file = new File("src/test/resources/Log1253180902921.log");
		updater.updateCouch("logfile", file, null);*/
		
		File hinCommon = new File("D:\\icthealth_projects\\HIN-Eternity\\source\\hin-web\\src\\main\\webapp\\html");
		System.out.println(Arrays.toString(hinCommon.list()));
		
		ArrayList<String> fileList = updater.getFileList(hinCommon);
		//System.out.println(fileList);
		ArrayList<String> revs = updater.updateFileListToCouch(hinCommon, fileList);
		System.out.println(revs);
	}
	
	@Test
	public void testPost() throws MalformedURLException, FileNotFoundException {

		HttpClient httpClient = new StdHttpClient.Builder().url(
				"http://127.0.0.1:5984").build();

		File file = new File("src/test/resources/Log1253180902921.log");
		FileInputStream fileStream = new FileInputStream(file);
		/*HttpResponse res = httpClient
				.put("/messagestore/_design/hl7store/_update/postDoc/TMP_doc1?objecttype=meta&userid=common",
						fileStream, "application/json", file.length());*/
		
		HttpResponse res = httpClient
				.put("/messagestore1/_design/hl7store/_update/postDoc/TMP_doc1?objecttype=meta&userid=common",
						"{hi: 'hi'}");
		
		System.out.println(res.isSuccessful());
	}

	@Test
	public void testObjectUpdate() throws MalformedURLException {

		HttpClient httpClient = new StdHttpClient.Builder().url(
				"http://127.0.0.1:5984").build();

		CouchDbInstance dbInstance = new StdCouchDbInstance(httpClient);
		CouchDbConnector db = new StdCouchDbConnector("mydatabase", dbInstance);

		db.createDatabaseIfNotExists();

		
		 ConfigFile cf = new ConfigFile(); 
		 cf.setId("POCD9");
		
		cf.setModifiedDate(new Date());
		 
		 //cf.setRevision(revs.get(0).getRev());
		 cf.setContent("function POCD(){echo: function(){alert('Hello');}}");
		 
		 db.create(cf);
		 System.out.println("REV: " + cf.getRevision());

		 db.update(cf);
		 db.update(cf);
		 db.update(cf);
		 db.update(cf);
		 db.update(cf);
		 db.update(cf);
	}

}
