/**
 * 
 */
package com.hin.repo.integrationtest;

import static junit.framework.Assert.assertNotNull;

import java.util.List;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;

import com.hin.core.repo.IBaseRepository;
import com.hin.domain.Concept;
import com.hin.domain.User;

/**
 * @author Administrator
 *
 */
@ContextConfiguration(locations = {
		"classpath:spring/applicationContext-core-test.xml", 
		"classpath:spring/mongodb-test.xml"})
public class ConceptPersistTest extends  AbstractJUnit4SpringContextTests{

	@Autowired
	private IBaseRepository<Concept> conceptRepo;
	@Autowired
	private IBaseRepository<User> userRepo;
	
	private Concept concept;
	private User user;
	
	@Before
	public void initTestCase(){
		assertNotNull(conceptRepo);
		
		concept = new Concept();
		concept.setName("Patient Gender");
		concept.setShortName("Gender");
		
		user = new User();
		user.setName("manu");
		
		concept.setCreatedBy(user);
		concept.setUpdatedBy(user);
	}
	
	@After
	public void cleanUp(){
		
	}
	
	@Test
	public void testPersistConcept() throws Exception {
		userRepo.save(user);		
		conceptRepo.save(concept);
	}
	
	@Test
	public void testQueryConcept() throws Exception {
		List<Concept> concepts = conceptRepo.findAllByProperty("shortName", "Gender", Concept.class);
		System.out.println(concepts);
	}
	
	@Test
	public void testQueryUser() throws Exception {
		List<User> concepts = userRepo.findAllByProperty("version", "1", User.class);
		System.out.println(concepts);
	}
	
}
