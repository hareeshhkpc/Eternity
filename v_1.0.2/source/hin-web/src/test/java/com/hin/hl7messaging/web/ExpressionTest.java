/**
 * 
 */
package com.hin.hl7messaging.web;

import org.apache.commons.jexl2.JexlContext;
import org.apache.commons.jexl2.JexlEngine;
import org.apache.commons.jexl2.ObjectContext;
import org.junit.Test;

import com.hin.domain.config.HL7MessageConfiguration;

/**
 * @author Administrator
 *
 */
public class ExpressionTest {
	
	private static final JexlEngine jexl = new JexlEngine();

	@Test
	public void testExpression(){
		System.out.println(jexl.createExpression("size('Hello')").evaluate(null));
		
		HL7MessageConfiguration conf = new HL7MessageConfiguration();
		jexl.setProperty(conf, "metaInfo.artifactID ", "ABCD");
		//jexl.setProperty(conf, "configClass.fields[0].tagName ", "Admitter");
		
		JexlContext confContext = new ObjectContext<HL7MessageConfiguration>(jexl, conf);
		confContext.set("configClass.tagName", "Admitter");

		System.out.println("Fields: " + jexl.createExpression("size(configClass.fields)").evaluate(confContext));
		
		System.out.println(conf);		
	}
	
}
