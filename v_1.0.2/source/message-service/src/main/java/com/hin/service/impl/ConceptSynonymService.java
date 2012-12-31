/**
 * 
 */
package com.hin.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hin.core.repo.IBaseRepository;
import com.hin.domain.ConceptSynonym;
import com.hin.service.IConceptSynonymService;

/**
 * @author sunanda.hangoraki
 * 
 */
@Service(value = "conceptSynonymService")
public class ConceptSynonymService extends BaseService<ConceptSynonym>
		implements IConceptSynonymService {

	private static final long serialVersionUID = 1L;
	@Autowired
	private IBaseRepository<ConceptSynonym> baseRepository;

	@Override
	public ConceptSynonym findByName(ConceptSynonym conceptSynonym)
			throws Exception {
		return baseRepository.findByProperty("name",
				(Object) conceptSynonym.getName(), ConceptSynonym.class);
	}

	@Override
	public List<ConceptSynonym> findByNameSynonym(
			ConceptSynonym conceptSynonym, String key) throws Exception {
		return baseRepository.findAllByProperty(key, conceptSynonym.getName(),
				ConceptSynonym.class);
	}

	/*
	 * @Override public void delete(ConceptSynonym conceptSynonym) throws
	 * Exception { baseRepository.delete(conceptSynonym); }
	 */

}
