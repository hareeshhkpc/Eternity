package com.hin.service.impl;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.hin.domain.ProcessDefinition;
import com.hin.hl7messaging.config.HINConfigurationProperty;
import com.hin.hl7messaging.context.HINApplicationContext;
import com.hin.service.IProcessDefinitionService;

@Service(value = "processService")
public class ProcessDefinitionService extends BaseService<ProcessDefinition>
		implements IProcessDefinitionService {

	private String readFileAsString(String filePath) throws java.io.IOException {
		StringBuffer fileData = new StringBuffer(1000);
		BufferedReader reader = new BufferedReader(new FileReader(filePath));
		char[] buf = new char[1024];

		int numRead = 0;
		while ((numRead = reader.read(buf)) != -1) {

			String readData = String.valueOf(buf, 0, numRead);
			fileData.append(readData);
			buf = new char[1024];
		}
		reader.close();
		return fileData.toString();
	}

	public void DeployProcess() {
		String configLocation = (String) HINApplicationContext
				.getHINApplicationContext().getConfigurationParameter(
						HINConfigurationProperty.PROCESS_CONFIG_PATH);
		String deploymentPath = HINApplicationContext
				.getHINApplicationContext().getRealPath(configLocation);

		File file = new File(deploymentPath);
		for (File deploymentFile : file.listFiles()) {
			try {
				Gson gson = new Gson();
				ProcessDefinition processDefinition = gson.fromJson(
						readFileAsString(deploymentFile.getAbsolutePath()),
						ProcessDefinition.class);
				save(processDefinition);
			} catch (Exception ex) {
				System.out.println(ex.getMessage());
			}
		}
	}

	public ProcessDefinition findByProcessName(String name) {
		List<ProcessDefinition> processDefinitionList = findAllByProperty(
				"processName", (Object) name, ProcessDefinition.class);
		ProcessDefinition processDefinition = null;
		for (ProcessDefinition processDef : processDefinitionList) {
			if (processDef.getVersion() == null) {
				processDef.setVersion(0);
			}
			if (processDefinition == null
					|| (processDefinition != null && processDefinition
							.getVersion() < processDef.getVersion()))
				processDefinition = processDef;
		}
		return processDefinition;
	}

	public ProcessDefinition findByProcessName(String name, Integer version) {
		List<ProcessDefinition> processDefinitionList = findAllByProperty(
				"processName", (Object) name, ProcessDefinition.class);
		ProcessDefinition processDefinition = null;
		for (ProcessDefinition processDef : processDefinitionList) {
			if (processDefinition.getVersion() == version)
				processDefinition = processDef;
		}
		return null;
	}

	@Override
	public List<ProcessDefinition> getProcess() {
		List<ProcessDefinition> processDefinitions = findAll(ProcessDefinition.class);
		if (processDefinitions == null) {
			return new ArrayList<ProcessDefinition>();
		}
		return processDefinitions;

	}

}
