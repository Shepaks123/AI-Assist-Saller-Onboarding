package com.example.selleronboarding.dto;

import com.fasterxml.jackson.databind.JsonNode;
import java.time.Instant;
import java.util.List;

/** Shape the React app expects from GET /status, PUT /draft and POST /submit. */
public record ApplicationResponse(
        String status,                 // draft | pending | approved | rejected
        int currentStep,
        JsonNode draft,
        String feedback,
        List<String> missingRequirements,
        Instant submittedAt,
        Instant updatedAt) {}
