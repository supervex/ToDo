package spring.service;

import org.springframework.stereotype.Service;
import spring.dto.todo.TodoResponse;
import spring.model.Todo;
import spring.repository.TodoRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TodoService {


    private final TodoRepository todoRepository;

    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
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


    public List<Todo> getAllTodos() {
        return todoRepository.findAll();
    }
}
