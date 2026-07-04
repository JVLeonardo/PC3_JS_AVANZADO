package com.PC3.backend.talent.prediction;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PythonTalentRequest {
    private int javascript;
    private int react;
    
    @JsonProperty("spring_boot")
    private int springBoot;
    
    @JsonProperty("python_datos")
    private int pythonDatos;
    
    private int sql;
    
    @JsonProperty("experiencia_proyectos")
    private int experienciaProyectos;
    
    private int preferencia;
}