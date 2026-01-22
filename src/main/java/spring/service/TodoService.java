package spring.service;

import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import spring.dto.todo.TodoResponse;
import spring.dto.todo.TodoUpdateRequest;
import spring.model.Todo;
import spring.repository.TodoRepository;
import spring.util.Enum;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class TodoService {

    private static final Logger log = LoggerFactory.getLogger(TodoService.class);
    private final TodoRepository todoRepository;
    private final NotificationService notificationService;
    private final DiaryService diaryService;
    private final HttpSession httpSession;

    public TodoService(TodoRepository todoRepository, NotificationService notificationService, DiaryService diaryService, HttpSession httpSession) {
        this.todoRepository = todoRepository;
        this.notificationService = notificationService;
        this.diaryService = diaryService;
        this.httpSession = httpSession;
    }

    public TodoResponse save(Todo todo) {
        try {
            todo.setCreatedAt(LocalDateTime.now());
            diaryService.createAutomaticEntry(todo.getUserId(), todo.getStatus(), todo);
            todoRepository.save(todo);
            log.info("end for save payload: {}", todo);
            return new TodoResponse("Salvato con successo", true);
        } catch (Exception e) {
            return new TodoResponse("Errore durante il salvataggio: " + e.getMessage(), false);
        }
    }

    public TodoResponse updatePartial(TodoUpdateRequest request, Long userId) {
        Optional<Todo> existingOpt =
                todoRepository.findByIdAndUserId(request.getId(), userId);
        if (existingOpt.isEmpty()) {
            return new TodoResponse("Todo non trovato o non autorizzato", false);
        }
        Todo todo = existingOpt.get();

        if (request.getTitle() != null)
            todo.setTitle(request.getTitle());

        if (request.getDescription() != null)
            todo.setDescription(request.getDescription());

        if (request.getStatus() != null)
            todo.setStatus(request.getStatus());

        if (request.getDueDate() != null)
            todo.setDueDate(request.getDueDate());

        if (request.getPriority() != null)
            todo.setPriority(request.getPriority());

        log.info("end for update payload: {}", todo);
        todoRepository.save(todo);

        return new TodoResponse("Todo aggiornato con successo", true);
    }

    @Transactional
    public boolean deleteByIdAndUserId(Long id, Long userId) {
        try {
            int deleted = todoRepository.deleteByIdAndUserId(id, userId);
            return deleted > 0;
        } catch (Exception e) {
            return false;
        }
    }

    public void updateStatus(Long todoId, Long userId, Enum.TodoStatus status) {
        Todo todo = todoRepository.findByIdAndUserId(todoId, userId)
                .orElseThrow(() -> new RuntimeException("Todo non trovato"));

        diaryService.createAutomaticEntry(userId, status, todo);
        if (status.equals(Enum.TodoStatus.DONE)) {
            todo.setExpired(false);
        }
        todo.setStatus(status);
        log.info("end for updateStatus payload: {}", todo);
        todoRepository.save(todo);
    }

    public Todo getTodoById(Long id, Long userId) {
        return todoRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() ->
                        new RuntimeException("Todo non trovato o non autorizzato"));
    }

    public List<Todo> findAllByStatuses(List<Enum.TodoStatus> statuses, Long userId) {
        List<Todo> todos = todoRepository.findByUserIdAndStatusInOrderByExpiredDescDueDateAscPriorityDesc(userId, statuses);

        LocalDate today = LocalDate.now();
        LocalDate limitDate = today.plusDays(3);
        List<Todo> toSave = new ArrayList<>();
        for (Todo todo : todos) {

            if (todo.getStatus() == Enum.TodoStatus.DONE) {
                continue;
            }
            LocalDate dueDate = todo.getDueDate();
            boolean isExpired = dueDate.isBefore(today);
            if (todo.isExpired() != isExpired) {
                todo.setExpired(isExpired);
                toSave.add(todo);
            }

            boolean isDueSoon = !isExpired && !dueDate.isAfter(limitDate);
            LocalDate lastNotified = todo.getLastNotificationDate();
            boolean alreadyNotifiedToday = lastNotified != null && lastNotified.isEqual(today);

            if (!alreadyNotifiedToday && (isExpired || isDueSoon)) {
                notificationService.createNotification(todo);
                todo.setLastNotificationDate(today);
                toSave.add(todo);
            }
        }

        if (!toSave.isEmpty()) {
            todoRepository.saveAll(toSave);
        }
        todos.sort(
                Comparator
                        .comparing(Todo::isExpired).reversed() // expired = true prima
                        .thenComparing(Todo::getDueDate)
                        .thenComparing(Todo::getPriority, Comparator.reverseOrder())
        );
        log.info("end for findAll payload: {}", todos);
        return todos;
    }

}
