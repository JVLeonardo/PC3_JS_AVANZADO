package com.PC3.backend.talent.evaluation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TalentEvaluationRequest {

    private Long candidateId;

    private Integer javascript;

    private Integer react;

    private Integer springBoot;

    private Integer pythonDatos;

    private Integer sql;

    private Integer experienciaProyectos;

    private Integer preferencia;
}
