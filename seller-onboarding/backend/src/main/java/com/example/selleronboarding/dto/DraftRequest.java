package com.example.selleronboarding.dto;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.NotNull;

/** Body of PUT /api/onboarding/draft */
public record DraftRequest(@NotNull Integer currentStep, @NotNull JsonNode draft) {}
