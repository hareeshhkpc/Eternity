package com.hin.hl7messaging;

import java.io.File;

import javax.annotation.Resource;

import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Field;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.store.FSDirectory;
import org.apache.lucene.util.Version;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;
import org.w3c.dom.Document;

import com.hin.hl7.messaging.api.IIdentityRepository;
import com.hin.hl7messaging.cassandra.CassandraClient;
import com.hin.hl7messaging.utils.XMLHelper;

@ContextConfiguration(locations = {
		"classpath:spring/applicationContext-core-test.xml", 
		"classpath:spring/mongodb-test.xml"})
public class StatisticsTest extends AbstractJUnit4SpringContextTests {
	
	@Resource(name = "identityMessageRepository")
	private IIdentityRepository repository;
	
	@Autowired
	private IndexService indexService;
	@Autowired
	StatisticsService statisticsService;
	
	String message;
	
	@Test
	public void testReadMessageFromXMl() throws Exception{
		File file = new File("..//hin-web//src//main//webapp//message-skeleton//TestMessage.xml");
		Document doc = XMLHelper.getXMLDocument(file);
		String document = XMLHelper.getXMLDocumentAsString(doc);
		indexService.createIndex(document);
		//repository.saveSubscriberProfile("p1", document);
		//indexService.updateIndex(document);
	}
	@Test
	public void testInsertMessageType() throws Exception{
		File file = new File("//172.25.250.165//LuceneDirectory//MessageType");
		StandardAnalyzer analyzer = new StandardAnalyzer(Version.LUCENE_35);
		IndexWriterConfig config = new IndexWriterConfig(Version.LUCENE_35,
				analyzer);
		IndexWriter w = new IndexWriter(FSDirectory.open(file), config);
		org.apache.lucene.document.Document luecneDocument = new org.apache.lucene.document.Document();
		luecneDocument.add(new Field("messagetype", "Organization Registration Message", Field.Store.YES,Field.Index.ANALYZED));
		luecneDocument.add(new Field("artifactid", "COCT_MT150000HT04", Field.Store.YES,Field.Index.ANALYZED));
		luecneDocument.add(new Field("indexfolder","COCT_MT150000HT04_Index", Field.Store.YES,Field.Index.ANALYZED));
		luecneDocument.add(new Field("alldoc", "all", Field.Store.YES,Field.Index.ANALYZED));
		w.addDocument(luecneDocument);
		w.optimize();
		w.close();
	}
	
	@Autowired
	private CassandraClient client = new CassandraClient();
	
	@Test
	public void testInsertStatisticsData() throws Exception{
		File file = new File("//172.25.250.165//LuceneDirectory//Statistics");
		StandardAnalyzer analyzer = new StandardAnalyzer(Version.LUCENE_35);
		IndexWriterConfig config = new IndexWriterConfig(Version.LUCENE_35,
				analyzer);
		IndexWriter w = new IndexWriter(FSDirectory.open(file), config);
		org.apache.lucene.document.Document luecneDocument = new org.apache.lucene.document.Document();
		
		
		luecneDocument.add(new Field("programme", "New patient over time", Field.Store.YES,Field.Index.NOT_ANALYZED));
		luecneDocument.add(new Field("messagetype", "POXX_MT111000HT02", Field.Store.YES,Field.Index.ANALYZED));
		luecneDocument.add(new Field("year", "2012", Field.Store.YES,Field.Index.ANALYZED));
		luecneDocument.add(new Field("month","02", Field.Store.YES,Field.Index.ANALYZED));
		luecneDocument.add(new Field("day", "25", Field.Store.YES,Field.Index.ANALYZED));
		luecneDocument.add(new Field("countyear", "4", Field.Store.YES,Field.Index.ANALYZED));
		luecneDocument.add(new Field("countmonth","4", Field.Store.YES,Field.Index.ANALYZED));
		luecneDocument.add(new Field("countday", "4", Field.Store.YES,Field.Index.ANALYZED));
		luecneDocument.add(new Field("alldoc", "all", Field.Store.YES,Field.Index.ANALYZED));
		
		
		w.addDocument(luecneDocument);
		w.optimize();
		w.close();
	}
	
	/*@Test
	public void testFetchStatisticsData() throws Exception{
		StatisticsVO statisticsVO = new StatisticsVO();
		try {
			statisticsVO = statisticsService.fetchStatisticsDataForMonth("Age Management Programme", "2012", "02");
		} catch (Exception e) {
			System.out.println("Exception:" + e.getMessage());
		}
		System.out.println(statisticsVO);
	}*/
	
	@Test
	public void testInsertStatisticsDataForMonth() throws Exception{
		File file = new File("..//hin-web//src//main//webapp//message-skeleton//TestMessage.xml");
		Document doc = XMLHelper.getXMLDocument(file);
		String document = XMLHelper.getXMLDocumentAsString(doc);
		statisticsService.insertIntoIndex(document, "PRPA_MT201000HT03", "Age Management", "Eternity");
	}
	
}
