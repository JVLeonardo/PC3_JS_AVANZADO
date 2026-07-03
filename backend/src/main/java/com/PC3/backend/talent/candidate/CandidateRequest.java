package com.PC3.backend.talent.candidate;

import lombok.Data;

@Data
public class CandidateRequest {
	private String nombrePostulante;
	private String emailPostulante;
	private String avatarUrl;
}