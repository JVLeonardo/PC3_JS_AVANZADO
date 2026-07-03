package com.PC3.backend.talent.evaluation;

import java.time.LocalDateTime;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TalentEvaluationService {

    private final TalentEvaluationRepository repository;

    public TalentEvaluationResponse save(TalentEvaluationRequest request) {

        validate(request);

        TalentEvaluation entity = TalentEvaluation.builder()
                .candidateId(request.getCandidateId())
                .javascript(request.getJavascript())
                .react(request.getReact())
                .springBoot(request.getSpringBoot())
                .pythonDatos(request.getPythonDatos())
                .sql(request.getSql())
                .experienciaProyectos(request.getExperienciaProyectos())
                .preferencia(request.getPreferencia())
                .fechaEvaluacion(LocalDateTime.now())
                .build();

        entity = repository.save(entity);

        return TalentEvaluationResponse.builder()
                .id(entity.getId())
                .candidateId(entity.getCandidateId())
                .javascript(entity.getJavascript())
                .react(entity.getReact())
                .springBoot(entity.getSpringBoot())
                .pythonDatos(entity.getPythonDatos())
                .sql(entity.getSql())
                .experienciaProyectos(entity.getExperienciaProyectos())
                .preferencia(entity.getPreferencia())
                .fechaEvaluacion(entity.getFechaEvaluacion())
                .build();
    }

    public TalentEvaluationResponse findById(Long id) {

        TalentEvaluation entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evaluación no encontrada"));

        return TalentEvaluationResponse.builder()
                .id(entity.getId())
                .candidateId(entity.getCandidateId())
                .javascript(entity.getJavascript())
                .react(entity.getReact())
                .springBoot(entity.getSpringBoot())
                .pythonDatos(entity.getPythonDatos())
                .sql(entity.getSql())
                .experienciaProyectos(entity.getExperienciaProyectos())
                .preferencia(entity.getPreferencia())
                .fechaEvaluacion(entity.getFechaEvaluacion())
                .build();
    }

    private void validate(TalentEvaluationRequest r) {

        if (r.getJavascript() < 0 || r.getJavascript() > 100)
            throw new IllegalArgumentException("JavaScript fuera de rango");

        if (r.getReact() < 0 || r.getReact() > 100)
            throw new IllegalArgumentException("React fuera de rango");

        if (r.getSpringBoot() < 0 || r.getSpringBoot() > 100)
            throw new IllegalArgumentException("Spring Boot fuera de rango");

        if (r.getPythonDatos() < 0 || r.getPythonDatos() > 100)
            throw new IllegalArgumentException("Python Datos fuera de rango");

        if (r.getSql() < 0 || r.getSql() > 100)
            throw new IllegalArgumentException("SQL fuera de rango");

        if (r.getExperienciaProyectos() < 0 || r.getExperienciaProyectos() > 10)
            throw new IllegalArgumentException("Experiencia fuera de rango");

        if (r.getPreferencia() < 0 || r.getPreferencia() > 3)
            throw new IllegalArgumentException("Preferencia fuera de rango");
    }
}
