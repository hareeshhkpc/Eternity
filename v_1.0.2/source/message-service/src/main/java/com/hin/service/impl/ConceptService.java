/**
 * 
 */
package com.hin.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hin.core.repo.IBaseRepository;
import com.hin.domain.Concept;
import com.hin.service.IConceptService;

/**
 * @author vineeth.ng
 * 
 */
@Service(value = "conceptService")
public class ConceptService extends BaseService<Concept> implements
		IConceptService {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Autowired
	private IBaseRepository<Concept> baseRepository;

	@Override
	public List<Concept> getConcepts() {
		List<Concept> concepts = findAll(Concept.class);
		if (concepts == null) {
			return new ArrayList<Concept>();
		}
		return concepts;
	}

	@Override
	public List<Concept> findByConceptName(Concept concept) {
		return findAllByProperty("name", (Object) concept.getName(),
				Concept.class);
	}

	@Override
	public Concept findByConceptId(Concept concept) throws Exception {
		return findById(concept.getId(), Concept.class);
	}

	@Override
	public void deleteConcept(Concept concept) throws Exception {
		baseRepository.delete(concept);

	}

	@Override
	public List<Concept> findAllConceptsByProperty(String key, String value) {
		return findAllByProperty(key, value, Concept.class);
	}

	@Override
	public List<Concept> findAllConceptsByDualProperty(String key1,
			String value1, String key2, String value2) {
		return findByDualProperty(key1, value1, key2, value2, Concept.class);
	}

	@Override
	public Concept findByName(String name) {
		return findByName(name, Concept.class);
	}

}
