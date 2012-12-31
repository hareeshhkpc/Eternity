/**
 * 
 */
package com.hin.domain;

import com.hin.domain.core.BaseDomain;

/**
 * @author madhu.murmu
 *
 */
public class ConceptSynonym extends BaseDomain{
	
	private String name;
	
	public ConceptSynonym(){
		
	}

	/**
	 * @return the name
	 */
	public String getName() {
		return name;
	}

	/**
	 * @param name the name to set
	 */
	public void setName(String name) {
		this.name = name;
	}
	
	public String toString(){
		return "ConceptSynonym({name:"+name+", version: "+version.intValue()+" ,Id : "+id+"  ,createdBy : "+createdBy.getName()+"})";
	}

}
