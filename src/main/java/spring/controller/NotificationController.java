package spring.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import spring.model.Notification;
import spring.service.NotificationService;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/unread/count")
    public ResponseEntity<?> unreadCount(HttpSession session) {
        Long userId = (Long) session.getAttribute("USER_ID");
        int count = notificationService.unreadCount(userId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllNotifications(HttpSession session) {
        Long userId = (Long) session.getAttribute("USER_ID");
        if (userId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        List<Notification> notifications = notificationService.getUnreadNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    @PostMapping("/read")
    public ResponseEntity<?> readNotification(@RequestBody List<Long> notificationIds) {
        boolean success = notificationService.readNotification(notificationIds);
        return ResponseEntity.ok(success);
    }

}
