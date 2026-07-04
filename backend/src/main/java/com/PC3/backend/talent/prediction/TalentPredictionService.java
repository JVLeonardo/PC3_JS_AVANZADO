package com.PC3.backend.talent.prediction;

import com.PC3.backend.talent.candidate.CandidateRequest;
import com.PC3.backend.talent.candidate.CandidateResponse;
import com.PC3.backend.talent.candidate.CandidateService;
import com.PC3.backend.talent.evaluation.TalentEvaluationRequest;
import com.PC3.backend.talent.evaluation.TalentEvaluationResponse;
import com.PC3.backend.talent.evaluation.TalentEvaluationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TalentPredictionService {

    private final CandidateService candidateService;
    private final TalentEvaluationService evaluationService;
    private final PythonTalentClient pythonClient;
    private final TalentPredictionRepository predictionRepository;
    
    // ¡Solución aquí! Instanciamos directamente en lugar de pedirle a Spring que lo inyecte
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Quitamos ObjectMapper de los parámetros del constructor
    public TalentPredictionService(CandidateService candidateService, 
                                   TalentEvaluationService evaluationService, 
                                   PythonTalentClient pythonClient, 
                                   TalentPredictionRepository predictionRepository) {
        this.candidateService = candidateService;
        this.evaluationService = evaluationService;
        this.pythonClient = pythonClient;
        this.predictionRepository = predictionRepository;
    }

    @Transactional
    public TalentMatchResponse processPredictionFlow(CandidateRequest candidateReq, TalentEvaluationRequest evalReq) {
        
        // 1. Crear el candidato llamando al método exacto del Integrante 1
        CandidateResponse candidate = candidateService.registrarCandidato(candidateReq);

        // 2. Inyectar el ID del candidato en la evaluación y guardarla (Integrante 2)
        evalReq.setCandidateId(candidate.getId());
        TalentEvaluationResponse evaluation = evaluationService.save(evalReq);

        // 3. Convertir datos al formato de Python y llamar a FastAPI
        PythonTalentRequest pyReq = new PythonTalentRequest(
                evalReq.getJavascript(), evalReq.getReact(), evalReq.getSpringBoot(),
                evalReq.getPythonDatos(), evalReq.getSql(), evalReq.getExperienciaProyectos(),
                evalReq.getPreferencia()
        );
        PythonTalentResponse pyRes = pythonClient.getPrediction(pyReq);

        // 4. Transformar los arreglos a formato JSON (texto) para PostgreSQL
        String rankingJson = "";
        String recomendacionesJson = "";
        try {
            rankingJson = objectMapper.writeValueAsString(pyRes.getRanking());
            recomendacionesJson = objectMapper.writeValueAsString(pyRes.getRecomendaciones());
        } catch (Exception e) {
            e.printStackTrace();
        }

        // 5. Guardar tu predicción en la base de datos usando Builder
        TalentPrediction prediction = TalentPrediction.builder()
                .evaluationId(evaluation.getId())
                .perfilRecomendado(pyRes.getPrediccion())
                .confianza(pyRes.getConfianza())
                .rankingJson(rankingJson)
                .recomendaciones(recomendacionesJson)
                .build();
                
        predictionRepository.save(prediction);

        // 6. Devolver el DTO unificado hacia el controlador
        return new TalentMatchResponse(
                pyRes.getPrediccion(),
                pyRes.getConfianza(),
                pyRes.getRanking(),
                pyRes.getRecomendaciones(),
                candidate.getId(),
                evaluation.getId()
        );
    }
}