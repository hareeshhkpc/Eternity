/**
 * 
 */
package com.hin.service;

import java.util.List;

import com.hin.domain.ConceptAttribute;


/**
 * @author vinaykumar.gk
 * 
 */
public interface IConceptAttributeService extends
		IBaseService<ConceptAttribute> {
	public void saveConceptAttribute(ConceptAttribute conceptAttribute);

	public List<ConceptAttribute> findAllConceptAttribute() throws Exception;	
	
}
