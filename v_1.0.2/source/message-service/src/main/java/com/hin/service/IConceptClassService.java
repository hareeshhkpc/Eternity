/**
 * 
 */
package com.hin.service;

import java.util.List;

import com.hin.domain.Concept;
import com.hin.domain.ConceptClass;

/**
 * @author swetha.murthy
 *
 */

public interface IConceptClassService extends IBaseService<ConceptClass> {

	/*public void save(ConceptClass conceptClass) throws Exception;
	
	public void delete(ConceptClass conceptClass) throws Exception;*/
	
	public List<ConceptClass> findAllByName(ConceptClass conceptClass) throws Exception;
	
	/*public ConceptClass findById(ConceptClass conceptClass) throws Exception;*/

	public List<ConceptClass> getConcepts();
	
	 public List<ConceptClass> findAllConceptClass() throws Exception;
}
