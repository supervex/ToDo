package spring.controller;

import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import spring.dto.todo.TodoRequest;
import spring.dto.todo.TodoResponse;
import spring.dto.todo.TodoUpdateRequest;
import spring.model.Todo;
import spring.model.builder.TodoBuilder;
import spring.service.TodoService;
import spring.util.Enum;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/todos")
public class TodoController {

    private final TodoService service;

    private static final Logger log = LoggerFactory.getLogger(TodoController.class);

    public TodoController(TodoService service) {
        this.service = service;
    }

    @PostMapping("/createTodo")
    public TodoResponse create(@RequestBody TodoRequest request, HttpSession session) {
        log.info("start for createTodo payload: {}", request);
        request.setUserId((Long) session.getAttribute("USER_ID"));
        Todo todo = TodoBuilder.buildTodo(request);
        TodoResponse todoResponse = service.save(todo);
        return todoResponse;
    }

    @GetMapping
    public ResponseEntity<?> all(HttpSession session) {
        Long userId = (Long) session.getAttribute("USER_ID");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "Non loggato"));
        }
        List<Todo> todos = service.getTodosByUserId(userId);
        return ResponseEntity.ok(todos);
    }

    @PatchMapping("/update")
    public ResponseEntity<?> update(
            @RequestBody TodoUpdateRequest request,
            HttpSession session
    ) {
        Long userId = (Long) session.getAttribute("USER_ID");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "Non loggato"));
        }

        TodoResponse response = service.updatePartial(request, userId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, HttpSession session) {
        log.info("start for deleteTodo payload: {}", id);
        Long userId = (Long) session.getAttribute("USER_ID");
        boolean success = service.deleteByIdAndUserId(id, userId);
        return ResponseEntity.ok(success);
    }


    @PatchMapping("/update-status")
    public ResponseEntity<?> updateStatus(@RequestBody Map<String, String> body, HttpSession session) {
        Long userId = (Long) session.getAttribute("USER_ID");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Long todoId = Long.valueOf(body.get("id"));
        Enum.TodoStatus status = Enum.TodoStatus.valueOf(body.get("status"));

        service.updateStatus(todoId, userId, status);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable Long id, HttpSession session) {
        Long userId = (Long) session.getAttribute("USER_ID");
        try {
            Todo todo = service.getTodoById(id, userId);
            return ResponseEntity.ok(todo);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }


}
