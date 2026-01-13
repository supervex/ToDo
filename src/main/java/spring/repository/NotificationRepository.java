package spring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import spring.model.Notification;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    int countByUserIdAndUnReadTrue(long userId);

    List<Notification> findByUserIdAndUnReadTrueOrderByCreatedAtDesc(Long userId);

    List<Notification> findByUserIdAndUnReadTrue(Long userId);

}
