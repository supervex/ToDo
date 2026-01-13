package spring.service;

import org.springframework.stereotype.Service;
import spring.model.Notification;
import spring.model.Todo;
import spring.repository.NotificationRepository;

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

}
