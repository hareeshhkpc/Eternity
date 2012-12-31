package com.hin.hl7messaging;

import static org.junit.Assert.*;

import java.util.ArrayList;
import java.util.List;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;

import com.hin.domain.ConceptSource;
import com.hin.service.IConceptSourceService;

@ContextConfiguration(locations = {
		"classpath:spring/applicationContext-core.xml",
		"classpath:spring/mongodb.xml" })
public class ConceptSourceTest extends AbstractJUnit4SpringContextTests {

	ConceptSource source = new ConceptSource();
	@Autowired
	IConceptSourceService service;
	
	@Test
	public void testSave() {
		source.setName("CT Scan");
		source.setDescription("Successfully Done");
		try {
			service.save(source);
			System.out.println(source.getId());
			System.out.println("Name: "+source.getName());
		} catch (Exception e) {
			System.out.println(e);
		}

	}
	
	@Test
	public void testFindByConceptSourceName() {
		List<ConceptSource> sourceList = new ArrayList<ConceptSource>();
		try {
			source.setName("CT Scan");
			sourceList = service.findByConceptSourceName(source);
			for(ConceptSource cs:sourceList){
				System.out.println("hhiii: "+cs.getName());
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
