package com.hin.service.impl.integrationtest;

import java.util.Date;
import java.util.List;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;

import com.hin.domain.ConceptSynonym;
import com.hin.domain.User;
import com.hin.service.IConceptSynonymService;


/**
 * 
 * @author madhu.murmu
 *
 */

@ContextConfiguration(locations = {
		"classpath:spring/applicationContext-core-test.xml", 
		"classpath:spring/mongodb-test.xml"})
public class ConceptSynonymServiceTest extends AbstractJUnit4SpringContextTests{
	
	@Autowired
	IConceptSynonymService conceptSynonymService; 
	
	@Test
	public void testConceptSynonymService(){
		ConceptSynonym conceptSynonym = new ConceptSynonym();
		try {
			// conceptSynonymService.delete(new ConceptSynonym());
			User u = new User();
			u.setName("Madhu");
			u.setVersion(1);
			u.setCreatedDate(new Date());
			
			
			conceptSynonym.setName("Male");
			conceptSynonym.setCreatedDate(new Date());
			conceptSynonym.setVersion(1);
			conceptSynonym.setCreatedBy(u);
			ConceptSynonym conceps = conceptSynonymService.save(conceptSynonym);
			System.out.println("Test Result: "+conceps.getName()); 
			
			conceptSynonym = new ConceptSynonym();
			conceptSynonym.setName("Male");
			List<ConceptSynonym> list = conceptSynonymService.findByNameSynonym(conceptSynonym, "name");
			for(ConceptSynonym synonym:list){
				System.out.println("List of Gender : "+synonym);
			}
			
		} catch (Exception e) {
			System.out.println("Exception : "+e.getCause()); 
		}
		
	}
	
	@Test
	public void testFindByName(){
		
		ConceptSynonym conceptSynonym = new ConceptSynonym();
		try {
			conceptSynonym.setName("Male");
			ConceptSynonym synonym = conceptSynonymService.findByName(conceptSynonym);
			System.out.println(synonym);
			conceptSynonymService.delete(synonym);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}

}
