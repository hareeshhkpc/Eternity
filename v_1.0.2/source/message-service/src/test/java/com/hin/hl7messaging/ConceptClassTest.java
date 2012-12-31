/**
 * 
 */
package com.hin.hl7messaging;

import static org.junit.Assert.*;

import java.util.ArrayList;
import java.util.List;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;

import com.hin.domain.ConceptClass;
import com.hin.domain.core.BaseDomain;
import com.hin.service.IBaseService;
import com.hin.service.impl.ConceptClassService;

/**
 * @author swetha.murthy
 *
 */
@ContextConfiguration(locations = {
		"classpath:spring/applicationContext-core.xml", 
		"classpath:spring/mongodb.xml"})
public class ConceptClassTest extends  AbstractJUnit4SpringContextTests {
	
	@Autowired
	ConceptClassService conceptClassService;
	
	/*@Autowired
	IBaseService<BaseDomain> baseService;*/

	
	
	@Test
	public void testSave(){
		ConceptClass concept = new ConceptClass();
		concept.setName("Drugs");
		concept.setDescription("Drugs");
		
		try {
			conceptClassService.save(concept);
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
	
	@Test
	public void testDelete(){
		ConceptClass concept = new ConceptClass();
		
		//concept.setName("Prash");
		concept.setId("10");
		
		try {
			ConceptClass con = conceptClassService.findById(concept.getId(),ConceptClass.class);
			conceptClassService.delete(con);
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	
	@Test
	public void findAllByName(){ 
		ConceptClass concept = new ConceptClass();
		
		try {
			List<ConceptClass> listvalue = new ArrayList<ConceptClass>();
			
			concept.setName("swetha");
			
			listvalue = conceptClassService.findAllByName(concept);
			for(int i=0;i<listvalue.size();i++){
			System.out.println("names found @@@@ count:"+i+" : "+ listvalue.get(i).getName());
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
	
	@Test
	public void findById(){
		ConceptClass concept = new ConceptClass();
		
		try {
			//BaseDomain bd = new BaseDomain();
			//bd.setId("10");
			//baseService.findById(bd.getId(),BaseDomain.class);
			concept.setId("10");
			concept = conceptClassService.findById(concept.getId(),ConceptClass.class);
			System.out.println("name is @@"+concept.getName());
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
