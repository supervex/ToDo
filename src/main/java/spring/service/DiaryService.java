package spring.service;

import org.springframework.stereotype.Service;
import spring.model.Diary;
import spring.model.Todo;
import spring.repository.DiaryRepository;
import spring.util.Enum;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DiaryService {

    private final DiaryRepository diaryRepository;

    public DiaryService(DiaryRepository diaryRepository) {
        this.diaryRepository = diaryRepository;
    }

    public List<Diary> getEntriesForUserByDate(Long userId, LocalDate date) {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.plusDays(1).atStartOfDay();
        return diaryRepository.findByUserIdAndCreatedAtBetweenOrderByCreatedAtAsc(userId, start, end);
    }

    public Diary saveEntry(Diary entry) {
        return diaryRepository.save(entry);
    }

    public Diary updateManualEntry(Long id, Long userId, String newMessage) {
        Diary diary = diaryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nota non trovata"));

        if (!"manual".equalsIgnoreCase(diary.getType())) {
            throw new IllegalStateException("Solo le note manuali possono essere modificate");
        }
        diary.setMessage(newMessage);

        return diaryRepository.save(diary);
    }

    public void createAutomaticEntry(Long userId, Enum.TodoStatus status, Todo todo) {
        Diary diary = new Diary();
        diary.setUserId(userId);
        diary.setCreatedAt(LocalDateTime.now());
        diary.setEntryDate(LocalDate.now());
        diary.setType("automatic");
        diary.setTaskId(todo.getId());
        switch (status) {
            case IN_PROGRESS:
                diary.setMessage("Oggi hai iniziato il task: " + todo.getTitle());
                break;
            case DONE:
                diary.setMessage("Oggi hai completato il task: " + todo.getTitle());
                break;
            case TODO:
                diary.setMessage("Oggi hai messo in lista il task: " + todo.getTitle());
                break;
        }
        diaryRepository.save(diary);
    }


}
