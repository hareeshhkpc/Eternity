/**
 * 
 */
package com.hin.hl7messaging.config;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Properties;

import junit.framework.TestCase;

/**
 * @author salam.halley
 *
 */
public class HINConfigurationBeanTest extends TestCase {
	
	/* (non-Javadoc)
	 * @see junit.framework.TestCase#setUp()
	 */
	protected void setUp() throws Exception {
		super.setUp();
	}
	
	public void testCreateDBConfigurationProperties() throws IOException{
		Properties properties = new Properties();
		properties.setProperty("DB_HOST", "localhost");
		properties.setProperty("DB_PORT", "9160");
		properties.setProperty("DB_THRIFT_CONNECTION", "true");
		properties.setProperty("DB_CLUSTER_NAME", "HIN Cluster");
		properties.setProperty("DB_KEYSPACE_NAME", "MessageKS");
		
		PrintWriter pw = new PrintWriter(new File("src/main/resources/cassandra-connection.properties"));
		
		properties.store(pw, "Cassandra database connection details. To be understood by the CassandraClient class");
		
		pw.close();
	}
	
	public void testCreateConfigurationBean() throws IOException{
		
		HINConfigurationBean bean = new HINConfigurationBean();
		
		Properties properties = new Properties();
		bean.initializeConfigurationFromProperties(properties);
		
		bean.setConfigurationProperty(HINConfigurationProperty.MESSAGE_REPOSITORY_CONNECTION_PROPERTIES, "WEB-INF/hin-config/cassandra-connection.properties");
		
		/*bean.setConfigurationProperty(HINConfigurationProperty.SERVICE_LAYER_IMPLEMENTATION, "com.hin.hl7messaging.MessageService");
		bean.setConfigurationProperty(HINConfigurationProperty.REPOSITORY_INJECTION_METHOD, "setRepository");*/
		
		bean.setConfigurationProperty(HINConfigurationProperty.REPOSITORY_STANDARD_LAYER_IMPLEMENTATION, "com.hin.hl7messaging.repository.MessageRepositoryStandard");
		
		bean.setConfigurationProperty(HINConfigurationProperty.REPOSITORY_LAYER_IMPLEMENTATION, "com.hin.hl7messaging.repository.MessageRepository");
		bean.setConfigurationProperty(HINConfigurationProperty.CASSANDRA_CLIENT_INJECTION_METHOD, "setCassandraClient");
		
		bean.setConfigurationProperty(HINConfigurationProperty.CASSANDRA_CLIENT_IMPLEMENTATION, "com.hin.hl7messaging.cassandra.CassandraClient");
		bean.setConfigurationProperty(HINConfigurationProperty.CASSANDRA_CLIENT_INIT_METHOD, "connect");
		bean.setConfigurationProperty(HINConfigurationProperty.CASSANDRA_CLIENT_SELECT_KEYSPACE_METHOD, "selectKeySpace");
		bean.setConfigurationProperty(HINConfigurationProperty.ACCOUNT_ACTIVATION_URL, "http://localhost:8080/hin-web/Activation?orgUserProfileKey=");
		
		PrintWriter pw = new PrintWriter(new File("src/main/resources/HINConfig.json"));

		properties.store(pw, "HIN configuration propertes");
		
		pw.close();
	}

}
