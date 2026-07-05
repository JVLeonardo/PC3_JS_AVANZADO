package com.PC3.backend.talent.prediction;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TalentPredictionRepository extends JpaRepository<TalentPrediction, Long> {
    List<TalentPrediction> findAllByOrderByFechaPrediccionDesc();

    Optional<TalentPrediction> findByEvaluationId(Long evaluationId);
}
