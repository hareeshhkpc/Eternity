package com.hin.messaging.service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.HashMap;

import javax.xml.xpath.XPathConstants;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import com.hin.hl7messaging.config.HINConfigurationProperty;
import com.hin.hl7messaging.context.HINApplicationContext;
import com.hin.hl7messaging.identity.repository.IdentityMessageRepository;
import com.hin.hl7messaging.utils.XMLHelper;
import com.hin.messaging.IWorkFlowDefinition;

@Service(value = "workFlowDefinition")
public class WorkFlowDefinition implements IWorkFlowDefinition {
	
	//@Value("${workflow.WORKFLOW_DEPLOYMENT_PATH}")
	@Value("${messageConfig.dirPath}")
	private String WORKFLOW_DEPLOYMENT_PATH;
	
	@Value("${DEPLOY_WORKFLOW}")
	private String SHOULD_DEPLOY_WORKFLOW_DEF;
	
	@Autowired
	private IdentityMessageRepository messageService;
	
	private  String readFileAsString(String filePath) throws java.io.IOException{

	StringBuffer fileData = new StringBuffer(1000);
	BufferedReader reader = new BufferedReader(new FileReader(filePath));
	char[] buf = new char[1024];

	int numRead=0;
	while((numRead=reader.read(buf)) != -1){

	String readData = String.valueOf(buf, 0, numRead);
    fileData.append(readData);
    buf = new char[1024];
    }
    reader.close();
    return fileData.toString();

	}
	

	public void deployWorkFlow() throws Exception{
	/*	try{*/
			//String deploy = HINApplicationContext.getHINApplicationContext().getConfigurationParameter(HINConfigurationProperty.DEPLOY_WORKFLOW);
			//if(deploy != null && deploy.equals("true")){
			if(SHOULD_DEPLOY_WORKFLOW_DEF != null && SHOULD_DEPLOY_WORKFLOW_DEF.equalsIgnoreCase("true")){
				deployTask();
			}
			/*}
	}catch(Exception ex){
			System.out.println(ex.getMessage());
		}*/
		
	}

	public void deployTask() throws Exception {
		/*String deploymentPath = HINApplicationContext
				.getHINApplicationContext().getRealPath(
						WORKFLOW_DEPLOYMENT_PATH);*/

		File file = new File(WORKFLOW_DEPLOYMENT_PATH);
		for (File deploymentFile : file.listFiles()) {
			if(deploymentFile.getName().substring(0, deploymentFile.getName().indexOf(".")).length()>45){
				System.out.println("Error while deploying:" + deploymentFile.getName());
				throw new Exception(deploymentFile.getName() +": Length greater than 45 charchter");
			}
			try {

				Document confDoc = XMLHelper.getXMLDocument(deploymentFile);
				Element workflowDef = (Element) XMLHelper.read(confDoc, "//WorkFlowDefinition[1]", XPathConstants.NODE);
				StringBuffer confContent = new StringBuffer();
				confContent.append(XMLHelper.getXMLDocumentAsString(workflowDef));
								
				HashMap<String, Object> workFlowDefMap = new HashMap<String, Object>();
				workFlowDefMap.put("ROWKEY", deploymentFile.getName()
						.substring(0, deploymentFile.getName().indexOf(".")));
				/*workFlowDefMap.put("MESSAGEWORKFLOW",
						readFileAsString(deploymentFile.getAbsolutePath()));*/
				
				workFlowDefMap.put("MESSAGEWORKFLOW", confContent.toString());
				
				messageService.saveStandardColumnFamily(workFlowDefMap,
						"WORKFLOW_DEFINITION");
				System.out.println("File :" + deploymentFile.getName()
						+ " deployed sucessfully.");
			} catch (Exception ex) {
				System.out.println("Error while deploying:" + ex.getMessage());
			}

		}
	}
}
