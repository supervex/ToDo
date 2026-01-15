package spring.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "diary")
public class Diary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDate entryDate;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false, length = 2000)
    private String message;

    private Long taskId;

    public Diary() {
    }

    public Diary(Long id, Long userId, LocalDateTime createdAt, LocalDate entryDate, String type, String message, Long taskId) {
        this.id = id;
        this.userId = userId;
        this.createdAt = createdAt;
        this.entryDate = entryDate;
        this.type = type;
        this.message = message;
        this.taskId = taskId;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getType() {
        return type;
    }

    public String getMessage() {
        return message;
    }

    public Long getTaskId() {
        return taskId;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public LocalDate getEntryDate() {
        return entryDate;
    }

    public void setEntryDate(LocalDate entryDate) {
        this.entryDate = entryDate;
    }

    @Override
    public String toString() {
        return "Diary{" +
                "id=" + id +
                ", userId=" + userId +
                ", createdAt=" + createdAt +
                ", entryDate=" + entryDate +
                ", type='" + type + '\'' +
                ", message='" + message + '\'' +
                ", taskId=" + taskId +
                '}';
    }
}
