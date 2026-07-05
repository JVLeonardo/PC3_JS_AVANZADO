package com.PC3.backend.talent.history;

import com.PC3.backend.talent.candidate.Candidate;
import com.PC3.backend.talent.candidate.CandidateRepository;
import com.PC3.backend.talent.evaluation.TalentEvaluation;
import com.PC3.backend.talent.evaluation.TalentEvaluationRepository;
import com.PC3.backend.talent.prediction.TalentPrediction;
import com.PC3.backend.talent.prediction.TalentPredictionRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TalentHistoryService {
    private final TalentPredictionRepository predictionRepository;
    private final TalentEvaluationRepository evaluationRepository;
    private final CandidateRepository candidateRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public TalentHistoryService(
            TalentPredictionRepository predictionRepository,
            TalentEvaluationRepository evaluationRepository,
            CandidateRepository candidateRepository) {
        this.predictionRepository = predictionRepository;
        this.evaluationRepository = evaluationRepository;
        this.candidateRepository = candidateRepository;
    }

    @Transactional(readOnly = true)
    public List<TalentHistoryItemResponse> list() {
        return predictionRepository.findAllByOrderByFechaPrediccionDesc().stream()
                .map(this::toItem)
                .toList();
    }

    @Transactional(readOnly = true)
    public TalentHistoryDetailResponse detail(Long evaluationId) {
        TalentEvaluation evaluation = findEvaluation(evaluationId);
        TalentPrediction prediction = predictionRepository.findByEvaluationId(evaluationId)
                .orElseThrow(() -> new RuntimeException("Prediccion no encontrada"));
        Candidate candidate = findCandidate(evaluation.getCandidateId());

        return TalentHistoryDetailResponse.builder()
                .id(evaluation.getId())
                .candidateId(candidate.getId())
                .evaluationId(evaluation.getId())
                .nombrePostulante(candidate.getNombrePostulante())
                .emailPostulante(candidate.getEmailPostulante())
                .avatarUrl(candidate.getAvatarUrl())
                .javascript(evaluation.getJavascript())
                .react(evaluation.getReact())
                .springBoot(evaluation.getSpringBoot())
                .pythonDatos(evaluation.getPythonDatos())
                .sql(evaluation.getSql())
                .experienciaProyectos(evaluation.getExperienciaProyectos())
                .preferencia(evaluation.getPreferencia())
                .perfilRecomendado(prediction.getPerfilRecomendado())
                .prediccion(prediction.getPerfilRecomendado())
                .confianza(prediction.getConfianza())
                .ranking(parseRanking(prediction.getRankingJson()))
                .recomendaciones(parseRecommendations(prediction.getRecomendaciones()))
                .entrada(buildInput(evaluation, candidate))
                .promedioTecnico(calculateAverage(evaluation))
                .fechaEvaluacion(evaluation.getFechaEvaluacion())
                .fechaPrediccion(prediction.getFechaPrediccion())
                .build();
    }

    @Transactional
    public void delete(Long evaluationId) {
        TalentEvaluation evaluation = findEvaluation(evaluationId);
        evaluationRepository.delete(evaluation);
    }

    private TalentHistoryItemResponse toItem(TalentPrediction prediction) {
        TalentEvaluation evaluation = findEvaluation(prediction.getEvaluationId());
        Candidate candidate = findCandidate(evaluation.getCandidateId());

        return TalentHistoryItemResponse.builder()
                .id(evaluation.getId())
                .candidateId(candidate.getId())
                .evaluationId(evaluation.getId())
                .nombrePostulante(candidate.getNombrePostulante())
                .emailPostulante(candidate.getEmailPostulante())
                .avatarUrl(candidate.getAvatarUrl())
                .javascript(evaluation.getJavascript())
                .react(evaluation.getReact())
                .springBoot(evaluation.getSpringBoot())
                .pythonDatos(evaluation.getPythonDatos())
                .sql(evaluation.getSql())
                .experienciaProyectos(evaluation.getExperienciaProyectos())
                .preferencia(evaluation.getPreferencia())
                .perfilRecomendado(prediction.getPerfilRecomendado())
                .prediccion(prediction.getPerfilRecomendado())
                .confianza(prediction.getConfianza())
                .promedioTecnico(calculateAverage(evaluation))
                .fechaEvaluacion(evaluation.getFechaEvaluacion())
                .fechaPrediccion(prediction.getFechaPrediccion())
                .build();
    }

    private TalentEvaluation findEvaluation(Long id) {
        return evaluationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evaluacion no encontrada"));
    }

    private Candidate findCandidate(Long id) {
        return candidateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidato no encontrado"));
    }

    private List<Map<String, Object>> parseRanking(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<List<Map<String, Object>>>() {});
        } catch (Exception e) {
            return List.of();
        }
    }

    private List<String> parseRecommendations(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return List.of();
        }
    }

    private Map<String, Object> buildInput(TalentEvaluation evaluation, Candidate candidate) {
        Map<String, Object> input = new LinkedHashMap<>();
        input.put("nombrePostulante", candidate.getNombrePostulante());
        input.put("emailPostulante", candidate.getEmailPostulante());
        input.put("avatarUrl", candidate.getAvatarUrl());
        input.put("javascript", evaluation.getJavascript());
        input.put("react", evaluation.getReact());
        input.put("springBoot", evaluation.getSpringBoot());
        input.put("pythonDatos", evaluation.getPythonDatos());
        input.put("sql", evaluation.getSql());
        input.put("experienciaProyectos", evaluation.getExperienciaProyectos());
        input.put("preferencia", evaluation.getPreferencia());
        return input;
    }

    private double calculateAverage(TalentEvaluation evaluation) {
        return (evaluation.getJavascript()
                + evaluation.getReact()
                + evaluation.getSpringBoot()
                + evaluation.getPythonDatos()
                + evaluation.getSql()) / 5.0;
    }
}
