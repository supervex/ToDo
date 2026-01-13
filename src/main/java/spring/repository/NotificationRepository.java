package spring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import spring.model.Notification;
import spring.model.Todo;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

}
