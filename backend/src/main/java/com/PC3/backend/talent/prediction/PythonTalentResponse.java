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
public class PythonTalentResponse {
    private String caso;
    private String prediccion;
    private BigDecimal confianza;
    private List<Map<String, Object>> ranking;
    private List<String> recomendaciones;
}