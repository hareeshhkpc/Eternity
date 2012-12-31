/**
 * 
 */
package com.hin.service.factory;

import org.springframework.context.ApplicationContext;

import com.hin.domain.config.NotificationType;
import com.hin.domain.vo.AppointmentNotification;
import com.hin.domain.vo.GenericNotification;
import com.hin.domain.vo.Notification;
import com.hin.domain.vo.ParticipantNotification;

/**
 * @author krishna.lr
 * 
 */
public class NotificationFactory {
	public static Notification getNotificationInstant(
			NotificationType notificationType) {
		Notification notification = null;
		if (notificationType == NotificationType.APPOINTMENT_NOTIFICATION) {
			notification = new AppointmentNotification();
		} else if (notificationType == NotificationType.PARTICIPATION_NOTIFICATION) {
			notification = new ParticipantNotification();
		} else if (notificationType == NotificationType.GENERIC_NOTIFICATION) {
			notification = new GenericNotification();
		}
		return notification;
	}

	@SuppressWarnings("unchecked")
	public static <T> Class<T> getNotificationClass(
			NotificationType notificationType) {
		if (notificationType == NotificationType.APPOINTMENT_NOTIFICATION) {
			return (Class<T>) AppointmentNotification.class;
		} else if (notificationType == NotificationType.PARTICIPATION_NOTIFICATION) {
			return (Class<T>) ParticipantNotification.class;
		} else {
			return (Class<T>) ParticipantNotification.class;
		}

	}
}
