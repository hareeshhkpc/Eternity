/**
 * 
 */
package com.hin.service.integrationtest;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;

import com.hin.domain.User;
import com.hin.service.IUserService;

/**
 * @author sreekumar.s
 * 
 */

@ContextConfiguration(locations = {
		"classpath:spring/applicationContext-core-test.xml",
		"classpath:spring/mongodb-test.xml" })
public class UserServiceTest extends AbstractJUnit4SpringContextTests {

	@Autowired
	private IUserService iUserService;

	@Test
	public void testCreateUser() throws Exception {

		User user = new User();
		user.setName("Arjun");
		user.setAge(25);

		iUserService.save(user);
		System.out.println(user.getId());

	}

}
