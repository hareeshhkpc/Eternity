/**
 * 
 */
package com.hin.hl7messaging;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.hin.domain.config.NotificationStatus;
import com.hin.domain.config.NotificationType;
import com.hin.domain.vo.MessageVO;
import com.hin.domain.vo.Notification;
import com.hin.hl7messaging.api.INotificationService;
import com.hin.hl7messaging.cassandra.CassandraConnector;
import com.hin.service.factory.NotificationFactory;

/**
 * @author krishna.lr
 * 
 */
@Service(value = "notificationService")
public class NotificationService implements INotificationService {
	@Autowired
	private CassandraConnector cassandraConnector;

	@Override
	public List<Notification> getAllNotifications(String subscriberId,
			NotificationStatus notificationStatus,
			NotificationType notificationType, String organizationId) {
		Gson gson = new GsonBuilder().create();
		String columnFamily = "NOTIFICATION_STORE";
		String ROWKEY = subscriberId + "_" + notificationStatus + "_"
				+ notificationType;
		List<Notification> notifications = new ArrayList<Notification>();
		Map<String, HashMap<String, String>> maps = cassandraConnector
				.retrieveStandardColumnFamily(columnFamily, ROWKEY,
						organizationId);
		if (maps != null && maps.size() > 0) {
			for (Map.Entry<String, HashMap<String, String>> entry : maps
					.entrySet()) {
				Notification notification = null;
				String notificationJson = null;
				for (Map.Entry<String, String> stateEntry : entry.getValue()
						.entrySet()) {
					if (stateEntry.getKey().equals("KEY")) {
						continue;
					} else {
						notificationJson = stateEntry.getValue();
					}
				}
				notification = (Notification) gson.fromJson(notificationJson,
						NotificationFactory
								.getNotificationClass(notificationType));
				notifications.add(notification);
			}
		}
		return notifications;
	}

	@Override
	public void setNotificationStatus(Notification notification,
			NotificationStatus notificationStatus) {
		String columnFamilyName = "NOTIFICATION_STORE";
		cassandraConnector.deleteColumn(columnFamilyName,
				notification.getRowKey(), notification.getTimeStamp(),
				notification.getOrganizationId());
		notification.setNotificationStatus(notificationStatus);
		notification.setRowKey(createRowkey(notification.getRowKey(),
				notificationStatus,
				NotificationType.valueOf(notification.getType())));
		saveNotification(notification);
	}

	@Override
	public void createNotification(MessageVO messageVO) {
		List<String> participants = messageVO.getParticipants();
		for (String participantId : participants) {
			Notification notification = fillNotification(messageVO,
					participantId);
			saveNotification(notification);
		}
	}

	@Override
	public void deleteNotification(Notification notification) {
		String columnFamilyName = "NOTIFICATION_STORE";
		cassandraConnector.deleteColumn(columnFamilyName,
				notification.getRowKey(), notification.getTimeStamp(),
				notification.getOrganizationId());

	}

	@Override
	public void deleteAllNotifications(String subscriberId,
			NotificationStatus notificationStatus,
			NotificationType notificationType, String organizationId) {
		String columnFamilyName = "NOTIFICATION_STORE";
		String rowKey = createRowkey(subscriberId, notificationStatus,
				notificationType);
		cassandraConnector.deleteRow(columnFamilyName, rowKey, organizationId);
	}

	private void saveNotification(Notification notification) {
		String columnFamily = "NOTIFICATION_STORE";
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("ROWKEY", notification.getRowKey());
		map.put(notification.getTimeStamp(), notificationToJson(notification));
		cassandraConnector.saveStandardColumnFamily(map, columnFamily,
				notification.getOrganizationId());
	}

	private String notificationToJson(Notification notification) {
		Gson gson = new GsonBuilder().create();
		String notificationJson = gson.toJson(notification);
		return notificationJson;
	}

	private NotificationType getNotificationType(String messageType) {
		NotificationType notificationType = null;
		if (messageType.equals("PRPA_MT201000HT03")) {
			notificationType = NotificationType
					.valueOf("PARTICIPATION_NOTIFICATION");
		}
		return notificationType;
	}

	private Notification fillNotification(MessageVO messageVO,
			String participantId) {
		NotificationType notificationType = getNotificationType(messageVO
				.getType());
		Notification notification = NotificationFactory
				.getNotificationInstant(notificationType);
		notification.setType(notificationType.name());
		notification
				.setNotificationStatus(NotificationStatus.valueOf("UNREAD"));
		notification.setSender(messageVO.getUserid());
		notification.setOrganizationId(messageVO.getOrganizationId());
		String rowKey = createRowkey(participantId,
				notification.getNotificationStatus(), notificationType);
		String timeStamp = String.valueOf(System.currentTimeMillis());
		notification.setTimeStamp(timeStamp);
		notification.setReceiver(participantId);
		notification.setRowKey(rowKey);
		return notification;
	}

	private String createRowkey(String subscriberId,
			NotificationStatus notificationStatus,
			NotificationType notificationType) {
		String rowKey = subscriberId + "_" + notificationStatus + "_"
				+ notificationType;
		return rowKey;
	}

}
