package com.PC3.backend.talent.evaluation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TalentEvaluationRepository extends JpaRepository<TalentEvaluation, Long> {
}