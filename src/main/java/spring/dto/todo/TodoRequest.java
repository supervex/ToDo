package spring.dto.todo;


import spring.util.Enum;

import java.time.LocalDate;

public class TodoRequest {
    private Long userId;
    private String title;
    private String description;
    private Enum.TodoStatus status;
    private Enum.Priority priority;
    private LocalDate dueDate;

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}

