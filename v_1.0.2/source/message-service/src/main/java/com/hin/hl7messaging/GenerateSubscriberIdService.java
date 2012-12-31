package com.hin.hl7messaging;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.hin.hl7.messaging.api.IIdentityRepository;
import com.hin.hl7messaging.api.IGenerateSubscriberIdService;

@Service(value="generateSubscriberIdService")
public class GenerateSubscriberIdService implements IGenerateSubscriberIdService {
	
	@Resource(name="identityMessageRepository")
	private IIdentityRepository repository;

	public GenerateSubscriberIdService() {
		
	}
	
	public String generateSubscriberId(){
		String subscriberId="", rowKey="subscriberId";
		Map<String, HashMap<String, String>> resultMap = new HashMap<String, HashMap<String, String>>();
		HashMap<String, Object> columnValueMap = new HashMap<String, Object>();
		//resultMap = repository.retrieveStandardColumnFamily("GENERATE_SUBSCRIBERID", rowKey);
		if (resultMap != null && !resultMap.isEmpty()) {
			Iterator<String> randomNumberIterator = resultMap.keySet().iterator();
			while(randomNumberIterator.hasNext()){
				randomNumberIterator.next();
				//columnValueMap = resultMap.get(rowKey);
				subscriberId = (String)columnValueMap.get("RANDOM_NUMBER");
			}
		}
		
		columnValueMap.clear();
		int i = Integer.parseInt(subscriberId);
		i++;
		subscriberId = String.valueOf(i);
		columnValueMap.put("ROWKEY", "subscriberId");
		columnValueMap.put("RANDOM_NUMBER", subscriberId);
		//repository.saveStandardColumnFamily(columnValueMap, "GENERATE_SUBSCRIBERID");
		
		return subscriberId;
	}
	
}
