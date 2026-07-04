package com.PC3.backend.talent.prediction;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

@Component
public class PythonTalentClient {

    // Lee la URL de tu archivo env/local.env
    @Value("${PYTHON_AI_URL}")
    private String pythonAiUrl;

    private final RestTemplate restTemplate;

    public PythonTalentClient() {
        this.restTemplate = new RestTemplate();
    }

    public PythonTalentResponse getPrediction(PythonTalentRequest request) {
        // Apuntamos al endpoint exacto que pide la guía
        String url = pythonAiUrl + "/predict/talent-match";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<PythonTalentRequest> entity = new HttpEntity<>(request, headers);

        // Hace la petición POST a Python
        ResponseEntity<PythonTalentResponse> response = restTemplate.postForEntity(
                url, 
                entity, 
                PythonTalentResponse.class
        );

        return response.getBody();
    }
}