package com.hin.service.integrationtest;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.xml.xpath.XPathConstants;

import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;
import org.w3c.dom.Document;

import com.hin.domain.Concept;
import com.hin.domain.ConceptAttribute;
import com.hin.domain.ConceptClass;
import com.hin.hl7messaging.utils.XMLHelper;
import com.hin.service.IBaseService;
import com.hin.service.IConceptClassService;
import com.hin.service.IConceptService;

@ContextConfiguration(locations = {
		"classpath:spring/applicationContext-core-test.xml",
		"classpath:spring/mongodb-test.xml" })
public class TestHapi extends AbstractJUnit4SpringContextTests{
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
	public void testV2Message() {
		BufferedReader reader = null;
		ConceptClass conceptClass = new ConceptClass();
		ConceptClass conceptClass1 = new ConceptClass();
		Concept concept = new Concept();
		Concept concept1 = new Concept();
		
		try {
			reader = new BufferedReader( new FileReader ("E:\\EMI\\source\\hin-web\\src\\main\\webapp\\html\\TestHapi\\V2Message.xml"));
		} catch (FileNotFoundException e1) {
			e1.printStackTrace();
		}
	    String         line = null;
	    StringBuilder  stringBuilder = new StringBuilder();
	    String         ls = System.getProperty("line.separator");

	    try {
			while( ( line = reader.readLine() ) != null ) {
			    stringBuilder.append( line );
			    stringBuilder.append( ls );
			}
		} catch (IOException e1) {
			e1.printStackTrace();
		}

	    String ackMessageString = stringBuilder.toString();
	    
	    Document document = XMLHelper.getXMLDocument(ackMessageString);
	    for(int i = 1 ; i <= 19 ; i++){
	    	concept1 = new Concept();
	    	conceptClass1 = new ConceptClass();
	    	
			String testName = (String) XMLHelper
					.read(document,
							"ORU_R01/ORU_R01.RESPONSE/ORU_R01.ORDER_OBSERVATION["+i+"]/OBR/OBR.4/CE.2", XPathConstants.STRING);
			String testCodeName = (String) XMLHelper
					.read(document,
							"ORU_R01/ORU_R01.RESPONSE/ORU_R01.ORDER_OBSERVATION["+i+"]/OBR/OBR.4/CE.1", XPathConstants.STRING);
			testCodeName = "BloodTest_" + testCodeName;
	        System.out.println(testCodeName + " : " + testName);
	        
	        conceptClass1.setName(testCodeName);
	        conceptClass1.setDescription(testName);
	        try {
	        	conceptClassService.save(conceptClass1);
			} catch (Exception e) {
				e.printStackTrace();
			}
	        
	        concept1.setName(testCodeName);
	        concept1.setShortName(testName);
	        concept1.setDescription(testName);
	        conceptClass1 = conceptClassService.findByProperty("name",
	        		"Blood Tests", ConceptClass.class);
	        concept1.addConceptClass(conceptClass1);
	        try {
	        	//conceptService.save(concept1);
	        	conceptService.update(concept1);
			} catch (Exception e) {
				e.printStackTrace();
			}
	        
			for (int j = 1; j <= 22; j++) {
				concept = new Concept();
		    	conceptClass = new ConceptClass();
		    	ConceptAttribute conceptAttribute = new ConceptAttribute();
		    	ConceptAttribute conceptAttribute1 = new ConceptAttribute();
		    	List<ConceptAttribute> conceptListAttributes = new ArrayList<ConceptAttribute>();
				
		        String observationCodeName = (String) XMLHelper
						.read(document,
								"ORU_R01/ORU_R01.RESPONSE/ORU_R01.ORDER_OBSERVATION["+i+"]/ORU_R01.OBSERVATION["+j+"]/OBX/OBX.3/CE.1", XPathConstants.STRING);
		        String observationName = (String) XMLHelper
						.read(document,
								"ORU_R01/ORU_R01.RESPONSE/ORU_R01.ORDER_OBSERVATION["+i+"]/ORU_R01.OBSERVATION["+j+"]/OBX/OBX.3/CE.2", XPathConstants.STRING);
		       
		        String unit = (String) XMLHelper
						.read(document,
								"ORU_R01/ORU_R01.RESPONSE/ORU_R01.ORDER_OBSERVATION["+i+"]/ORU_R01.OBSERVATION["+j+"]/OBX/OBX.6/CE.1", XPathConstants.STRING);
		        String refRange = (String) XMLHelper
						.read(document,
								"ORU_R01/ORU_R01.RESPONSE/ORU_R01.ORDER_OBSERVATION["+i+"]/ORU_R01.OBSERVATION["+j+"]/OBX/OBX.7", XPathConstants.STRING);
		        
		        if(observationName.equals(""))
		        	break;
		        
		        
		        conceptAttribute.setKey("unit");
		        conceptAttribute.setValue(unit);
		        conceptListAttributes.add(conceptAttribute);
		        
		        conceptAttribute1.setKey("referenceRange");
		        conceptAttribute1.setValue(refRange);
		        conceptListAttributes.add(conceptAttribute1);
		        
		        observationCodeName = "BloodTest_" + observationCodeName;
		        System.out.println(observationCodeName + " : " + observationName);
		        //concept= baseService.findByName(observationCodeName, Concept.class);
		        concept.setConceptAttributes(conceptListAttributes);
		        
		        /*try {
					conceptService.update(concept2);
				} catch (Exception e) {
					e.printStackTrace();
				}*/
		        
		        concept.setName(observationCodeName);
		        concept.setShortName(observationName);
		        concept.setDescription(observationName);
		        concept.setConceptAttributes(conceptListAttributes);
		        conceptClass = conceptClassService.findByProperty("name",
		        		testCodeName, ConceptClass.class);
		        concept.addConceptClass(conceptClass);
			
		        try {
					//conceptService.save(concept);
		        	conceptService.update(concept);
				} catch (Exception e) {
					e.printStackTrace();
				}
	    	}
			
			
        }
	    System.out.println("Finished");
	}
}
