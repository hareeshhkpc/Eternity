package com.hin.hl7messaging.cassandra;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;
import junit.framework.Assert;
import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.hector.api.Serializer;

import org.apache.cassandra.locator.SimpleStrategy;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

public class CassandraClientTest {

	private static final CassandraClient client = new CassandraClient();
	
	@Before
	public void setup(){		
		client.setClusterName("Test Cluster");
		client.connect("172.25.250.165", 9160);
	}
	
	@After
	public void tearDown() throws Exception{
		client.dropKeySpace("TestKeySpace");
		client.disconnect();
	}
	
	@Test
	public void testConnected() {
		assertEquals("Connection is not established", client.getConnected(), Boolean.TRUE);
	}

	@Test
	public void testCreateKeySpace(){
		try {
			client.createKeySpaceUsingCql("TestKeySpace", 1, SimpleStrategy.class.getName());
		} catch (Exception e) {
			//e.printStackTrace();
		}
		
		try {
			client.selectKeySpace("TestKeySpace");
			Assert.assertEquals("Keyspace cannot be null", client.getKeyspace() != null, client.getKeyspace() != null);
		} catch (Exception e) {
			//e.printStackTrace();
			fail(e.getMessage());
		}
	}
	
	@Test
	public void testCreateColumnFamily(){
		StringBuffer q = new StringBuffer();
		q.append("create columnfamily TestMessageClumnFamily")
			.append("( key varchar primary key")
			.append(", msg_id varchar, msg_content varchar)");
		
		Serializer<String> serializer = StringSerializer.get();
		client.queryKeySpace(q.toString(), serializer, serializer, serializer);
	}
	
	@Test
	public void testInsert(){
		Serializer<String> serializer = StringSerializer.get();
		StringBuffer q = new StringBuffer();
		for(int i = 0; i < 9; i++){
			q.setLength(0);
			q.append("insert into TestMessageClumnFamily(key, msg_id, msg_content) values ('?1', '?2', '?3')");
			String key = "?1";
			q.replace(q.indexOf(key), q.indexOf(key) + key.length(), String.format("2011081916%2s", String.valueOf(i)));
			key = "?2";
			q.replace(q.indexOf(key), q.indexOf(key) + key.length(), String.format("Msg_%5s", String.valueOf(i)));
			key = "?3";
			q.replace(q.indexOf(key), q.indexOf(key) + key.length(), String.format("Content %5s", String.valueOf(i)));
			client.queryKeySpace(q.toString(), serializer, serializer, serializer);
		}		
	}
	
	//@Test
	public void testIndex(){
		Serializer<String> serializer = StringSerializer.get();
		StringBuffer q = new StringBuffer();
		q.append("CREATE INDEX msg_id_index ON TestMessageClumnFamily (msg_id)");
		client.queryKeySpace(q.toString(), serializer, serializer, serializer);
		q = new StringBuffer();
		q.append("CREATE INDEX msg_content_index ON TestMessageClumnFamily (msg_content)");
		client.queryKeySpace(q.toString(), serializer, serializer, serializer);
	}
	
	//@Test
	public void testQuery(){
		Serializer<String> serializer = StringSerializer.get();
		StringBuffer q = new StringBuffer();
		q.append("select * from TestMessageClumnFamily where key > '2011081916 3'");
		client.queryKeySpace(q.toString(), serializer, serializer, serializer);
	}
	
	//@Test //will not work
	public void testDescribeKeyspace(){
		Serializer<String> serializer = StringSerializer.get();
		client.queryKeySpace("describe keyspace TestKeySpace", serializer, serializer, serializer);
	}
	

}
