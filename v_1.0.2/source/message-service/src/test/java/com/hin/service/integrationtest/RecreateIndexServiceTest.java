/**
 * 
 */
package com.hin.service.integrationtest;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;

import com.hin.service.helper.LuceneUpdator;

/**
 * @author krishna.lr
 *
 */
@ContextConfiguration(locations = {
		"classpath:spring/applicationContext-core-test.xml",
		"classpath:spring/mongodb-test.xml" })
public class RecreateIndexServiceTest extends AbstractJUnit4SpringContextTests{

	@Autowired
	private LuceneUpdator data;

	@Test
	public void testRecreateIndex() {
		String messageId = "669eeb90-9250-411f-90e5-f9ca9a6e78f2";
		String attrName = "Role";
		String attrValue = "doctor";
		data.updateLuceneForMessage(messageId, attrName, attrValue);
	}

}
