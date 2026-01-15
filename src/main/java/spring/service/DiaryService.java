package spring.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import spring.controller.DiaryController;
import spring.model.Diary;
import spring.model.Todo;
import spring.repository.DiaryRepository;
import spring.util.Enum;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class DiaryService {

    private final DiaryRepository diaryRepository;
    private static final Logger log = LoggerFactory.getLogger(DiaryService.class);

    public DiaryService(DiaryRepository diaryRepository) {
        this.diaryRepository = diaryRepository;
    }

    public List<Diary> getEntriesForUserByDate(Long userId, LocalDate date) {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.plusDays(1).atStartOfDay();
        List<Diary> entries = diaryRepository.findByUserIdAndCreatedAtBetweenOrderByCreatedAtAsc(userId, start, end);
        log.info("end for getEntriesForUserByDate payload: {}", entries);
        return entries;
    }

    public Diary saveEntry(Diary newEntry) {
        newEntry.setType("manual");
        LocalDate entryDate = newEntry.getEntryDate();
        LocalDate today = LocalDate.now();
        LocalTime time;
        if (entryDate.isAfter(today)) {
            time = LocalTime.of(6, 0);
        } else {
            time = LocalTime.now();
        }
        newEntry.setCreatedAt(LocalDateTime.of(entryDate, time));
        log.info("end for saveEntry manual payload: {}", newEntry);
        return diaryRepository.save(newEntry);
    }

    public Diary updateManualEntry(Long id, Long userId, String newMessage) {
        Diary diary = diaryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nota non trovata"));

        if (!"manual".equalsIgnoreCase(diary.getType())) {
            throw new IllegalStateException("Solo le note manuali possono essere modificate");
        }
        if(newMessage == null || newMessage.isBlank()) {
            diaryRepository.deleteById(id);
            log.info("end for updateManualEntry deleted payload: {}", diary);
            return diary;
        }
        diary.setMessage(newMessage);
        log.info("end for updateManualEntry payload: {}", diary);
        return diaryRepository.save(diary);
    }

    public void createAutomaticEntry(Long userId, Enum.TodoStatus status, Todo todo) {
        Diary diary = new Diary();
        diary.setUserId(userId);
        diary.setCreatedAt(LocalDateTime.now());
        diary.setEntryDate(LocalDate.now());
        diary.setType("automatic");
        diary.setTaskId(todo.getId());
        log.info("start for createAutomaticEntry payload: {}", diary);
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
        log.info("end for createAutomaticEntry payload: {}", diary);
        diaryRepository.save(diary);
    }
}
