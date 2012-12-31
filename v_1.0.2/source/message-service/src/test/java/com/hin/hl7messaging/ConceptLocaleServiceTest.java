/**
 *
 */
package com.hin.hl7messaging;

import java.util.ArrayList;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;

import com.hin.core.repo.IBaseRepository;
import com.hin.domain.ConceptLocale;
import com.hin.domain.core.BaseDomain;
import com.hin.service.IConceptLocaleService;
import com.hin.service.impl.ConceptLocaleService;

/**
 * @author thanveer.aqthar
 *
 */

@ContextConfiguration(locations = {
		"classpath:spring/applicationContext-core.xml",
		"classpath:spring/mongodb.xml" })
public class ConceptLocaleServiceTest extends AbstractJUnit4SpringContextTests {

	@Autowired
	IBaseRepository<BaseDomain> baseRepository;

	@Autowired
	IConceptLocaleService conceptLocaleService;

	/*@Before
	public void setUpTest() {

	}

	@Test
	public void testInit() {
		System.out.println(baseRepository);
	}

	*/

	@Test

	public void testConceptLocaleService() {

		ConceptLocale cl = new ConceptLocale();
		cl.setName("thaan");
		cl.setCode("2");
		cl.setId("6");
		cl.setDescription("This is test case6");
		try {
			conceptLocaleService.save(cl);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Test
	public void testFindByName(){
		ConceptLocale cl = new ConceptLocale();
		//cl.setName("preetham");

		List<ConceptLocale> listValue= new ArrayList<ConceptLocale>();
		listValue = conceptLocaleService.findByName(cl);

		for(int i=0;i<listValue.size();i++){
			System.out.println("value is :" + listValue.get(i).getName());
		}

	}

	@Test
	public void testDelete(){
		ConceptLocale cl = new ConceptLocale();

		//concept.setName("Prash");
		cl.setId("6");

		try {
			ConceptLocale con = conceptLocaleService.findById(cl);
			conceptLocaleService.delete(con);


		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}














