package com.PC3.backend.talent.history;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/talent-match/history")
public class TalentHistoryController {
    private final TalentHistoryService service;

    public TalentHistoryController(TalentHistoryService service) {
        this.service = service;
    }

    @GetMapping
    public List<TalentHistoryItemResponse> list() {
        return service.list();
    }

    @GetMapping("/{id}")
    public TalentHistoryDetailResponse detail(@PathVariable Long id) {
        return service.detail(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
