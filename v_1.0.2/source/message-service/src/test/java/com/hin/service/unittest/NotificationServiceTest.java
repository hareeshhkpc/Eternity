/**
 * 
 */
package com.hin.service.unittest;

import java.io.File;
import java.util.List;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;
import org.w3c.dom.Document;

import com.hin.domain.config.NotificationStatus;
import com.hin.domain.config.NotificationType;
import com.hin.domain.vo.MessageVO;
import com.hin.domain.vo.Notification;
import com.hin.hl7messaging.api.IMessageService;
import com.hin.hl7messaging.api.INotificationService;
import com.hin.hl7messaging.utils.XMLHelper;
import com.hin.service.factory.NotificationFactory;

/**
 * @author krishna.lr
 * 
 */
@ContextConfiguration(locations = {
		"classpath:spring/applicationContext-core-test.xml",
		"classpath:spring/mongodb-test.xml" })
public class NotificationServiceTest extends AbstractJUnit4SpringContextTests {
	@Autowired
	INotificationService notificationService;

	@Autowired
	IMessageService messageService;

	@Test
	public void testCreateNotification() {
		try {
			File file = new File("e:\\Demo.xml");
			Document document = XMLHelper.getXMLDocument(file);
			String messageXml = XMLHelper.getXMLDocumentAsString(document);
			MessageVO messageVO = messageService.createMessageVO(messageXml);
			notificationService.createNotification(messageVO);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Test
	public void testGetAllNotifications() {
		List<Notification> notifications = notificationService
				.getAllNotifications("44445666666",
						NotificationStatus.valueOf("UNREAD"),
						NotificationType.valueOf("PARTICIPATION_NOTIFICATION"),
						"HINORG");
		System.out.println(notifications);
	}

	@Test
	public void testRemoveNotification() {
		NotificationType notificationType = NotificationType
				.valueOf("APPOINTMENT_NOTIFICATION");
		Notification notification = NotificationFactory
				.getNotificationInstant(notificationType);
		notification.setRowKey("44445666666_UNREAD_PARTICIPATION_NOTIFICATION");
		notification.setOrganizationId("HINORG");
		notification.setTimeStamp("1354616719619");
		notificationService.deleteNotification(notification);
	}

	@Test
	public void testRomoveAllnotification() {
		NotificationType notificationType = NotificationType
				.valueOf("PARTICIPATION_NOTIFICATION");
		NotificationStatus notificationStatus = NotificationStatus
				.valueOf("UNREAD");
		notificationService.deleteAllNotifications("44445666666",
				notificationStatus, notificationType, "HINORG");
	}
}
