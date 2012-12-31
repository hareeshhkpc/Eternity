/**
 * 
 */
package com.hin.service;

import java.util.List;

import com.hin.domain.ConceptSynonym;

/**
 * @author sunanda.hangoraki
 *
 */
public interface IConceptSynonymService extends IBaseService<ConceptSynonym> {

	public ConceptSynonym findByName(ConceptSynonym conceptSynonym) throws Exception;
	
	public List<ConceptSynonym> findByNameSynonym(ConceptSynonym conceptSynonym,String key)throws Exception;

	/*public void delete(ConceptSynonym conceptSynonym) throws Exception;*/
}
