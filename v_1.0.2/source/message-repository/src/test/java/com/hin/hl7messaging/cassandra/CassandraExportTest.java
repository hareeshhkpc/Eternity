
package com.hin.hl7messaging.cassandra;

import java.io.File;
import java.io.IOException;

import javax.xml.parsers.ParserConfigurationException;

import org.apache.cassandra.thrift.Cassandra;
import org.apache.cassandra.thrift.Cassandra.Client;
import org.apache.cassandra.thrift.InvalidRequestException;
import org.apache.cassandra.thrift.NotFoundException;
import org.apache.cassandra.thrift.SchemaDisagreementException;
import org.apache.cassandra.thrift.TimedOutException;
import org.apache.cassandra.thrift.UnavailableException;
import org.apache.thrift.TException;
import org.apache.thrift.protocol.TBinaryProtocol;
import org.apache.thrift.protocol.TProtocol;
import org.apache.thrift.transport.TFramedTransport;
import org.apache.thrift.transport.TSocket;
import org.apache.thrift.transport.TTransportException;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.xml.sax.SAXException;

/**
 * @author Administrator
 *
 */

public class CassandraExportTest {

	private TProtocol protocolIn, protocolOut;
	
	@Before
	public void initTest() throws TTransportException{
		TFramedTransport transportIn = new TFramedTransport(new TSocket("172.25.250.85", 9160)); //172.25.250.165
		TFramedTransport transportOut = new TFramedTransport(new TSocket("172.25.250.85", 9160));
		protocolIn = new TBinaryProtocol(transportIn);
		transportIn.open();
		protocolOut = new TBinaryProtocol(transportOut);
		transportOut.open();
	}
	
	@After
	public void endTest(){
		protocolIn.getTransport().close();
		protocolOut.getTransport().close();
	}
	
	@Test
	public void testDataImport() throws InvalidRequestException, TException, UnavailableException, TimedOutException, SchemaDisagreementException, IOException, SAXException, NotFoundException, ParserConfigurationException{
		Client client = new Cassandra.Client(protocolIn);
		
		String keyspaceName = "HIN_ETERNITY";
		client.set_keyspace(keyspaceName);
		
		File file = new File("D:/icthealth_projects/data-backup/05_08_2012/cassandra/Data_Local.xml");
		
		CassandraExportImport.importKeyspaceData(client, keyspaceName, file);
	}
	
	@Test
	public void testDataExport() throws InvalidRequestException, TException, UnavailableException, TimedOutException, SchemaDisagreementException, IOException, SAXException, NotFoundException{
		Client client = new Cassandra.Client(protocolIn);
		
		String keyspaceName = "HIN_ETERNITY";
		client.set_keyspace(keyspaceName);
		
		File file = new File("D:/icthealth_projects/data-backup/08_08_2012/cassandra/Data_Local.xml");
		
		CassandraExportImport.exportKeyspaceData(client, keyspaceName, file);
	}	
	
	@Test
	public void testExportCassandraKeyspace() throws NotFoundException, InvalidRequestException, TException, IOException{
		Client client = new Cassandra.Client(protocolIn);
		String keyspaceName = "HIN_ETERNITY";
		File file = new File("D:/icthealth_projects/data-backup/08_08_2012/cassandra/Keyspace_Local.xml");		
		
		CassandraExportImport.exportKeyspaceDefinition(client, keyspaceName, file);
	}
	
	@Test
	public void testImportCassandraKeyspace() throws SchemaDisagreementException, InvalidRequestException, TException{
		Client client = new Cassandra.Client(protocolOut);
		//File file = new File("src/test/java/Keyspace_Local.xml");
		File file = new File("D:/icthealth_projects/data-backup/05_08_2012/cassandra/Keyspace_Local.xml");
		String keyspaceName = "HIN_ETERNITY";
		
		CassandraExportImport.importKeyspace(client, file, keyspaceName);
	}
	
}
