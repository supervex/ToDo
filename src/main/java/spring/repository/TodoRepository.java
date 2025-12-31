package spring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import spring.model.Todo;

public interface TodoRepository extends JpaRepository<Todo, Long> {


}