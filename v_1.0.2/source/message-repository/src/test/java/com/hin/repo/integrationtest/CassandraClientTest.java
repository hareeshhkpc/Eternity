/**
 * 
 */
package com.hin.repo.integrationtest;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;

import com.hin.hl7messaging.cassandra.CassandraClient;

/**
 * @author Administrator
 *
 */
@ContextConfiguration(locations = {
		"classpath:spring/applicationContext-core-test.xml", 
		"classpath:spring/mongodb-test.xml"})
public class CassandraClientTest extends  AbstractJUnit4SpringContextTests{

	@Autowired
	private CassandraClient client;
	
	@Test
	public void testClient() throws Exception {
		assert(client.getConnected() == true);
		System.out.println("Connected: " + client.getConnected());
	}
	
}
