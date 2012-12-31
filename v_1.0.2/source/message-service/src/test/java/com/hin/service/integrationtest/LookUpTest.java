/**
 * 
 */
package com.hin.service.integrationtest;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.log4j.Logger;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;

import com.hin.core.repo.IBaseRepository;
import com.hin.domain.Concept;
import com.hin.domain.utils.SearchCriteria;

/**
 * @author krishna.lr
 * 
 */

@ContextConfiguration(locations = {
		"classpath:spring/applicationContext-core-test.xml",
		"classpath:spring/mongodb-test.xml" })
public class LookUpTest extends AbstractJUnit4SpringContextTests {

	@Autowired
	private IBaseRepository<Concept> baseRepository;

	private Logger logger = Logger.getLogger(LookUpTest.class.getName());

	@Test
	public void testLookUp() {
		List<SearchCriteria> searchCriteriaList = new ArrayList<SearchCriteria>();
		List<Concept> listvalue = new ArrayList<Concept>();
		SearchCriteria searchCriteria1 = new SearchCriteria();
		searchCriteria1.setProperty("description");
		searchCriteria1.setCondition("=");
		searchCriteria1.setValue("bangalore");
		searchCriteriaList.add(searchCriteria1);
		SearchCriteria searchCriteria2 = new SearchCriteria();
		searchCriteria2.setProperty("conceptClasses.name");
		searchCriteria2.setCondition("=");
		searchCriteria2.setValue("city");
		searchCriteriaList.add(searchCriteria2);
		listvalue = baseRepository.findByCriteria(searchCriteriaList,
				Concept.class);
		Iterator<Concept> iterator = listvalue.iterator();
		while (iterator.hasNext()) {
			Concept concept = iterator.next();
			logger.info("name: " + concept.getName() + " description: "
					+ concept.getDescription());
		}
	}

}
