package com.PC3.backend.talent.candidate;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CandidateResponse {
	private Long id;
	private String nombrePostulante;
	private String emailPostulante; // Agregado conforme a lo solicitado
	private String avatarUrl; // Agregado conforme a lo solicitado
}