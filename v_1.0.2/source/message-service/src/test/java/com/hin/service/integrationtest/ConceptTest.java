/**
 *
 */
package com.hin.service.integrationtest;

import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;

import com.hin.domain.Concept;
import com.hin.domain.ConceptClass;
import com.hin.service.IBaseService;
import com.hin.service.IConceptClassService;
import com.hin.service.IConceptService;

/**
 * @author thanveer.aqthar
 *
 */

@ContextConfiguration(locations = {
		"classpath:spring/applicationContext-core-test.xml",
		"classpath:spring/mongodb-test.xml" })
public class ConceptTest extends AbstractJUnit4SpringContextTests {

	@Autowired
	IBaseService<Concept> baseService;

	@Autowired
	IConceptService conceptService;

	@Autowired
	IConceptClassService conceptClassService;

	@Before
	public void setUpTest() {

	}

	@Test
	public void testInit() {
		System.out.println(baseService);
	}

	@Test
	public void testConceptServiceSave() {
		Concept c = new Concept();

		c.setName("Chest XRay");
		c.setShortName("C XRay");
		c.setDescription("Chest XRay");

		ConceptClass conceptClass = conceptClassService.findByProperty("name",
				"Service", ConceptClass.class);

		c.addConceptClass(conceptClass);
		conceptClass = conceptClassService.findByProperty("name",
				"Drugs", ConceptClass.class);
		c.addConceptClass(conceptClass);

/*
		c.setName("CT Scan");
		c.setShortName("CT Scan");
		c.setDescription("CT Scan");
		c.setConceptDataType(ConceptDataType.NUMERICRANGE);
		c.setDataType(c.getConceptDataType().getType());
		c.getDataType().handler();
*/
		try {
			conceptService.save(c);
		} catch (Exception e) {
			e.printStackTrace();
		}

		/*c.setName("Concept1");
		c.setId("2");
		c.setShortName("Con2");
		c.setDescription("This is HL7");
		try {
			conceptService.save(c);
		} catch (Exception e) {
			e.printStackTrace();
		}
		c.setName("Concept1");
		c.setId("3");
		c.setShortName("Con3");
		c.setDescription("This is HL7");
		try {
			conceptService.save(c);
		} catch (Exception e) {
			e.printStackTrace();
		}
		c.setName("Concept1");
		c.setId("4");
		c.setShortName("Con4");
		c.setDescription("This is HL7");
		try {
			conceptService.save(c);
		} catch (Exception e) {
			e.printStackTrace();
		}*/

	}

	/*
	 * @Test public void testConceptServiceRetriveByName(){ Concept c = new
	 * Concept(); List<Concept> listvalue = new ArrayList<Concept>();
	 * c.setName("Concept1");
	 *
	 * try { listvalue = conceptService.findByConceptName(c); } catch (Exception
	 * e) { // TODO Auto-generated catch block e.printStackTrace(); } for
	 * (Concept con : listvalue) { System.out.println("names found @@@@ " +
	 * con.getName()); } }
	 *
	 * @Test public void testConceptServiceDelete(){ Concept c = new Concept();
	 * c.setName("swetha"); c.setId("10"); c.setShortName("Con10");
	 * c.setDescription("This is swetha");
	 *
	 * try { conceptService.deleteConcept(c); } catch (Exception e) { // TODO
	 * Auto-generated catch block e.printStackTrace(); } }
	 *
	 * @Test public void testConceptType(){ ConceptDataType[] types =
	 * ConceptDataType.values(); List<String> conceptTypes = new
	 * ArrayList<String>(); for(ConceptDataType type : types){
	 * conceptTypes.add(type.getValue()); } }
	 */
}
