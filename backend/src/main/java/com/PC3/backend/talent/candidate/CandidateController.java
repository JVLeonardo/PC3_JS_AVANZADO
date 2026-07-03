package com.PC3.backend.talent.candidate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/talent-match/candidates")
@CrossOrigin(origins = "http://localhost:5173")
public class CandidateController {

    @Autowired
    private CandidateService service;

    // Endpoint para registrar al postulante (POST)
    @PostMapping
    public ResponseEntity<CandidateResponse> registrar(@RequestBody CandidateRequest request) {
        return ResponseEntity.ok(service.registrarCandidato(request));
    }

    // Endpoint para consultar datos por ID (GET)
    @GetMapping("/{id}")
    public ResponseEntity<Candidate> obtenerPorId(@PathVariable Long id) {
        return service.getRepository().findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}