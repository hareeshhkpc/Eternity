/**
 * 
 */
package com.hin.hl7messaging.context;

import javax.servlet.ServletContext;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Component;

import com.hin.hl7messaging.config.HINConfigurationBean;
import com.hin.hl7messaging.config.HINConfigurationProperty;

/**
 * @author abdul.kahar
 *
 */
public class HINApplicationContext {

	private Logger logger = Logger.getLogger(HINApplicationContext.class.getName());
	
	private ServletContext servletContext;
	private Boolean hasInitialized = false;
	
	private static HINApplicationContext applicationContext;
	
	private HINApplicationContext(){}
	
	/**
	 * Gets an object form the ServletContext of HIN web application. This is the javax.servlet.ServletContext.getAttribute interface being exposed.
	 * @param attrKey Attribute Name as a key.
	 */
	public Object getContextAttribute(String attrKey){
		if(servletContext != null){
			Object attrValue = this.servletContext.getAttribute(attrKey);
			return attrValue;
		}
		return null;
	}
	
	/**
	 * Sets an object in the ServletContext of HIN web application. This is the javax.servlet.ServletContext.setAttribute interface being exposed.
	 * @param attrKey Attribute Name as a key.
	 * @param value Value for this Attribute, an Object.
	 */
	public void setContextAttribute(String attrKey, Object value){
		if(servletContext != null){
			this.servletContext.setAttribute(attrKey, value);
		}
	}
	
	/**
	 * Returns the HINConfig.json parameters values. Parameter name is an enum that is registered in HINConfigurationProperty
	 * @param configurationProperty The enum contsant defined in HINConfigurationProperty
	 */
	public String getConfigurationParameter(HINConfigurationProperty configurationProperty){
		if(servletContext != null){
			HINConfigurationBean bean = (HINConfigurationBean) this.servletContext.getAttribute(HINConfigurationBean.CONTEXT_PROPERTY);
			return bean.getConfigurationProperty(configurationProperty);
		}
		return null;
	}
	
	public void destroyApplicationContext(){
		this.servletContext = null;
	}
	
	public Object getCassandraClientBeanForStandard(){
		return getBeanInContext(HINConfigurationProperty.CASSANDRA_CLIENT_BEAN_FOR_STANDARD.toString() + "1");
	}
	
	public Object getCassandraClientBean(){
		return getBeanInContext(HINConfigurationProperty.CASSANDRA_CLIENT_BEAN.toString());
	}
	
	public Object getRepositoryStandardBean(){
		return getBeanInContext(HINConfigurationProperty.REPOSITORY_STANDARD_LAYER_BEAN.toString());
	}
	
	public Object getRepositoryBean(){
		return getBeanInContext(HINConfigurationProperty.REPOSITORY_LAYER_BEAN.toString());
	}
	
	private Object getBeanInContext(String beanName){
		return (this.servletContext != null) ? this.servletContext.getAttribute(beanName) : null;
	}
	
	public String getRealPath(String relativePath){
		if(this.servletContext != null){
			return this.servletContext.getRealPath(relativePath);
		}
		return null;
	}
	
	public void initializeApplicationContext(ServletContext context) throws Exception{
		
		if(hasInitialized){
			logger.warn("HIN Application context already  been initialized.");
			throw new Exception("Already initialized");
		}
		
		this.servletContext = context;
         
		 HINConfigurationBean bean = (HINConfigurationBean) this.servletContext.getAttribute(HINConfigurationBean.CONTEXT_PROPERTY);
		 String dbConfigPath = bean.getConfigurationProperty(HINConfigurationProperty.MESSAGE_REPOSITORY_CONNECTION_PROPERTIES);
		 
		/* Properties dbProps = new Properties();
		 dbProps.load(new FileInputStream(new File(context.getRealPath(dbConfigPath))));
		 
		 String host = dbProps.getProperty("DB_HOST");
		 Integer port = Integer.parseInt(dbProps.getProperty("DB_PORT"));
		 Boolean isThrift = Boolean.parseBoolean(dbProps.getProperty("DB_THRIFT_CONNECTION"));
		 String clusterName = dbProps.getProperty("DB_CLUSTER_NAME");
		 String keyspaceName = dbProps.getProperty("DB_KEYSPACE_NAME");
		 
		 // Create cassandra client
		 Object cassandraClient = bean.getConfigurationProperty(HINConfigurationProperty.CASSANDRA_CLIENT_IMPLEMENTATION);
		 Class<?> cassandraClientClass = Class.forName((String) cassandraClient);
		 Constructor<?> cassandraConstructor = cassandraClientClass.getConstructor(String.class);
		 cassandraClient = cassandraConstructor.newInstance(clusterName);
		 
		 // connect
		 String connectMethodName = (String) bean.getConfigurationProperty(HINConfigurationProperty.CASSANDRA_CLIENT_INIT_METHOD);
		 Method connectMethod = cassandraClient.getClass().getMethod(connectMethodName, String.class, Integer.class, Boolean.class);
		 connectMethod.invoke(cassandraClient, host, port, isThrift);
		 
		 // select keyspace
		 String selectKeyspaceMethodName = (String) bean.getConfigurationProperty(HINConfigurationProperty.CASSANDRA_CLIENT_SELECT_KEYSPACE_METHOD);
		 Method selectKeyspaceMethod = cassandraClient.getClass().getMethod("selectKeySpace", String.class, Boolean.class);
		 selectKeyspaceMethod.invoke(cassandraClient, keyspaceName, isThrift);
		 
		 logger.info("Cassandra client created: " + cassandraClient.toString());
		 
		 Object repoImpl = bean.getConfigurationProperty(HINConfigurationProperty.REPOSITORY_LAYER_IMPLEMENTATION);
		 repoImpl = Class.forName((String) repoImpl).newInstance();		 
		 logger.info("Repository layer initialized");
		 
		 // Inject cassandra client
		 String cassandraClientInjectMethodName = (String) bean.getConfigurationProperty(HINConfigurationProperty.CASSANDRA_CLIENT_INJECTION_METHOD);
		 Method cassandraClientInjectMethod = repoImpl.getClass().getMethod(cassandraClientInjectMethodName, cassandraClient.getClass());
		 cassandraClientInjectMethod.invoke(repoImpl, cassandraClient);
		 
		 
		 // one more instance of cassandra client for the MessageRepositoryStandard (has to be removed later)
		 Object cassandraClientForStandardRepo = bean.getConfigurationProperty(HINConfigurationProperty.CASSANDRA_CLIENT_IMPLEMENTATION);
		 Class<?> cassandraClientForStandardRepoClass = Class.forName((String) cassandraClientForStandardRepo);
		 cassandraConstructor = cassandraClientForStandardRepoClass.getConstructor(String.class);
		 cassandraClientForStandardRepo = cassandraConstructor.newInstance(clusterName);
		 
		 connectMethodName = (String) bean.getConfigurationProperty(HINConfigurationProperty.CASSANDRA_CLIENT_INIT_METHOD);
		 connectMethod = cassandraClientForStandardRepo.getClass().getMethod(connectMethodName, String.class, Integer.class, Boolean.class);
		 connectMethod.invoke(cassandraClientForStandardRepo, host, port, Boolean.FALSE);
		 
		 // select keyspace
		 selectKeyspaceMethodName = (String) bean.getConfigurationProperty(HINConfigurationProperty.CASSANDRA_CLIENT_SELECT_KEYSPACE_METHOD);
		 selectKeyspaceMethod = cassandraClientForStandardRepo.getClass().getMethod(selectKeyspaceMethodName, String.class, Boolean.class);
		 selectKeyspaceMethod.invoke(cassandraClientForStandardRepo, keyspaceName, Boolean.FALSE);
		 
		// Object repoSandardImpl = "com.hin.hl7messaging.repository.MessageRepositoryStandard"; //bean.getConfigurationProperty(HINConfigurationProperty.REPOSITORY_STANDARD_LAYER_IMPLEMENTATION);
		 
		 Object repoSandardImpl = "com.hin.hl7messaging.identity.repository.IdentityMessageRepository";
		 repoSandardImpl = Class.forName((String) repoSandardImpl).newInstance();		 
		 logger.info("Repository Standard layer initialized");
		 
		 // Inject cassandra client
		 cassandraClientInjectMethodName = (String) bean.getConfigurationProperty(HINConfigurationProperty.CASSANDRA_CLIENT_INJECTION_METHOD);
		 cassandraClientInjectMethod = repoSandardImpl.getClass().getMethod(cassandraClientInjectMethodName, cassandraClientForStandardRepo.getClass());
		 cassandraClientInjectMethod.invoke(repoSandardImpl, cassandraClientForStandardRepo);*/
		 
		 /*
		 Object serviceImpl = bean.getConfigurationProperty(HINConfigurationProperty.SERVICE_LAYER_IMPLEMENTATION);
		 repoImpl = Class.forName((String) serviceImpl).newInstance();		 
		 logger.info("Message service layer initialized");*/
		 
		 // Inject message repo
		 /*String serviceInjectMethodName = bean.getConfigurationProperty(HINConfigurationProperty.CASSANDRA_CLIENT_INJECTION_METHOD);
		 Method serviceInjectMethod = serviceImpl.getClass().getMethod(serviceInjectMethodName, repoImpl.getClass());
		 serviceInjectMethod.invoke(repoImpl);*/
		 
		 //context.setAttribute(HINConfigurationProperty.SERVICE_LAYER_BEAN.toString(), serviceImpl);
		 /*context.setAttribute(HINConfigurationProperty.REPOSITORY_LAYER_BEAN.toString(), repoImpl);
		 context.setAttribute(HINConfigurationProperty.REPOSITORY_STANDARD_LAYER_BEAN.toString(), repoSandardImpl);
		 context.setAttribute(HINConfigurationProperty.CASSANDRA_CLIENT_BEAN.toString(), cassandraClient);
		 context.setAttribute(HINConfigurationProperty.CASSANDRA_CLIENT_BEAN_FOR_STANDARD.toString(), cassandraClientForStandardRepo);*/
		 
	
		  
		 hasInitialized = true;
	}
	
	public static HINApplicationContext getHINApplicationContext(){
		if(applicationContext == null){
			applicationContext = new HINApplicationContext();
		}
		
		return applicationContext;
	}
}
