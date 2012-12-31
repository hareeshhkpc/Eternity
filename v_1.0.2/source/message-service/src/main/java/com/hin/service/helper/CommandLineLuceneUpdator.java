/**
 * 
 */
package com.hin.service.helper;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * @author krishna.lr
 * 
 */
public class CommandLineLuceneUpdator {

	private static String[] CONFIG_LOCATIONS = new String[] {
			"classpath:spring/applicationContext-core.xml",
			"classpath:spring/mongodb.xml" };

	public static void main(String[] args) {

		LuceneUpdator luceneUpdator = getLuceneUpdator();
		System.out.println("Found updator: " + luceneUpdator);

		String messageId = args[0];
		String attrName = args[1];
		String attrValue = args[2];
		String orgValue = args[3];
		luceneUpdator.updateLuceneForMessage(messageId, attrName, attrValue,orgValue);
	}

	private static LuceneUpdator getLuceneUpdator() {
		ApplicationContext mainContext = new ClassPathXmlApplicationContext(
				CONFIG_LOCATIONS);

		LuceneUpdator luceneUpdator = (LuceneUpdator) mainContext
				.getBean("luceneUpdator");
		return luceneUpdator;
	}

}
