package com.hin.hl7messaging.repository;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.charset.Charset;
import java.util.HashMap;

import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.cassandra.service.CassandraHostConfigurator;
import me.prettyprint.hector.api.Cluster;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;

import org.junit.Test;

import com.hin.hl7messaging.cassandra.CassandraClient;
import com.hin.hl7messaging.cassandra.XPATHReader;

public class xyz {

	@Test
	public void test() {
		StringSerializer stringSerializer = StringSerializer.get();
		  String message;
		 
		  Cluster cluster = HFactory.getOrCreateCluster("Blog", new CassandraHostConfigurator("localhost:9160"));
		  Keyspace keyspaceOperator = HFactory.createKeyspace("Blog", cluster); 
		  Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, stringSerializer);
		  
		  XPATHReader reader = new XPATHReader("../hin-web/src/main/webapp/main-screen/profile/xml/OrganizationRegistraton.xml");
		  message = reader.XMLmsg("../hin-web/src/main/webapp/main-screen/profile/xml/OrganizationRegistraton.xml");
		 
		  try {		   
		    mutator.insert("1077", "SUBSCRIBER_PROFILE", HFactory.createStringColumn("MESSAGE", message));
  
		   System.out.println("Inserted");
		  } catch (Exception e) {
		   e.printStackTrace();
		  }

	}
	
	
	@Test
	 public void inserthtml(){
		String message;
	  CassandraClient client = new CassandraClient();
	  client.setClusterName("Blog");
	  try {
	   client.connect("localhost", 9160, true);
	   client.selectKeySpace("Blog");
	   
	  } catch (Exception e) {
	   e.printStackTrace();
	  }
	 /* XPATHReader reader = new XPATHReader("../hin-web/src/main/webapp/mobile/viewedit/xml/OrganizationRegistraton.xml");
	  String message = reader.XMLmsg("../hin-web/src/main/webapp/mobile/viewedit/xml/OrganizationRegistraton.xml");*/
	  
	  FileInputStream stream = null;
	try {
		stream = new FileInputStream("../hin-web/src/main/webapp/mobile/viewedit/html/Profile.html");
	} catch (FileNotFoundException e1) {
		// TODO Auto-generated catch block
		e1.printStackTrace();
	}
	  try {
		  FileChannel fc = stream.getChannel();  
		  MappedByteBuffer bb = null;
		try {
			bb = fc.map(FileChannel.MapMode.READ_ONLY, 0, fc.size());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
		  /* Instead of using default, pass in a decoder. */  
		  message = Charset.defaultCharset().decode(bb).toString(); 
		  }  
	  finally {  
		  try {
			stream.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
		  } 
	  
	  HashMap<String, String> columnValueMap = new HashMap<String, String>();
	  
	  columnValueMap.put("ROWKEY", "1077");
	  columnValueMap.put("HTMLDOM", message);
	  client.saveStandardColumnFamily(columnValueMap, "SUBSCRIBER_PROFILE");
	  
	  
	  System.out.println("Inserted");
	 }
	
	
	@Test
	 public void inserCassandra(){
	  CassandraClient client = new CassandraClient();
	  client.setClusterName("Blog");
	  try {
	   client.connect("localhost", 9160, true);
	   client.selectKeySpace("Blog");
	   
	  } catch (Exception e) {
	   e.printStackTrace();
	  }
	  XPATHReader reader = new XPATHReader("../hin-web/src/main/webapp/mobile/viewedit/xml/PersonRegistration.xml");
	  String message = reader.XMLmsg("../hin-web/src/main/webapp/mobile/viewedit/xml/PersonRegistration.xml");
	  
	  HashMap<String, String> columnValueMap = new HashMap<String, String>();
	  
	  columnValueMap.put("ROWKEY", "1077");
	  columnValueMap.put("MESSAGE", message);
	  client.saveStandardColumnFamily(columnValueMap, "SUBSCRIBER_PROFILE");
	  
	  
	  System.out.println("Inserted");
	 }


}
