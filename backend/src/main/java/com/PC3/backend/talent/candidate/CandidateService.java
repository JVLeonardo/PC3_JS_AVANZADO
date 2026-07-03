package com.PC3.backend.talent.candidate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CandidateService {
	@Autowired
	private CandidateRepository repository;

	public CandidateRepository getRepository() {
		return repository;
	}

	public CandidateResponse registrarCandidato(CandidateRequest request) {
		// Validación obligatoria del nombre
		if (request.getNombrePostulante() == null || request.getNombrePostulante().isEmpty()) {
			throw new IllegalArgumentException("El nombre del postulante es obligatorio");
		}

		Candidate candidate = new Candidate();
		candidate.setNombrePostulante(request.getNombrePostulante());
		candidate.setEmailPostulante(request.getEmailPostulante());
		candidate.setAvatarUrl(request.getAvatarUrl());

		Candidate saved = repository.save(candidate);

		return CandidateResponse.builder()
				.id(saved.getId())
				.nombrePostulante(saved.getNombrePostulante())
				.build();
	}
}