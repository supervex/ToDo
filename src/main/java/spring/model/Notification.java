package spring.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "notification")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String message;

    private LocalDate createdAt;

    private boolean unRead;

    public Long getId() {
        return id;
    }

    public String getMessage() {
        return message;
    }

    public Long getUserId() {
        return userId;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isUnRead() {
        return unRead;
    }

    public void setUnRead(boolean unRead) {
        this.unRead = unRead;
    }

    public Notification(Long id, Long userId, String message, boolean unRead) {
        this.id = id;
        this.userId = userId;
        this.message = message;
        this.unRead = unRead;
    }

    public Notification() {
    }

    @Override
    public String toString() {
        return "Notification{" +
                "id=" + id +
                ", userId=" + userId +
                ", message='" + message + '\'' +
                ", unRead=" + unRead +
                '}';
    }
}
