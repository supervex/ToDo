package spring.service;

import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import spring.dto.todo.TodoResponse;
import spring.model.Todo;
import spring.repository.TodoRepository;

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

    @Transactional
    public TodoResponse update(Todo todo) {
        try {
            Long id = todo.getId();
            Long userId = todo.getUserId();
            if (id == null || userId == null) {
                return new TodoResponse("Id o userId mancanti", false);
            }

            Optional<Todo> existingOpt = todoRepository.findByIdAndUserId(id, userId);
            if (existingOpt.isEmpty()) {
                return new TodoResponse("Todo non trovato o non autorizzato", false);
            }

            Todo existing = existingOpt.get();
            existing.setTitle(todo.getTitle());
            existing.setStatus(todo.getStatus());
            existing.setDueDate(todo.getDueDate());
            existing.setPriority(todo.getPriority());
            existing.setDescription(todo.getDescription());
            existing.setUpdatedAt(LocalDateTime.now());

            todoRepository.save(existing);
            return new TodoResponse("Aggiornato con successo", true);
        } catch (Exception e) {
            return new TodoResponse("Errore durante l'aggiornamento: " + e.getMessage(), false);
        }
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
}
