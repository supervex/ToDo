package spring.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import spring.dto.todo.TodoRequest;
import spring.dto.todo.TodoResponse;
import spring.model.Todo;
import spring.model.builder.TodoBuilder;
import spring.service.TodoService;

import java.util.List;


@RestController
@RequestMapping("/api/todos")
public class TodoController {

    private final TodoService service;

    private static final Logger log = LoggerFactory.getLogger(TodoController.class);

    public TodoController(TodoService service) {

        this.service = service;

    }

    @PostMapping("/createTodo")
    public TodoResponse create(@RequestBody TodoRequest request) {
        log.info("start for createTodo payload: {}", request);
        Todo todo = TodoBuilder.buildTodo(request);

        TodoResponse todoResponse = service.save(todo);
        return todoResponse;
    }

    @GetMapping()
    public List<Todo> all() {
        return service.getAllTodos();
    }

}
