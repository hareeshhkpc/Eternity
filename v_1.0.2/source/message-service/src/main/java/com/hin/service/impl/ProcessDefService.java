package com.hin.service.impl;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.Map.Entry;

import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.hector.api.Serializer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.hin.domain.ProcessDefinition;
import com.hin.hl7messaging.cassandra.CassandraConnector;
import com.hin.hl7messaging.config.HINConfigurationProperty;
import com.hin.hl7messaging.context.HINApplicationContext;
import com.hin.service.IProcessDefService;

@Service(value = "processDefinitionService")
public class ProcessDefService<K, V> implements IProcessDefService {

	String columnFamily = "PROCESS_DEFINITION";
	String organizationId = "HINORG";
	
	@Autowired CassandraConnector cassandraConnector;
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

	@Override
	public List<ProcessDefinition> getAllProcess() {
		Serializer<String> stringSerializer = StringSerializer.get();
		String query ="select * from '" + columnFamily+"'";
		List<ProcessDefinition> processDefinitions = new ArrayList<ProcessDefinition>();
		
		Map<String, HashMap<String, String>> resultMap = new HashMap<String, HashMap<String, String>>();
		resultMap = cassandraConnector.queryKeySpace(query, stringSerializer, stringSerializer, stringSerializer, organizationId);
		List<String> list = new ArrayList<String>(resultMap.keySet());
		for (int i = 0; i < list.size(); i++) {
			String processName = list.get(i);
			HashMap<String, String> mapValue = resultMap.get(processName);
			String processDefinition = mapValue.get("ProcessDefinition");
			if(processDefinition!=null){
				Gson gson = new Gson(); 
				ProcessDefinition processDefinitionJsonObject = gson.fromJson(processDefinition, ProcessDefinition.class);
				processDefinitions.add(processDefinitionJsonObject);
			}
		}
		
		return processDefinitions;
	}

	@Override
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

	@Override
	public ProcessDefinition findByProcessName(String name) {
		String query ="select * from '" + columnFamily
				+ "' where key = '" + name + "'";
		Serializer<String> stringSerializer = StringSerializer.get();
		Map<String, HashMap<String, String>> resultMap = new HashMap<String, HashMap<String, String>>();
		ProcessDefinition processDefinition = null;
		
		resultMap = cassandraConnector.queryKeySpace(query, stringSerializer, stringSerializer, stringSerializer, organizationId);
		HashMap<String, String> mapValue = resultMap.get(name);
		String processDefinitionJSON = mapValue.get("ProcessDefinition");
		Gson gson = new Gson(); 
		ProcessDefinition processDefinitionJsonObject = gson.fromJson(processDefinitionJSON, ProcessDefinition.class);
		
		if (processDefinitionJsonObject.getVersion() == null) {
			processDefinitionJsonObject.setVersion(0);
		}
		if (processDefinition == null
				|| (processDefinition != null && processDefinition
						.getVersion() < processDefinitionJsonObject.getVersion()))
			processDefinition = processDefinitionJsonObject;
		
		return processDefinition;
	}

	@Override
	public ProcessDefinition findByProcessName(String name, Integer version) {
		String query ="select * from '" + columnFamily
				+ "' where key = '" + name + "'";
		Serializer<String> stringSerializer = StringSerializer.get();
		Map<String, HashMap<String, String>> resultMap = new HashMap<String, HashMap<String, String>>();
		ProcessDefinition processDefinition = null;
		
		resultMap = cassandraConnector.queryKeySpace(query, stringSerializer, stringSerializer, stringSerializer, organizationId);
		HashMap<String, String> mapValue = resultMap.get(name);
		String processDefinitionJSON = mapValue.get("ProcessDefinition");
		Gson gson = new Gson(); 
		ProcessDefinition processDefinitionJsonObject = gson.fromJson(processDefinitionJSON, ProcessDefinition.class);
		
		if (processDefinition.getVersion() == version)
			processDefinition = processDefinitionJsonObject;
		
		return null;
	}
	
	

	public void save(ProcessDefinition processDefinition){
		String key = processDefinition.getProcessName();
		Gson gson = new Gson(); 
		String processDefinitionJson = gson.toJson(processDefinition);
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("ROWKEY", key);
		map.put("ProcessDefinition", processDefinitionJson);
		cassandraConnector.saveStandardColumnFamily(map, columnFamily, organizationId);
	}
	
	public String generateNewID() {
		 return UUID.randomUUID().toString();
	}

	@Override
	public void deleteProcessDefinition(ProcessDefinition processDefinition) {
		String key = processDefinition.getProcessName();
		cassandraConnector.deleteRow(columnFamily, key, organizationId);
	}

	
	
}
