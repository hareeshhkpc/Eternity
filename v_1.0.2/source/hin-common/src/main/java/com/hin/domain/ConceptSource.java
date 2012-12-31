/**
 * 
 */
package com.hin.domain;

import com.hin.domain.core.BaseDomain;

/**
 * @author salam.halley and Ranga.Reddy
 *
 */
public class ConceptSource extends BaseDomain {
	private String name;
	private String description;
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}

}
