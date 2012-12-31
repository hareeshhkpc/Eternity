/**
 * 
 */
package com.hin.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hin.core.repo.IBaseRepository;
import com.hin.domain.ConceptSource;
import com.hin.service.IConceptSourceService;

/**
 * @author salam.halley and Ranga.Reddy
 * 
 */
@Service(value = "ConceptSourceService")
public class ConceptSourceService extends BaseService<ConceptSource> implements
		IConceptSourceService {

	@Autowired
	private IBaseRepository<ConceptSource> baseRepository;

	/*
	 * @Override public void save(ConceptSource source) throws Exception {
	 * baseRepository.save(source); }
	 */

	@Override
	public List<ConceptSource> findByConceptSourceName(ConceptSource source)
			throws Exception {
		return baseRepository.findAllByProperty("name", source.getName(),
				ConceptSource.class);
	}

	@Override
	public List<ConceptSource> getConceptSources() {
		List<ConceptSource> concepts = baseRepository
				.findAll(ConceptSource.class);
		if (concepts == null) {
			return new ArrayList<ConceptSource>();
		}
		return concepts;

	}

	@Override
	public ConceptSource findByConceptSourceId(Object id) {

		return (ConceptSource) baseRepository.findById(id, ConceptSource.class);
	}

}
