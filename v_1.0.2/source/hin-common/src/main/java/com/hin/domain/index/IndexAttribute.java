/**
 * 
 */
package com.hin.domain.index;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;



/**
 * @author Administrator
 *
 */
@Entity
public class IndexAttribute {

	 @Id
	 @GeneratedValue(strategy = GenerationType.AUTO)
	 private Long id;
	 
	 private String attrubuteName;
	 
	/**
	 * @return the id
	 */
	public Long getId() {
		return id;
	}
	/**
	 * @param id the id to set
	 */
	public void setId(Long id) {
		this.id = id;
	}
	public String getAttrubuteName() {
		return attrubuteName;
	}
	public void setAttrubuteName(String attrubuteName) {
		this.attrubuteName = attrubuteName;
	}	 
}
