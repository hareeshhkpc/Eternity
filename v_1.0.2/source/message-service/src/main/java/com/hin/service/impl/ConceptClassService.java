/**
 * 
 */
package com.hin.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hin.core.repo.IBaseRepository;
import com.hin.domain.Concept;
import com.hin.domain.ConceptClass;
import com.hin.service.IConceptClassService;

/**
 * @author swetha.murthy
 * 
 */
@Service(value = "ConceptClassService")

public class ConceptClassService  extends BaseService<ConceptClass> implements  IConceptClassService {


	private Logger logger = Logger.getLogger(ConceptClassService.class
			.getName());

	@Autowired
	private IBaseRepository<ConceptClass> baseRepository;

	/*public void save(ConceptClass conceptClass) throws Exception {
		try {
			baseRepository.save(conceptClass);
		} catch (Exception e) {
			logger.error(e);
			throw e;
		}
	}*/

	/*@Override
	public void delete(ConceptClass conceptClass) throws Exception {
		try {
			baseRepository.delete(conceptClass);
		} catch (Exception e) {
			logger.error(e);
			throw e;
		}
	}*/

	@Override
	public List<ConceptClass> findAllByName(ConceptClass conceptClass)
			throws Exception {
		try {
			return baseRepository.findAllByProperty("name", conceptClass
					.getName(), ConceptClass.class);
		} catch (Exception e) {
			logger.error(e);
			throw e;
		}
	}

	/*@Override
	public ConceptClass findById(ConceptClass conceptClass) throws Exception {
		try {
			return baseRepository.findById(conceptClass.getId(),
					ConceptClass.class);
		} catch (Exception e) {
			logger.error(e);
			throw e;
		}
	}*/

	@Override
	public List<ConceptClass> getConcepts() {
		List<ConceptClass> concept = baseRepository.findAll(ConceptClass.class);
		if (concept == null) {
			return new ArrayList<ConceptClass>();
		}
		return concept;
	}

	@Override
	public List<ConceptClass> findAllConceptClass() throws Exception {
		return baseRepository.findAll(ConceptClass.class);
	}


}
