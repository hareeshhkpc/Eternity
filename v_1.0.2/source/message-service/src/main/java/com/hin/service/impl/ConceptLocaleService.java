/**
 * 
 */
package com.hin.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



import com.hin.core.repo.IBaseRepository;
import com.hin.domain.ConceptClass;
import com.hin.domain.ConceptLocale;
import com.hin.service.IConceptLocaleService;

/**
 * @author thanveer.aqthar
 * 
 */
@Service(value = "conceptLocaleService")
public class ConceptLocaleService extends BaseService<ConceptLocale> implements IConceptLocaleService {

	@Autowired
	private IBaseRepository<ConceptLocale> baseRepository;

	@Override
	public List<ConceptLocale> findByName(ConceptLocale conceptLocale) {

		// TODO Auto-generated method stub
		return baseRepository.findAllByProperty("name",(Object) conceptLocale.getName(), ConceptLocale.class);
	}

	@Override
	public ConceptLocale save(ConceptLocale conceptLocale) throws Exception {
		return baseRepository.save(conceptLocale);
	}

	/*@Override
	public void delete(ConceptLocale conceptLocale) throws Exception {
		try {
			baseRepository.delete(conceptLocale);
		} catch (Exception e) {
			throw e;
		}
		
	}*/

	@Override
	public ConceptLocale findById(ConceptLocale conceptLocale) {
		// TODO Auto-generated method stub
		return baseRepository.findById(conceptLocale.getId() ,ConceptLocale.class); 
	}

	@Override
	public List findAllConceptLocale() {
		
		return baseRepository.findAll(ConceptLocale.class)  ;
	}

	@Override
	public List<ConceptLocale> getConcepts() {
		List<ConceptLocale> concept = baseRepository.findAll(ConceptLocale.class);
		if (concept == null) {
			return new ArrayList<ConceptLocale>();
		}
		return concept;
	}
}
