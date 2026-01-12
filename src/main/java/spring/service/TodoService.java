package spring.service;

import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import spring.dto.todo.TodoResponse;
import spring.dto.todo.TodoUpdateRequest;
import spring.model.Todo;
import spring.repository.TodoRepository;
import spring.util.Enum;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TodoService {


    private final TodoRepository todoRepository;
    private final HttpSession httpSession;

    public TodoService(TodoRepository todoRepository, HttpSession httpSession) {
        this.todoRepository = todoRepository;
        this.httpSession = httpSession;
    }

    public TodoResponse save(Todo todo) {
        try {
            todo.setCreatedAt(LocalDateTime.now());
            todoRepository.save(todo);

            return new TodoResponse("Salvato con successo",true );
        } catch (Exception e) {
            return new TodoResponse( "Errore durante il salvataggio: " + e.getMessage(),false );
        }
    }

    public List<Todo> getTodosByUserId(Long userId) {
        return todoRepository.findByUserId(userId);
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
        todo.setStatus(status);
        todoRepository.save(todo);
    }

    public Todo getTodoById(Long id, Long userId) {
        return todoRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() ->
                        new RuntimeException("Todo non trovato o non autorizzato"));
    }

}
