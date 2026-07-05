package com.PC3.backend.talent.history;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TalentHistoryDetailResponse {
    private Long id;
    private Long candidateId;
    private Long evaluationId;
    private String nombrePostulante;
    private String emailPostulante;
    private String avatarUrl;
    private Integer javascript;
    private Integer react;
    private Integer springBoot;
    private Integer pythonDatos;
    private Integer sql;
    private Integer experienciaProyectos;
    private Integer preferencia;
    private String perfilRecomendado;
    private String prediccion;
    private BigDecimal confianza;
    private List<Map<String, Object>> ranking;
    private List<String> recomendaciones;
    private Map<String, Object> entrada;
    private Double promedioTecnico;
    private LocalDateTime fechaEvaluacion;
    private OffsetDateTime fechaPrediccion;
}
