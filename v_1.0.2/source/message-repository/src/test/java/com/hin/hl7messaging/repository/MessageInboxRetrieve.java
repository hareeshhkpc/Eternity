package com.hin.hl7messaging.repository;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import me.prettyprint.cassandra.serializers.StringSerializer;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.hin.hl7messaging.cassandra.CassandraClient;
import com.hin.hl7messaging.cassandra.XPATHReader;

public class MessageInboxRetrieve {
	
	@Autowired
	private CassandraClient client = new CassandraClient();
	
	@Test
	public void insertSubscriber(){
		try {
			client.connect("172.25.250.165", 9160, true);
			client.selectKeySpace("HIN_ETERNITY");
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		XPATHReader reader = new XPATHReader("E:\\HIN\\source\\hin-web\\src\\main\\webapp\\mobile\\role\\xsl\\PersonInfo.xml");
		String message = reader.XMLmsg("E:\\HIN\\source\\hin-web\\src\\main\\webapp\\mobile\\role\\xsl\\PersonInfo.xml");
		
		HashMap<String, String> columnValueMap = new HashMap<String, String>();
		
		columnValueMap.put("ROWKEY", "1019");
		columnValueMap.put("MESSAGE", message);
		columnValueMap.put("USERNAME", "Rekha");
		columnValueMap.put("ROLE_NAME", "patient");
		columnValueMap.put("PASSWORD", "demo");
		columnValueMap.put("FULLNAME", "Rekha");
		columnValueMap.put("SUBSCRIBER_TYPE", "person");
		client.saveStandardColumnFamily(columnValueMap, "SUBSCRIBER_PROFILE");
		
		columnValueMap.clear();
		columnValueMap.put("ROWKEY", "1");
		columnValueMap.put("MESSAGE", message);
		columnValueMap.put("USERNAME", "Admin");
		columnValueMap.put("ROLE_NAME", "administrator");
		columnValueMap.put("FULLNAME", "HIN ETERNITY");
		columnValueMap.put("PASSWORD", "admin");
		columnValueMap.put("SUBSCRIBER_TYPE", "organization");
		client.saveStandardColumnFamily(columnValueMap, "SUBSCRIBER_PROFILE");
		
		columnValueMap.clear();
		columnValueMap.put("ROWKEY", "10");
		columnValueMap.put("MESSAGE", message);
		columnValueMap.put("USERNAME", "Anmisha");
		columnValueMap.put("ROLE_NAME", "physician");
		columnValueMap.put("FULLNAME", "HIN ETERNITY");
		columnValueMap.put("PASSWORD", "demo");
		columnValueMap.put("SUBSCRIBER_TYPE", "person");
		client.saveStandardColumnFamily(columnValueMap, "SUBSCRIBER_PROFILE");
		
		/*columnValueMap.put("ROWKEY", "1");
		columnValueMap.put("MESSAGE", message);
		columnValueMap.put("USERNAME", "ICTHealth");
		columnValueMap.put("PASSWORD", "demo");
		columnValueMap.put("SUBSCRIBER_TYPE", "organization");
		client.saveStandardColumnFamily(columnValueMap, "SUBSCRIBER_PROFILE");*/
		
		System.out.println("Inserted");
	}

	@Test
	public void insertSuperRole(){
		try {
			
			client.connect("172.25.250.165", 9160, true);
			client.selectKeySpace("HIN_ETERNITY");
			StringSerializer stringSerializer = StringSerializer.get();
			
			XPATHReader reader = new XPATHReader("E:\\HIN\\source\\hin-web\\src\\main\\webapp\\mobile\\role\\xsl\\Role_XML.xml");
			String message = reader.XMLmsg("E:\\HIN\\source\\hin-web\\src\\main\\webapp\\mobile\\role\\xsl\\Role_XML.xml");
			
			HashMap<String, String> columnValueMap = new HashMap<String, String>();
			String rowKey = "1", superColumn = "administrator";

			columnValueMap.put("MESSAGE", message);
			columnValueMap.put("ROLE_STATUS", "ACTIVE");
			columnValueMap.put("BLOCKED", "FALSE");
			columnValueMap.put("CONTACT", "1019");
			
			client.insertIntoSuperColumnFamily("ROLE", rowKey, superColumn, columnValueMap, stringSerializer, stringSerializer, stringSerializer);
			
			columnValueMap.clear();
			columnValueMap.put("MESSAGE", message);
			columnValueMap.put("ROLE_STATUS", "ACTIVE");
			columnValueMap.put("BLOCKED", "FALSE");
			columnValueMap.put("CONTACT", "1");
			
			client.insertIntoSuperColumnFamily("ROLE", "1019", "patient", columnValueMap, stringSerializer, stringSerializer, stringSerializer);
			
			columnValueMap.clear();
			columnValueMap.put("MESSAGE", message);
			columnValueMap.put("ROLE_STATUS", "ACTIVE");
			columnValueMap.put("BLOCKED", "FALSE");
			columnValueMap.put("CONTACT", "1");
			
			client.insertIntoSuperColumnFamily("ROLE", "10", "physician", columnValueMap, stringSerializer, stringSerializer, stringSerializer);
			
			System.out.println("Inserted");
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	@Test
	public void generateRandomNumber(){
		try {
			
			client.connect("172.25.250.165", 9160, true);
			client.selectKeySpace("HIN_ETERNITY");
			
			HashMap<String, String> columnValueMap = new HashMap<String, String>();
			String rowKey = "subscriberId";

			columnValueMap.put("ROWKEY", rowKey);
			columnValueMap.put("RANDOM_NUMBER", "1");
			client.saveStandardColumnFamily(columnValueMap, "GENERATE_SUBSCRIBERID");
			
			System.out.println("Inserted");
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	@Test
	public void insertSuperRoleDefinition(){
		try {
			
			client.connect("172.25.250.165", 9160, true);
			client.selectKeySpace("HIN_ETERNITY");
			StringSerializer stringSerializer = StringSerializer.get();
			
			XPATHReader reader = new XPATHReader("E:\\HIN\\source\\hin-web\\src\\main\\webapp\\mobile\\role\\xsl\\Role_XML.xml");
			String message = reader.XMLmsg("E:\\HIN\\source\\hin-web\\src\\main\\webapp\\mobile\\role\\xsl\\Role_XML.xml");
			HashMap<String, String> columnValueMap = new HashMap<String, String>();
			String rowKey = "1", superColumn = "administrator";
			columnValueMap.put("DEFINITION", message);
			client.insertIntoSuperColumnFamily("ROLE_DEFINITION", rowKey, superColumn, columnValueMap, stringSerializer, stringSerializer, stringSerializer);
			
			client.insertIntoSuperColumnFamily("ROLE_DEFINITION", "2", "patient", columnValueMap, stringSerializer, stringSerializer, stringSerializer);
			
			client.insertIntoSuperColumnFamily("ROLE_DEFINITION", "3", "physician", columnValueMap, stringSerializer, stringSerializer, stringSerializer);
			
			System.out.println("Inserted");
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	@Test
	public void insertStandardPermission(){
		try {
			
			client.connect("172.25.250.165", 9160, true);
			client.selectKeySpace("HIN_ETERNITY");
			
			HashMap<String, String> columnValueMap = new HashMap<String, String>();
			String rowKey = "1";
			columnValueMap.put("ROWKEY", rowKey);
			columnValueMap.put("CALENDAR","1");
			columnValueMap.put("PATIENT","1");
			columnValueMap.put("LIBRARY","1");
			columnValueMap.put("ARCHIVE","1");
			columnValueMap.put("STATISTICS","1");
			
			client.saveStandardColumnFamily(columnValueMap, "ROLE_PERMISSION");
			columnValueMap.clear();
			columnValueMap.put("ROWKEY", "2");
			columnValueMap.put("CALENDAR","1");
			
			client.saveStandardColumnFamily(columnValueMap, "ROLE_PERMISSION");
			columnValueMap.clear();
			columnValueMap.put("ROWKEY", "3");
			columnValueMap.put("CALENDAR","1");
			columnValueMap.put("PATIENT","1");
			
			client.saveStandardColumnFamily(columnValueMap, "ROLE_PERMISSION");
			System.out.println("Inserted");
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	@Test
	public void retrieveSuperRole(){
		try {
			HashMap<byte[], HashMap<byte[], Object>> resultMap = new HashMap<byte[], HashMap<byte[],Object>>();
			client.connect("172.25.250.165", 9160, true);
			client.selectKeySpace("HIN_ETERNITY");
			String rowKey = "100";
			resultMap = client.getData("HIN_ETERNITY", "ROLE", rowKey.getBytes());
			System.out.println(resultMap);
			
			Iterator iterator = resultMap.entrySet().iterator();
			while(iterator.hasNext()){
				Map.Entry subscriberIdEntry = (Map.Entry) iterator.next();
				byte[] inputBytes = (byte[]) subscriberIdEntry.getKey();
				System.out.println(new String(inputBytes));
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	@Test
	public void testcountdTest(){
		HashMap<String, HashMap<String, String>> columnValueMap = new HashMap<String, HashMap<String, String>>();
		HashMap<String, String> value = new HashMap<String, String>();
		value.put("1", "2");
		value.put("2", "3");
		columnValueMap.put("h1", value);
		int i = columnValueMap.size();
		String count = String.valueOf(i);
		System.out.println(count);
		String i3 = "010";
		char c = i3.charAt(2);
		if(c=='0')
			System.out.println("dfnlkn");
		System.out.println(Character.toString(i3.charAt(2)));
		
		
		String i2 ="1,2,3,";
		String[] results = i2.split( ",\\s*" ); 
	    for ( String roleId : results )
	    	System.out.println(roleId);
		
		String so = "1_version";
		int index1 = so.indexOf("version");
		if(index1 != -1){
			System.out.println(so);
		}
		else{
			System.out.println("hello");
		}
	}
	
	@Test
	public void insertStandardRoleDefinition(){
		try {
			client.connect("172.25.250.165", 9160, true);
			client.selectKeySpace("HIN_ETERNITY");
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		HashMap<String, String> columnValueMap = new HashMap<String, String>();
		
		XPATHReader reader = new XPATHReader("E:\\HIN\\source\\hin-web\\src\\main\\webapp\\mobile\\role\\xsl\\Role_XML.xml");
		String message = reader.XMLmsg("E:\\HIN\\source\\hin-web\\src\\main\\webapp\\mobile\\role\\xsl\\Role_XML.xml");
		
		columnValueMap.put("ROWKEY", "3_1");
		columnValueMap.put("DEFINITION", message);
		columnValueMap.put("PERMISSION", "111");
		columnValueMap.put("ROLE_NAME", "Employment");
		client.saveStandardColumnFamily(columnValueMap, "ROLE_DEFINITION");
		columnValueMap.put("ROWKEY", "1_1");
		columnValueMap.put("DEFINITION", message);
		columnValueMap.put("PERMISSION", "111");
		columnValueMap.put("ROLE_NAME", "Employment");
		client.saveStandardColumnFamily(columnValueMap, "ROLE_DEFINITION");
		columnValueMap.put("ROWKEY", "1_2");
		columnValueMap.put("DEFINITION", message);
		columnValueMap.put("PERMISSION", "111");
		columnValueMap.put("ROLE_NAME", "Member");
		client.saveStandardColumnFamily(columnValueMap, "ROLE_DEFINITION");
		columnValueMap.put("ROWKEY", "3_2");
		columnValueMap.put("DEFINITION", message);
		columnValueMap.put("PERMISSION", "111");
		columnValueMap.put("ROLE_NAME", "Member");
		client.saveStandardColumnFamily(columnValueMap, "ROLE_DEFINITION");
		columnValueMap.put("ROWKEY", "1019_1");
		columnValueMap.put("DEFINITION", message);
		columnValueMap.put("PERMISSION", "111");
		columnValueMap.put("ROLE_NAME", "Employment");
		client.saveStandardColumnFamily(columnValueMap, "ROLE_DEFINITION");
		columnValueMap.put("ROWKEY", "1019_2");
		columnValueMap.put("DEFINITION", message);
		columnValueMap.put("PERMISSION", "111");
		columnValueMap.put("ROLE_NAME", "Member");
		client.saveStandardColumnFamily(columnValueMap, "ROLE_DEFINITION");
		
		
		XPATHReader reader1 = new XPATHReader("E:\\HIN\\source\\hin-web\\src\\main\\webapp\\mobile\\role\\xsl\\Empty_XML.xml");
		String emptyMessage = reader1.XMLmsg("E:\\HIN\\source\\hin-web\\src\\main\\webapp\\mobile\\role\\xsl\\Empty_XML.xml");
		
		columnValueMap.put("ROWKEY", "EMPTY");
		columnValueMap.put("DEFINITION", emptyMessage);
		client.saveStandardColumnFamily(columnValueMap, "ROLE_DEFINITION");
		
		System.out.println("Inserted");
		
	}
	
	/*@Test
	public void insertStandardRole(){
		try {
			client.connect("172.25.250.165", 9160, true);
			client.selectKeySpace("HIN_ETERNITY");
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		XPATHReader reader = new XPATHReader("E:\\HIN\\source\\hin-web\\src\\main\\webapp\\mobile\\role\\xsl\\Role_XML.xml");
		String message = reader.XMLmsg("E:\\HIN\\source\\hin-web\\src\\main\\webapp\\mobile\\role\\xsl\\Role_XML.xml");
		
		HashMap<String, String> columnValueMap = new HashMap<String, String>();
		
		Long timestamp = System.currentTimeMillis();
		String creationTime = timestamp.toString();
		
		columnValueMap.put("ROWKEY", "1_1");
		columnValueMap.put("ROLE_STATUS", "ACTIVE");
		columnValueMap.put("CONTACT", "1019");
		columnValueMap.put("MESSAGE", message);
		columnValueMap.put("ROLE_NAME", "Employment");
		columnValueMap.put("ROLE_CREATION_TIME", creationTime);
		columnValueMap.put("BLOCKED", "FALSE");
		client.saveStandardColumnFamily(columnValueMap, "ROLE");
		columnValueMap.put("ROWKEY", "1_2");
		columnValueMap.put("ROLE_STATUS", "ACTIVE");
		columnValueMap.put("CONTACT", "3");
		columnValueMap.put("MESSAGE", message);
		columnValueMap.put("ROLE_NAME", "Member");
		columnValueMap.put("ROLE_CREATION_TIME", creationTime);
		columnValueMap.put("BLOCKED", "FALSE");
		client.saveStandardColumnFamily(columnValueMap, "ROLE");
		columnValueMap.put("ROWKEY", "3_1");
		columnValueMap.put("ROLE_STATUS", "ACTIVE");
		columnValueMap.put("CONTACT", "1");
		columnValueMap.put("MESSAGE", message);
		columnValueMap.put("ROLE_NAME", "Employment");
		columnValueMap.put("ROLE_CREATION_TIME", creationTime);
		columnValueMap.put("BLOCKED", "FALSE");
		client.saveStandardColumnFamily(columnValueMap, "ROLE");
		columnValueMap.put("ROWKEY", "3_2");
		columnValueMap.put("ROLE_STATUS", "ACTIVE");
		columnValueMap.put("CONTACT", "1");
		columnValueMap.put("MESSAGE", message);
		columnValueMap.put("ROLE_NAME", "Member");
		columnValueMap.put("ROLE_CREATION_TIME", creationTime);
		columnValueMap.put("BLOCKED", "FALSE");
		client.saveStandardColumnFamily(columnValueMap, "ROLE");		
		columnValueMap.put("ROWKEY", "1019_1");
		columnValueMap.put("ROLE_STATUS", "ACTIVE");
		columnValueMap.put("CONTACT", "1");
		columnValueMap.put("MESSAGE", message);
		columnValueMap.put("ROLE_NAME", "Employment");
		columnValueMap.put("ROLE_CREATION_TIME", creationTime);
		columnValueMap.put("BLOCKED", "FALSE");
		client.saveStandardColumnFamily(columnValueMap, "ROLE");
		columnValueMap.put("ROWKEY", "1019_2");
		columnValueMap.put("ROLE_STATUS", "ACTIVE");
		columnValueMap.put("CONTACT", "3");
		columnValueMap.put("MESSAGE", message);
		columnValueMap.put("ROLE_NAME", "Member");
		columnValueMap.put("ROLE_CREATION_TIME", creationTime);
		columnValueMap.put("BLOCKED", "FALSE");
		client.saveStandardColumnFamily(columnValueMap, "ROLE");

		System.out.println("Inserted");
	}*/
	
}
