package spring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import spring.model.Todo;

import java.util.List;
import java.util.Optional;

public interface TodoRepository extends JpaRepository<Todo, Long> {

        List<Todo> findByUserId(Long userId);
        Optional<Todo> findByIdAndUserId(Long id, Long userId);
        @Modifying
        @Query("delete from Todo t where t.id = :id and t.userId = :userId")
        int deleteByIdAndUserId(@Param("id") Long id, @Param("userId") Long userId);
}