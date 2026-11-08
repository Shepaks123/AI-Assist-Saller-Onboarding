package com.example.selleronboarding.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public record ChatRequest(
        @NotBlank(message = "Message is required") @Size(max = 1000, message = "Message is too long") String message,
        Integer step,
        @Size(max = 20) List<Turn> history) {

    /** role is "user" or "assistant". */
    public record Turn(String role, @Size(max = 2000) String text) {}
}
