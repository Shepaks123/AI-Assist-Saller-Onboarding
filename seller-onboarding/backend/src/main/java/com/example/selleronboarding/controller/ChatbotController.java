package com.example.selleronboarding.controller;

import com.example.selleronboarding.dto.ChatRequest;
import com.example.selleronboarding.dto.ChatResponse;
import com.example.selleronboarding.service.GeminiService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class ChatbotController {

    private final GeminiService gemini;

    public ChatbotController(GeminiService gemini) { this.gemini = gemini; }

    @PostMapping("/chat")
    public ChatResponse chat(@AuthenticationPrincipal Long userId, @Valid @RequestBody ChatRequest req) {
        return gemini.chat(userId, req);
    }
}
