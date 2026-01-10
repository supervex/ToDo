package spring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import spring.model.Todo;

import java.util.List;

public interface TodoRepository extends JpaRepository<Todo, Long> {

        List<Todo> findByUserId(Long userId);

}