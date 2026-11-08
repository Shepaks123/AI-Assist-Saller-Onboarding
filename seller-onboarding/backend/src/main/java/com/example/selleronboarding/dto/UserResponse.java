package com.example.selleronboarding.dto;

import com.example.selleronboarding.entity.User;

public record UserResponse(Long id, String email, String fullName) {
    public static UserResponse from(User u) { return new UserResponse(u.getId(), u.getEmail(), u.getFullName()); }
}
