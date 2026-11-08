package com.example.selleronboarding.dto;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.NotNull;

/** Body of POST /api/onboarding/submit */
public record SubmitRequest(@NotNull JsonNode draft) {}
