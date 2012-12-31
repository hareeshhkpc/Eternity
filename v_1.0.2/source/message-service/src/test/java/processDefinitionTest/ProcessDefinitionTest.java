package processDefinitionTest;

import java.io.File;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.hector.api.Serializer;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;

import com.google.gson.Gson;
import com.hin.domain.ProcessDefinition;
import com.hin.domain.Step;
import com.hin.hl7messaging.cassandra.CassandraConnector;
import com.hin.service.IBaseService;
import com.hin.service.impl.BaseService;
import com.hin.service.impl.ProcessDefService;

@ContextConfiguration(locations = {
		"classpath:spring/applicationContext-core-test.xml",
		"classpath:spring/mongodb-test.xml" })
public class ProcessDefinitionTest extends AbstractJUnit4SpringContextTests {

	@Autowired
	IBaseService<ProcessDefinition> baseService;

	@Test
	public void save() throws Exception {
		String key = "Demographics";

		List<Step> steps = new ArrayList<Step>();
		Step step1 = null;
		Step step2 = null;
		steps.add(0, step1);
		steps.add(1, step2);

		ProcessDefinition processDefinitionObj = new ProcessDefinition();
		processDefinitionObj.setProcessName("DEMOGRAPHICS");
		processDefinitionObj.setDescription("DEMOGRAPHICS");
		processDefinitionObj.setId("id");
		processDefinitionObj.setSteps(steps);

		Gson gson = new Gson();
		String processDefinitionJson = gson.toJson(processDefinitionObj);

		String columnFamily = "PROCESS_DEFINITION";
		String organizationId = "ETERNITY";
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("ROWKEY", key);
		map.put("ProcessDefinition", processDefinitionJson);

		CassandraConnector cassandraConnector = new CassandraConnector();
		cassandraConnector.setClusterName("HIN Cluster");
		cassandraConnector.setKeyspaceName("HIN_ETERNITY");
		cassandraConnector.setIsThrift(true);
		cassandraConnector.setHost("172.25.250.167");
		cassandraConnector.setPort(9160);
		cassandraConnector.initClient();
		// cassandraConnector.saveStandardColumnFamily(map, columnFamily,
		// organizationId);

		String query = "select * from '" + columnFamily + "' where key = '"
				+ key + "'";

		Serializer<String> stringSerializer = StringSerializer.get();
		Map<String, HashMap<String, String>> resultMap = new HashMap<String, HashMap<String, String>>();

		resultMap = cassandraConnector.queryKeySpace(query, stringSerializer,
				stringSerializer, stringSerializer, organizationId);
		System.out.println("resultMap:\n" + resultMap);

		HashMap<String, String> mapValue = resultMap.get(key);
		// System.out.println(mapValue);
		String processDefinition = mapValue.get("ProcessDefinition");
		System.out.println("process definition:\n" + processDefinition);

		ProcessDefinition processDefinitionJsonObject = gson.fromJson(
				processDefinition, ProcessDefinition.class);
		System.out.println("Object:\n" + processDefinitionJsonObject);
	}

	@Test
	public List<ProcessDefinition> fetchProcessDefinitionTest() {
		List<ProcessDefinition> processDefinitions = baseService.findAll(ProcessDefinition.class);
		
		/*for (int i = 0; i < processDefinitions.size(); i++) {
			ProcessDefinition processDefinition = processDefinitions.get(i);
			Gson gson = new Gson();
			String processDefinitionJson = gson.toJson(processDefinition);
			try {
				File file = new File("location","Processdefinitions.txt");
				PrintWriter printWriter = new PrintWriter(file);
				printWriter.print(processDefinitionJson);
				printWriter.flush();
				printWriter.close();
				System.out.println("saved successfully");
			} catch (Exception e) {
				System.out.println(e);
			}
		}*/
		
		return processDefinitions;
	}
	
	@Test
	public void migrateProcessDefinitionToCassandra() throws Exception{
		CassandraConnector cassandraConnector = new CassandraConnector();
		cassandraConnector.setClusterName("HIN Cluster");
		cassandraConnector.setKeyspaceName("HIN_ETERNITY");
		cassandraConnector.setIsThrift(true);
		cassandraConnector.setHost("172.25.250.167");
		cassandraConnector.setPort(9160);
		cassandraConnector.initClient();
		//List<ProcessDefinition> processDefinitions = baseService.findAll(ProcessDefinition.class);
		
		List<ProcessDefinition> processDefinitions = fetchProcessDefinitionTest();
		
		for (int i = 0; i < processDefinitions.size(); i++) {
			ProcessDefinition processDefinition = processDefinitions.get(i);
			String key = processDefinition.processName;
			Gson gson = new Gson();
			String processDefinitionJson = gson.toJson(processDefinition);
			HashMap<String, Object> map = new HashMap<String, Object>();
			map.put("ROWKEY", key);
			map.put("ProcessDefinition", processDefinitionJson);
			try {
				cassandraConnector.saveStandardColumnFamily(map, "PROCESS_DEFINITION", "HINORG");
				System.out.println("saved successfully");
			} catch (Exception e) {
				System.out.println(e);
			}
		}
	}
	
	

}
