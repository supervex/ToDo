package spring.dto.todo;

import spring.util.Enum;

import java.time.LocalDate;

public class TodoUpdateRequest {

    private Long id;
    private String title;
    private String description;
    private Enum.TodoStatus status;
    private LocalDate dueDate;
    private Enum.Priority priority;

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

    public LocalDate getDueDate() {
        return dueDate;
    }

    public Enum.Priority getPriority() {
        return priority;
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

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public void setPriority(Enum.Priority priority) {
        this.priority = priority;
    }

    @Override
    public String toString() {
        return "TodoUpdateRequest{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", status=" + status +
                ", dueDate=" + dueDate +
                ", priority=" + priority +
                '}';
    }
}
