/**
 * 
 */
package com.hin.service.unittest;

import java.io.File;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import com.hin.domain.Concept;
import com.hin.domain.ConceptClass;
import com.hin.hl7messaging.utils.XMLHelper;
import com.hin.service.IConceptClassService;
import com.hin.service.IConceptService;
import com.thoughtworks.xstream.XStream;

/**
 * @author Administrator
 *
 */

@ContextConfiguration(locations = {
		"classpath:spring/applicationContext-core-test.xml" })
public class ConceptSerializationTest extends AbstractJUnit4SpringContextTests {

	@Autowired
	IConceptService conceptService;

	@Autowired
	IConceptClassService conceptClassService;

	private XStream streamSerializer;
	
	@Before
	public void initTest(){
		streamSerializer = new XStream();
		streamSerializer.processAnnotations(Concept.class);
	}
	
	@Test
	public void testConcept2Xml() throws Exception{
		File output = new File("src/main/resources/ConceptDump.xml");
		
		Document document = XMLHelper.getXMLDocument("<?xml version=\"1.0\"?><ConceptLookups></ConceptLookups>");
		Element e = document.getDocumentElement();
		
		List<ConceptClass> classes = conceptClassService.findAll(ConceptClass.class);
		//System.out.println(classes);
		
		for(ConceptClass cc : classes){
			Element classElem = document.createElement("CC");
			classElem.setAttribute("n", cc.getName());
			classElem.setAttribute("d", cc.getDescription());
			e.appendChild(classElem);
			
			List<Concept> concepts = conceptService.findAllByProperty("conceptClasses.name", cc.getName(), Concept.class);
			//System.out.println("Count: " + concepts.size());
			
			for(Concept c : concepts){
				Element conceptElem = document.createElement("C");
				conceptElem.setAttribute("n", c.getName());
				conceptElem.setAttribute("d", c.getDescription());
				classElem.appendChild(conceptElem);
			}			
		}
		//System.out.println("DOC: ");
		//System.out.println(XMLHelper.getXMLDocumentAsString(document));
		
		XMLHelper.writeXMLDocumentToFile(document, output);
	}
	
}
