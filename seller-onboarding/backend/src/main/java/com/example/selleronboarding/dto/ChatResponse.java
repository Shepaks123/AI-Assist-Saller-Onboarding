package com.example.selleronboarding.dto;

import java.util.List;

public record ChatResponse(String reply, List<String> suggestions) {}
