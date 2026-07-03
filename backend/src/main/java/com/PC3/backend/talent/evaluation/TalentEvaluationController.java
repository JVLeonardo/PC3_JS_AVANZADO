package com.PC3.backend.talent.evaluation;

import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/talent-match/evaluations")
@RequiredArgsConstructor
public class TalentEvaluationController {

    private final TalentEvaluationService service;

    @PostMapping
    public TalentEvaluationResponse save(
            @RequestBody TalentEvaluationRequest request) {

        return service.save(request);
    }

    @GetMapping("/{id}")
    public TalentEvaluationResponse findById(
            @PathVariable Long id) {

        return service.findById(id);
    }
}