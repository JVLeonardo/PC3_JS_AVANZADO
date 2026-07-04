package com.PC3.backend.talent.prediction;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TalentPredictionRepository extends JpaRepository<TalentPrediction, Long> {
    // JpaRepository ya incluye save(), findById(), etc. No necesitas escribir más.
}