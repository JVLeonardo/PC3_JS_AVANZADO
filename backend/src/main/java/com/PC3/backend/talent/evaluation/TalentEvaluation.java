package com.PC3.backend.talent.evaluation;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "talent_evaluations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TalentEvaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "candidate_id", nullable = false)
    private Long candidateId;

    @Column(nullable = false)
    private Integer javascript;

    @Column(nullable = false)
    private Integer react;

    @Column(name = "spring_boot", nullable = false)
    private Integer springBoot;

    @Column(name = "python_datos", nullable = false)
    private Integer pythonDatos;

    @Column(nullable = false)
    private Integer sql;

    @Column(name = "experiencia_proyectos", nullable = false)
    private Integer experienciaProyectos;

    @Column(nullable = false)
    private Integer preferencia;

    @Column(name = "fecha_evaluacion")
    private LocalDateTime fechaEvaluacion;
}
