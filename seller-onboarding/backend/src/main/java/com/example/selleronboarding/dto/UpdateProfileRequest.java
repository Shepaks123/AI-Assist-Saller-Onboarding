package com.example.selleronboarding.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(@NotBlank(message = "Full name is required") @Size(max = 100) String fullName) {}
