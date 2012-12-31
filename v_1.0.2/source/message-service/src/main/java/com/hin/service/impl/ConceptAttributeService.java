/**
 * 
 */
package com.hin.service.impl;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hin.core.repo.IBaseRepository;
import com.hin.domain.ConceptAttribute;
import com.hin.domain.Unit;
import com.hin.service.IConceptAttributeService;

/**
 * @author vinaykumar.gk
 * 
 */
@Service(value = "ConceptAttributeService")
public class ConceptAttributeService extends BaseService<ConceptAttribute>
		implements IConceptAttributeService {

	private Logger logger = Logger.getLogger(ConceptClassService.class
			.getName());

	@Autowired
	private IBaseRepository<ConceptAttribute> baseRepository;

	@Override
	public void saveConceptAttribute(ConceptAttribute conceptAttribute) {
		try {
			baseRepository.save(conceptAttribute);
		} catch (Exception e) {
			logger.error(e);
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	@Override
	public List<ConceptAttribute> findAllConceptAttribute() throws Exception {
		return baseRepository.findAll(ConceptAttribute.class);
	}

}
