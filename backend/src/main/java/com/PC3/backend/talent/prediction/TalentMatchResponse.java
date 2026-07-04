package com.PC3.backend.talent.prediction;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TalentMatchResponse {
    private String perfilRecomendado;
    private BigDecimal confianza;
    private List<Map<String, Object>> ranking;
    private List<String> recomendaciones;
    private Long candidateId;
    private Long evaluationId;
}