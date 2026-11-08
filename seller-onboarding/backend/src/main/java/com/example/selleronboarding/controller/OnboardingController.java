package com.example.selleronboarding.controller;

import com.example.selleronboarding.dto.ApplicationResponse;
import com.example.selleronboarding.dto.DraftRequest;
import com.example.selleronboarding.dto.SubmitRequest;
import com.example.selleronboarding.service.OnboardingService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/onboarding")
public class OnboardingController {

    private final OnboardingService onboarding;

    public OnboardingController(OnboardingService onboarding) { this.onboarding = onboarding; }

    @GetMapping("/status")
    public ApplicationResponse status(@AuthenticationPrincipal Long userId) { return onboarding.getStatus(userId); }

    @PutMapping("/draft")
    public ApplicationResponse saveDraft(@AuthenticationPrincipal Long userId, @Valid @RequestBody DraftRequest req) {
        return onboarding.saveDraft(userId, req);
    }

    @PostMapping("/submit")
    public ApplicationResponse submit(@AuthenticationPrincipal Long userId, @Valid @RequestBody SubmitRequest req) {
        return onboarding.submit(userId, req);
    }
}
