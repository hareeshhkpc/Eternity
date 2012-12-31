/**
 * 
 */
package com.hin.hl7messaging.web;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.hin.domain.config.NotificationStatus;
import com.hin.domain.config.NotificationType;
import com.hin.domain.vo.Notification;
import com.hin.hl7messaging.api.INotificationService;
import com.hin.service.factory.NotificationFactory;

/**
 * @author krishna.lr
 * 
 */
@Controller
public class NotificationController implements ApplicationContextAware {
	@Autowired
	INotificationService notificationService;

	private Logger logger = Logger.getLogger(NotificationController.class
			.getName());
	private ApplicationContext applicationContext;

	@RequestMapping(value = "/notification/getAllNotifications", method = RequestMethod.GET)
	public @ResponseBody
	String getAllNotifications(@RequestParam String subscriberId,
			@RequestParam String notificationStatusJson,
			@RequestParam String notificationTypeJson,@RequestParam String organizationId) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		NotificationStatus notificationStatus = NotificationStatus
				.valueOf(notificationStatusJson);
		NotificationType notificationType = NotificationType
				.valueOf("notificationTypeJson");
		List<Notification> notificationVOs = notificationService
				.getAllNotifications(subscriberId, notificationStatus,
						notificationType,organizationId);
		if (notificationVOs != null) {
			data = gson.toJson(notificationVOs);
		}
		return data;
	}

	@RequestMapping(value = "/notification/setNotificationStatus", method = RequestMethod.GET)
	public @ResponseBody
	void setNotificationStatus(@RequestParam String notificationJson,
			@RequestParam String notificationStatusJson,
			@RequestParam String notificationTypeJson) {
		Gson gson = new GsonBuilder().create();
		NotificationType notificationType = NotificationType
				.valueOf(notificationTypeJson);
		Notification notification = (Notification) gson.fromJson(
				notificationJson,
				NotificationFactory.getNotificationClass(notificationType));
		NotificationStatus notificationStatus = NotificationStatus
				.valueOf(notificationStatusJson);
		notificationService.setNotificationStatus(notification,
				notificationStatus);
	}

	@Override
	public void setApplicationContext(ApplicationContext applicationContext)
			throws BeansException {
		this.applicationContext = applicationContext;
	}

}
