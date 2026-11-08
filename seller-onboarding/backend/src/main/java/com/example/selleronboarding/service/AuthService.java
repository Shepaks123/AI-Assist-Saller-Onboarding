package com.example.selleronboarding.service;

import com.example.selleronboarding.dto.AuthResponse;
import com.example.selleronboarding.dto.LoginRequest;
import com.example.selleronboarding.dto.RegisterRequest;
import com.example.selleronboarding.dto.UserResponse;
import com.example.selleronboarding.entity.User;
import com.example.selleronboarding.exception.ApiException;
import com.example.selleronboarding.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthService(UserRepository users, PasswordEncoder encoder, JwtService jwt) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        String email = req.email().trim().toLowerCase();
        if (users.existsByEmail(email)) {
            throw new ApiException(HttpStatus.CONFLICT, "An account with this email already exists.");
        }
        User user = new User();
        user.setEmail(email);
        user.setFullName(req.fullName().trim());
        user.setPasswordHash(encoder.encode(req.password()));
        users.save(user);
        return new AuthResponse(jwt.generate(user), UserResponse.from(user));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest req) {
        User user = users.findByEmail(req.email().trim().toLowerCase())
                .filter(u -> encoder.matches(req.password(), u.getPasswordHash()))
                // Same message for "no such email" and "wrong password" on purpose.
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Incorrect email or password."));
        return new AuthResponse(jwt.generate(user), UserResponse.from(user));
    }
}
