package spring.model.builder;

import spring.dto.todo.TodoRequest;
import spring.model.Todo;

public  class TodoBuilder {

    public static Todo buildTodo(TodoRequest request){
        Todo todo = new Todo();
        todo.setUserId(request.getUserId());
        todo.setTitle(request.getTitle());
        todo.setDescription(request.getDescription());
        todo.setStatus(request.getStatus());
        todo.setPriority(request.getPriority());
        todo.setDueDate(request.getDueDate());
        return todo;
    }

}
