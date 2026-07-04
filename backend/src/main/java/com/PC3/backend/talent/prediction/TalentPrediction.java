package com.PC3.backend.talent.prediction;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "talent_predictions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TalentPrediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "evaluation_id", nullable = false)
    private Long evaluationId;

    @Column(name = "perfil_recomendado", nullable = false, length = 60)
    private String perfilRecomendado;

    @Column(name = "confianza", nullable = false, precision = 5, scale = 4)
    private BigDecimal confianza;

    @Column(name = "ranking_json", nullable = false, columnDefinition = "TEXT")
    private String rankingJson;

    @Column(name = "recomendaciones", nullable = false, columnDefinition = "TEXT")
    private String recomendaciones;

    @Column(name = "fecha_prediccion", nullable = false, updatable = false)
    private OffsetDateTime fechaPrediccion;

    @PrePersist
    protected void onCreate() {
        if (this.fechaPrediccion == null) {
            this.fechaPrediccion = OffsetDateTime.now();
        }
    }
}