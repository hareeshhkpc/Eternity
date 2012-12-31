/**
 * 
 */
package com.hin.service.unittest;

import java.io.File;
import java.util.List;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;
import org.w3c.dom.Document;

import com.hin.domain.vo.ProfileVO;
import com.hin.hl7messaging.NotificationUtils;
import com.hin.hl7messaging.api.INotificationService;
import com.hin.hl7messaging.utils.XMLHelper;

/**
 * @author krishna.lr
 * 
 */
@ContextConfiguration(locations = {
		"classpath:spring/applicationContext-core-test.xml",
		"classpath:spring/mongodb-test.xml" })
public class NotificationUtilsTest extends AbstractJUnit4SpringContextTests {
	@Autowired
	INotificationService notificationService;

	@Value("${messageConfig.dirPath}")
	private String messageConfigurationPath;

	@Test
	public void testReadAllParticipants() {
		File file = new File("e:\\Demo.xml");
		Document document = XMLHelper.getXMLDocument(file);
		Document configureDocument = getConfigureDocument(document);
		List<ProfileVO> profileVOs = NotificationUtils.readAllParticipants(
				configureDocument, document);
		System.out.println("Profiles" + profileVOs.toString());
	}

	private Document getConfigureDocument(Document document) {
		String documentType = document.getDocumentElement().getAttribute(
				"config");

		if (messageConfigurationPath == null) {
			messageConfigurationPath = "E://message-configuration";
		}
		File configureFile = new File(messageConfigurationPath + File.separator
				+ documentType + ".xml");
		return XMLHelper.getXMLDocument(configureFile);
	}

}
