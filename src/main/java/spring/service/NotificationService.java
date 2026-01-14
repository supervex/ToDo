package spring.service;

import org.springframework.stereotype.Service;
import spring.model.Notification;
import spring.model.Todo;
import spring.repository.NotificationRepository;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public void createNotification(Todo todo) {

        Notification notification = new Notification();
        notification.setUserId(todo.getUserId());
        notification.setUnRead(true);
        if (todo.isExpired()) {
            notification.setMessage("[AZIONE RICHIESTA] : IL TUO TASK \"" + todo.getTitle() + "\" È SCADUTO");
        } else {
            notification.setMessage("[AZIONE RICHIESTA] : IL TUO TASK \"" + todo.getTitle() + "\" È IN SCADENZA IL " + todo.getDueDate());
        }
        notificationRepository.save(notification);
    }

    public int unreadCount(Long userId) {
        if (userId == null) {
            return 0;
        }
        return notificationRepository.countByUserIdAndUnReadTrue(userId);
    }

    public List<Notification> getUnreadNotifications(Long userId) {
        if (userId == null) return Collections.emptyList();
        return notificationRepository.findByUserIdAndUnReadTrueOrderByCreatedAtDesc(userId);
    }

    public boolean readNotification(List<Long> notificationIds) {
        for(Long notificationId : notificationIds) {
            Optional<Notification> opt = notificationRepository.findById(notificationId);
            if (opt.isEmpty()) return false;
            Notification n = opt.get();
            n.setUnRead(false);
            notificationRepository.save(n);
        }
        return true;
    }
}
