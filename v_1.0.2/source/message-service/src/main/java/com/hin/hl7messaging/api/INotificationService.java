/**
 * 
 */
package com.hin.hl7messaging.api;

import java.util.List;

import com.hin.domain.config.NotificationStatus;
import com.hin.domain.config.NotificationType;
import com.hin.domain.vo.MessageVO;
import com.hin.domain.vo.Notification;

/**
 * @author krishna.lr
 * 
 */
public interface INotificationService {
	public List<Notification> getAllNotifications(String subscriberId,
			NotificationStatus notificationStatus,
			NotificationType notificationType, String organizationId);

	public void setNotificationStatus(Notification notification,
			NotificationStatus notificationStatus);

	public void createNotification(MessageVO messageVO);

	public void deleteNotification(Notification notification);

	public void deleteAllNotifications(String subscriberId,
			NotificationStatus notificationStatus,
			NotificationType notificationType, String organizationId);
}
