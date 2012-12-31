/**
 * 
 */
package com.hin.hl7messaging;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.log4j.Logger;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;

import com.hin.domain.Concept;
import com.hin.domain.vo.ConceptVO;
import com.hin.service.impl.ConceptService;

/**
 * @author krishna.lr
 * 
 */
@ContextConfiguration(locations = {
		"classpath:spring/applicationContext-core-test.xml",
		"classpath:spring/mongodb-test.xml" })
public class ConceptTest extends AbstractJUnit4SpringContextTests {

	@Autowired
	ConceptService conceptService;
	private Logger logger = Logger.getLogger(ConceptTest.class.getName());

	@Test
	public void findAllByName() {
		try {
			List<ConceptVO> concepts = new ArrayList<ConceptVO>();
			List<Concept> listvalue = new ArrayList<Concept>();
			listvalue = conceptService.findAllConceptsByProperty(
					"conceptClasses.name", "test");
			Iterator<Concept> iterator = listvalue.iterator();
			while (iterator.hasNext()) {
				Concept concept = iterator.next();
				concepts.add(new ConceptVO(concept.getName(), concept.getDescription(),null, null, null));
			}
			logger.info("Concepts: " + concepts);
		} catch (Exception e) {
			logger.error("Exception:" + e.getMessage());
		}

	}
	
	@Test
	public void findAllByDualProperty(){
		try {
			List<ConceptVO> concepts = new ArrayList<ConceptVO>();
			List<Concept> listvalue = new ArrayList<Concept>();
			String regex = ".*"+"m"+".*"; 
			listvalue = conceptService.findAllConceptsByDualProperty("conceptClasses.name", "sex", "description", regex);
			Iterator<Concept> iterator = listvalue.iterator();
			while (iterator.hasNext()) {
				Concept concept = iterator.next();
				logger.info("Concepts:@@@@ "+concept.getDescription());
				concepts.add(new ConceptVO(concept.getName(), concept.getDescription(),null, regex, regex));
			}
			logger.info("Concepts: " + concepts);
		} catch (Exception e) {
			logger.error("Exception:" + e.getMessage());
		}
	}
	
}
