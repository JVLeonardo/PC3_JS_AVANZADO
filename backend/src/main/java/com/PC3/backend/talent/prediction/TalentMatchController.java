package com.PC3.backend.talent.prediction;

import com.PC3.backend.talent.candidate.CandidateRequest;
import com.PC3.backend.talent.evaluation.TalentEvaluationRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/talent-match")
public class TalentMatchController {

    private final TalentPredictionService predictionService;

    public TalentMatchController(TalentPredictionService predictionService) {
        this.predictionService = predictionService;
    }

    // El frontend enviará un JSON con todos los datos combinados.
    // Creamos un DTO de entrada específico para este endpoint.
    public record TalentMatchIncomingRequest(
            // Datos del Integrante 1 (Postulante)
            String nombrePostulante,
            String emailPostulante,
            String avatarUrl,
            
            // Datos del Integrante 2 (Evaluación)
            int javascript,
            int react,
            int springBoot,
            int pythonDatos,
            int sql,
            int experienciaProyectos,
            int preferencia
    ) {}

    @PostMapping("/predict")
    public ResponseEntity<TalentMatchResponse> predictTalent(@RequestBody TalentMatchIncomingRequest request) {
        
        // Separamos el payload para respetar los módulos de tus compañeros
        CandidateRequest candidateReq = new CandidateRequest();
        candidateReq.setNombrePostulante(request.nombrePostulante());
        candidateReq.setEmailPostulante(request.emailPostulante());
        candidateReq.setAvatarUrl(request.avatarUrl());

        TalentEvaluationRequest evalReq = new TalentEvaluationRequest();
        evalReq.setJavascript(request.javascript());
        evalReq.setReact(request.react());
        evalReq.setSpringBoot(request.springBoot());
        evalReq.setPythonDatos(request.pythonDatos());
        evalReq.setSql(request.sql());
        evalReq.setExperienciaProyectos(request.experienciaProyectos());
        evalReq.setPreferencia(request.preferencia());

        // Lanzamos la orquestación
        TalentMatchResponse response = predictionService.processPredictionFlow(candidateReq, evalReq);

        return ResponseEntity.ok(response);
    }
}