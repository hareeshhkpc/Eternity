package com.hin.hl7messaging.repository;

import java.io.File;

import javax.annotation.Resource;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import me.prettyprint.cassandra.service.CassandraHostConfigurator;
import me.prettyprint.hector.api.Cluster;
import me.prettyprint.hector.api.factory.HFactory;

import org.junit.Test;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;
import org.w3c.dom.Document;

@ContextConfiguration(locations = {
		"classpath:spring/applicationContext-core-test.xml", 
		"classpath:spring/mongodb-test.xml"})
public class MessageRepositoryStandardTest extends  AbstractJUnit4SpringContextTests {
	
	@Resource(name="messageRepositoryStandard")
	private MessageRepositoryStandard repositoryStandard ;
	
	// Creates a keyspace and column families
	@Test
	public void registerMessageTest() throws Exception {
		
		File file = new File("../message-repository/src/main/resources/MessageConfiguration.xml");
		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
		DocumentBuilder db = dbf.newDocumentBuilder();		
		Document doc = db.parse(file);			
		Cluster cluster = HFactory.getOrCreateCluster("MessageKS", new CassandraHostConfigurator("172.25.250.165:9160"));
		HFactory.createKeyspace("MessageKS", cluster);
		
		try {
			
			repositoryStandard.registerMessageTypes(doc);				
				
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
