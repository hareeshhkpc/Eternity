package com.hin.hl7messaging.listener;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Properties;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.google.gson.Gson;
import com.hin.hl7messaging.config.HINConfigurationBean;
import com.hin.hl7messaging.context.HINApplicationContext;
import com.hin.messaging.IWorkFlowProvider;

@Component(value="hINContextListener")
public class HINContextListener implements ServletContextListener {
	
	private Logger logger = Logger.getLogger(HINContextListener.class.getName());
	
	@Autowired
	private IWorkFlowProvider workFlowProvider;
	
	public HINContextListener() {
    }
	
	@Override
	public void contextInitialized(ServletContextEvent servletContextEvent) {	
		
		ServletContext servletContext = servletContextEvent.getServletContext();
		WebApplicationContext webApplicationContext = WebApplicationContextUtils.getWebApplicationContext(servletContext);
		
		AutowireCapableBeanFactory autowireCapableBeanFactory = webApplicationContext.getAutowireCapableBeanFactory();
		
		autowireCapableBeanFactory.configureBean(this, "hINContextListener");
		
		// load the HIN configuration bean
		readHINConfigurationFromProperties(servletContextEvent);
		
		HINConfigurationBean bean = (HINConfigurationBean) servletContextEvent.getServletContext().getAttribute(HINConfigurationBean.CONTEXT_PROPERTY);
		HINApplicationContext context = HINApplicationContext.getHINApplicationContext();
		try {
			context.initializeApplicationContext(servletContextEvent.getServletContext());
			workFlowProvider.deployWorkFlowDefinition();
					
		} catch (Exception e) {
			logger.error("Context initialization failed", e);
			throw new RuntimeException("Error in initializing application", e);
		}

		
		//String worflowConfigPath = bean.getConfigurationProperty(HINConfigurationProperty.WORKFLOW_CONFIG_PATH);
		//String workflowDeploymentPath = servletContextEvent.getServletContext().getRealPath(worflowConfigPath);
		//WorkFlowManager workFlowManager = new WorkFlowManager(workflowDeploymentPath);
		//context.setContextAttribute(HINConfigurationProperty.WORKFLOW_MANAGER_BEAN.toString(), workFlowManager);*/

	}

	private void readHINConfigurationFromProperties(ServletContextEvent servletContextEvent) {
		String hinConfigFilePath = servletContextEvent.getServletContext().getInitParameter("HIN_CONFIGURATION_FILE_PATH");

		Properties properties = new Properties();
		
		try {
			properties.load(new FileInputStream(new File(servletContextEvent.getServletContext().getRealPath(hinConfigFilePath))));
			
			HINConfigurationBean configurationBean = new HINConfigurationBean();
			configurationBean.initializeConfigurationFromProperties(properties);
			
			servletContextEvent.getServletContext().setAttribute(HINConfigurationBean.CONTEXT_PROPERTY, configurationBean);
			
		} catch (FileNotFoundException e) {
			logger.error("HIN configuration file is missi ng at 'HIN_CONFIGURATION_FILE_PATH'", e);
		} catch (IOException e) {
			logger.error("Error while reading HIN configuration file at 'HIN_CONFIGURATION_FILE_PATH'", e);
		}
	}
	
	private void readHINConfiguration(ServletContextEvent servletContextEvent) {
		String hinConfigFilePath = servletContextEvent.getServletContext().getInitParameter("HIN_CONFIGURATION_FILE_PATH");
		StringBuffer jsonBeanBuffer = new StringBuffer();
		try {
			FileInputStream reader = new FileInputStream(new File(servletContextEvent.getServletContext().getRealPath(hinConfigFilePath)));
			
			byte[] readBuffer = new byte[2048];
			
			int readLength = -1;
			
			while((readLength = reader.read(readBuffer)) != -1){
				jsonBeanBuffer.append(new String(readBuffer, 0, readLength, "UTF-8"));
			}
			
			reader.close();
			
			Gson gson = new Gson();
			HINConfigurationBean configurationBean = gson.fromJson(jsonBeanBuffer.toString(), HINConfigurationBean.class);
			
			servletContextEvent.getServletContext().setAttribute(HINConfigurationBean.CONTEXT_PROPERTY, configurationBean);
			
		} catch (FileNotFoundException e) {
			logger.error("HIN configuration file is missi ng at 'HIN_CONFIGURATION_FILE_PATH'", e);
		} catch (IOException e) {
			logger.error("Error while reading HIN configuration file at 'HIN_CONFIGURATION_FILE_PATH'", e);
		}
	}
	
	@Override
	public void contextDestroyed(ServletContextEvent servletContextEvent) {
		//ServletContext servletContext = servletContextEvent.getServletContext();
		
		HINApplicationContext context = HINApplicationContext.getHINApplicationContext();
		context.destroyApplicationContext();
	}

}
