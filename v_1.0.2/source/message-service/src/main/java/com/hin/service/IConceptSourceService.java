/**
 * 
 */
package com.hin.service;

import java.util.List;

import com.hin.domain.ConceptSource;

/**
 * @author salam.halley and Ranga.Reddy
 *
 */
public interface IConceptSourceService extends IBaseService<ConceptSource> {

	/* public void save(ConceptSource source) throws Exception; */
	//public List<ConceptSource> findByConceptSourceName(ConceptSource source) throws Exception;
	
	public List<ConceptSource> getConceptSources();
	List<ConceptSource> findByConceptSourceName(ConceptSource source)
			throws Exception;
	public ConceptSource findByConceptSourceId(Object id);
			
}
