/**
* 
*/

package com.hin.service;



import java.util.List;

import com.hin.domain.EntityState;


/**
 * @author Hari Krishnan p.c
 * 
*/

public interface IEntityStateService {
	
	public void changeState(EntityState entityState) throws Exception;
	
	public EntityState getState(String entityId,String organizationId) throws Exception;
	
	public List<EntityState> getStates(EntityState entityState) throws Exception;
	
	
}