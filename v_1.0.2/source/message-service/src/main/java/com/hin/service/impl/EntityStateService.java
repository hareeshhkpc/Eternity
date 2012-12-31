/**
* 
*/
package com.hin.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hin.domain.EntityState;
import com.hin.hl7.messaging.api.IIdentityRepository;
import com.hin.hl7messaging.cassandra.ICassandraConnector;
import com.hin.service.IEntityStateService;



/**
* @author Hari Krishnan p.c
* 
*/

@Service(value = "EntityStateService")
public class EntityStateService  implements IEntityStateService {
	
	//@Autowired
	//private IIdentityRepository messageService;
	
	@Autowired
	private ICassandraConnector cassandraConnector;
	
	public void changeState(EntityState entityState){
		String columnFamily = "ENTITY_STATE";
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("ROWKEY", entityState.getEntityid());
		map.put(entityState.getState(), entityState.getStatevalue());
		map.put("time", entityState.getTime());
		map.put("OrganizationId", entityState.getAssigningOrganizationID());
		cassandraConnector.saveStandardColumnFamily(map, columnFamily,entityState.getAssigningOrganizationID());
	}
	
	public List<EntityState> getStates(EntityState entityState){
		HashMap<String, String> condtitionMap = new HashMap<String, String>();
		condtitionMap.put(entityState.getState(), entityState.getStatevalue());
		condtitionMap.put("OrganizationId", entityState.getAssigningOrganizationID());
		List<EntityState> entityList = null;
		Map<String, HashMap<String, String>> maps = cassandraConnector.retrieveStandardColumnFamily("ENTITY_STATE",condtitionMap,entityState.getAssigningOrganizationID());
		
		if(maps != null && maps.size() > 0){
			entityList = new ArrayList<EntityState>();			
			for(Map.Entry<String, HashMap<String, String>> entry : maps.entrySet()){
				String stateID = entry.getKey();
				EntityState ent = new EntityState();
				ent.setEntityid(stateID);
				for(Map.Entry<String, String> stateEntry : entry.getValue().entrySet()){
					if(stateEntry.getKey().equals("KEY")){
						continue;
					}
					if(stateEntry.getKey().equals(entityState.getState())){
						ent.setState(stateEntry.getKey());
						ent.setStatevalue(stateEntry.getValue());
					}else if(stateEntry.getKey().equals("time")){
						ent.setTime(stateEntry.getValue());
					}else if(stateEntry.getKey().equals("OrganizationId")){
						ent.setAssigningOrganizationID(stateEntry.getValue());
					}
					
				}
				entityList.add(ent);
			}			
		}
		
		return entityList;	
	}
	
	public EntityState getState(String entityId,String organizationId) throws Exception{
		Map<String, HashMap<String, String>> maps = cassandraConnector.retrieveStandardColumnFamily("ENTITY_STATE", entityId,organizationId);
		EntityState entityState = new EntityState();
		for(Map.Entry<String, HashMap<String, String>> entry : maps.entrySet()){
			entityState.setEntityid(entry.getKey());
			for(Map.Entry<String, String> stateEntry : entry.getValue().entrySet()){
				if(stateEntry.getKey().equals("KEY")){
					continue;
				}
				if(stateEntry.getKey().equals("OrganizationId")){
					entityState.setAssigningOrganizationID(stateEntry.getValue());
				}else if(stateEntry.getKey().equals("checkedin")){
					entityState.setState(stateEntry.getKey());
					entityState.setStatevalue(stateEntry.getValue());	
				}
			}
		}	
		return entityState;	
	}
			
}