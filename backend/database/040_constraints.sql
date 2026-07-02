ALTER TABLE talent_evaluations
ADD CONSTRAINT fk_talent_evaluations_candidate
FOREIGN KEY (candidate_id) REFERENCES talent_candidates(id) ON DELETE CASCADE;

ALTER TABLE talent_predictions
ADD CONSTRAINT fk_talent_predictions_evaluation
FOREIGN KEY (evaluation_id) REFERENCES talent_evaluations(id) ON DELETE CASCADE;
