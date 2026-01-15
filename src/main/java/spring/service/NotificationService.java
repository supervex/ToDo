package spring.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import spring.controller.DiaryController;
import spring.model.Notification;
import spring.model.Todo;
import spring.repository.NotificationRepository;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public void createNotification(Todo todo) {

        log.info("start for createNotification payload: {}", todo);
        Notification notification = new Notification();
        notification.setUserId(todo.getUserId());
        notification.setUnRead(true);
        if (todo.isExpired()) {
            notification.setMessage("[AZIONE RICHIESTA] : IL TUO TASK \"" + todo.getTitle() + "\" È SCADUTO");
        } else {
            notification.setMessage("[AZIONE RICHIESTA] : IL TUO TASK \"" + todo.getTitle() + "\" È IN SCADENZA IL " + todo.getDueDate());
        }
        log.info("end for createNotification payload: {}", notification);
        notificationRepository.save(notification);
    }

    public int unreadCount(Long userId) {
        if (userId == null) {
            return 0;
        }
        int count = notificationRepository.countByUserIdAndUnReadTrue(userId);
        log.info("end for unreadCount payload: {}", count);
        return count;
    }

    public List<Notification> getUnreadNotifications(Long userId) {
        if (userId == null) return Collections.emptyList();
        List<Notification> notifications = notificationRepository.findByUserIdAndUnReadTrueOrderByCreatedAtDesc(userId);
        log.info("end for getUnreadNotifications payload: {}", notifications);
        return  notifications;
    }

    public boolean readNotification(List<Long> notificationIds) {
        for(Long notificationId : notificationIds) {
            Optional<Notification> opt = notificationRepository.findById(notificationId);
            if (opt.isEmpty()) return false;
            Notification n = opt.get();
            n.setUnRead(false);
            notificationRepository.save(n);
        }
        log.info("end for readNotification payload: {}", notificationIds);
        return true;
    }
}
