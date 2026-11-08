package com.example.selleronboarding.service;

import com.example.selleronboarding.dto.UpdateProfileRequest;
import com.example.selleronboarding.dto.UserResponse;
import com.example.selleronboarding.entity.User;
import com.example.selleronboarding.exception.ApiException;
import com.example.selleronboarding.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SellerService {

    private final UserRepository users;

    public SellerService(UserRepository users) { this.users = users; }

    @Transactional(readOnly = true)
    public UserResponse getProfile(Long userId) { return UserResponse.from(find(userId)); }

    @Transactional
    public UserResponse updateProfile(Long userId, UpdateProfileRequest req) {
        User user = find(userId);
        user.setFullName(req.fullName().trim());
        return UserResponse.from(users.save(user));
    }

    private User find(Long userId) {
        return users.findById(userId).orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Your session expired. Please log in again."));
    }
}
