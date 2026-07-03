package com.PC3.backend.talent.candidate;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "talent_candidates")
@Data
public class Candidate {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 120)
	private String nombrePostulante;

	@Column(length = 160)
	private String emailPostulante;

	@Column(length = 500)
	private String avatarUrl;

	private LocalDateTime fechaRegistro = LocalDateTime.now();
}