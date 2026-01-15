package spring.controller;

import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import spring.service.DiaryService;
import spring.model.Diary;

import java.time.LocalDate;
import java.util.List;

    @RestController
    @RequestMapping("/api/diary")
    public class DiaryController {

        private final DiaryService diaryService;

        private static final Logger log = LoggerFactory.getLogger(DiaryController.class);

        public DiaryController(DiaryService diaryService) {
            this.diaryService = diaryService;
        }

        @GetMapping
        public ResponseEntity<?> getDiaryByDate(
                @RequestParam String date, HttpSession session) {
            log.info("start for getDiaryByDate payload: {}", date);
            LocalDate localDate = LocalDate.parse(date);
            Long userId = (Long) session.getAttribute("USER_ID");
            if (userId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            List<Diary> phrases = diaryService.getEntriesForUserByDate(userId, localDate);
            return  ResponseEntity.ok(phrases);
        }

        @PostMapping
        public ResponseEntity<?> createDiaryEntry(@RequestBody Diary newEntry, HttpSession session) {
            log.info("start for createDiaryEntry manual payload: {}", newEntry);

            Long userId = (Long) session.getAttribute("USER_ID");
            if (userId == null)
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            newEntry.setUserId(userId);
            Diary saved = diaryService.saveEntry(newEntry);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        }


        @PatchMapping("/{id}")
        public ResponseEntity<?> updateDiaryEntry(@PathVariable Long id, @RequestBody Diary payload, HttpSession session) {
            log.info("start updateDiaryEntry id={}, payload={}", id, payload);

            Long userId = (Long) session.getAttribute("USER_ID");
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            try {
                Diary updated = diaryService.updateManualEntry(id, userId, payload.getMessage());
                return ResponseEntity.ok(updated);
            } catch (IllegalStateException e) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            }
        }


    }


