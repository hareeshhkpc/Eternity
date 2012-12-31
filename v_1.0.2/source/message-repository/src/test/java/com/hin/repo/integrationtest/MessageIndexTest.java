/**
 * 
 */
package com.hin.repo.integrationtest;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;

import com.hin.core.repo.indexing.IMessageIndexRepository;
import com.hin.domain.index.Registration;

/**
 * @author Administrator
 *
 */
@ContextConfiguration(locations = {
		"classpath:spring/applicationContext-core-test.xml",
		"classpath:spring/mongodb-test.xml",
		"classpath:spring/persistenceMySQL.xml"})
public class MessageIndexTest extends AbstractJUnit4SpringContextTests {

	@Autowired
	private IMessageIndexRepository repository;
	
	@Test
	public void testIndexCreate() throws Exception{
		Registration index = new Registration();
				
		index.setDay(2);
		index.setMonth(5);
		index.setYear(2011);
		index.setCount(123);
		index.setStatus("New");
		String msgIds = "MSG-102,MSG-343,MSG-564";
		index.setMessageIds(msgIds.toCharArray());
		
		repository.updateIndex(index);
	}
	
	@Test
	public void testCountOfIndex() throws Exception{
		int count = repository.queryIndex(Registration.class).size();
		System.out.println("Number of records: " + count);
	}
	
}
