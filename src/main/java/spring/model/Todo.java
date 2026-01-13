package spring.model;

import jakarta.persistence.*;
import spring.util.Enum;

import java.time.LocalDate;
import java.time.LocalDateTime;
@Entity
@Table(name = "todo")
public class Todo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Enum.TodoStatus status;

    @Enumerated(EnumType.STRING)
    private Enum.Priority priority;

    private LocalDate dueDate;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDate lastNotificationDate;

    private boolean expired;

    public Todo(Long id, Long userId, String title, String description, Enum.TodoStatus status, Enum.Priority priority, LocalDateTime createdAt, LocalDate dueDate, LocalDateTime updatedAt, LocalDate lastNotificationDate, boolean expired) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.createdAt = createdAt;
        this.dueDate = dueDate;
        this.updatedAt = updatedAt;
        this.lastNotificationDate = lastNotificationDate;
        this.expired = expired;
    }

    public Todo() {
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Enum.TodoStatus getStatus() {
        return status;
    }

    public Enum.Priority getPriority() {
        return priority;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setStatus(Enum.TodoStatus status) {
        this.status = status;
    }

    public void setPriority(Enum.Priority priority) {
        this.priority = priority;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDate getLastNotificationDate() {
        return lastNotificationDate;
    }

    public void setLastNotificationDate(LocalDate lastNotificationDate) {
        this.lastNotificationDate = lastNotificationDate;
    }

    public boolean isExpired() {
        return expired;
    }

    public void setExpired(boolean expired) {
        this.expired = expired;
    }

    @Override
    public String toString() {
        return "Todo{" +
                "id=" + id +
                ", userId=" + userId +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", status=" + status +
                ", priority=" + priority +
                ", dueDate=" + dueDate +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", lastNotificationDate=" + lastNotificationDate +
                ", expired=" + expired +
                '}';
    }
}
