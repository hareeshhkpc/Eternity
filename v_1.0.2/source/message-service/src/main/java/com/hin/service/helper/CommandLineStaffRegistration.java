/**
 * 
 */
package com.hin.service.helper;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * @author vineeth.ng
 * 
 */
public class CommandLineStaffRegistration {

	private static String[] CONFIG_LOCATIONS = new String[] {
			"classpath:spring/applicationContext-core.xml",
			"classpath:spring/mongodb.xml" };

	public static void main(String[] args) {

		StaffRegistration staffRegistration = getStaffRegistration();
		System.out.println("Found staffRegistration: " + staffRegistration);

		String filePath = args[0];
		String fileName = args[1];
		staffRegistration.registerStaff(filePath, fileName);
	}

	private static StaffRegistration getStaffRegistration() {
		ApplicationContext mainContext = new ClassPathXmlApplicationContext(
				CONFIG_LOCATIONS);

		StaffRegistration staffRegistration = (StaffRegistration) mainContext
				.getBean("staffRegistration");
		return staffRegistration;
	}

}
