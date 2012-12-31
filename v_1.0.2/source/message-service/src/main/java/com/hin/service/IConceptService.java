/**
 * 
 */
package com.hin.service;

import java.util.List;

import com.hin.domain.Concept;

/**
 * @author vineeth.ng
 * 
 */
public interface IConceptService extends IBaseService<Concept> {

	public Concept findByName(String name) throws Exception;

	public List<Concept> findByConceptName(Concept concept) throws Exception;

	public List<Concept> getConcepts();

	public void deleteConcept(Concept concept) throws Exception;

	public Concept findByConceptId(Concept concept) throws Exception;

	public List<Concept> findAllConceptsByProperty(String key, String value);

	public List<Concept> findAllConceptsByDualProperty(String key1,
			String value1, String key2, String value2);

}
