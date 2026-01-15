package spring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import spring.model.Diary;

import java.time.LocalDateTime;
import java.util.List;

public interface DiaryRepository extends JpaRepository<Diary, Long> {

    List<Diary> findByUserIdAndCreatedAtBetweenOrderByCreatedAtAsc(Long userId, LocalDateTime start, LocalDateTime end);
}

