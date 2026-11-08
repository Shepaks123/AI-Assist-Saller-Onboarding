package com.example.selleronboarding.controller;

import com.example.selleronboarding.dto.UpdateProfileRequest;
import com.example.selleronboarding.dto.UserResponse;
import com.example.selleronboarding.service.SellerService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/seller")
public class SellerController {

    private final SellerService sellers;

    public SellerController(SellerService sellers) { this.sellers = sellers; }

    @GetMapping("/profile")
    public UserResponse profile(@AuthenticationPrincipal Long userId) { return sellers.getProfile(userId); }

    @PutMapping("/profile")
    public UserResponse update(@AuthenticationPrincipal Long userId, @Valid @RequestBody UpdateProfileRequest req) {
        return sellers.updateProfile(userId, req);
    }
}
