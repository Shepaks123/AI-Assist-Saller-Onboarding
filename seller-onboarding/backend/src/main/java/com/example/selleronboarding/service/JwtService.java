package com.example.selleronboarding.service;

import com.example.selleronboarding.entity.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/** Creates and checks login tokens (JWT). The secret comes from JWT_SECRET in backend/.env. */
@Service
public class JwtService {

    private final String secret;
    private final Duration lifetime;
    private SecretKey key;

    public JwtService(@Value("${app.jwt.secret}") String secret,
                      @Value("${app.jwt.expiration-minutes}") long minutes) {
        this.secret = secret;
        this.lifetime = Duration.ofMinutes(minutes);
    }

    @PostConstruct
    void init() {
        if (secret == null || secret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalStateException("JWT_SECRET must be at least 32 characters. Set it in backend/.env");
        }
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generate(User user) {
        Date now = new Date();
        return Jwts.builder()
                .subject(String.valueOf(user.getId()))
                .claim("email", user.getEmail())
                .issuedAt(now)
                .expiration(new Date(now.getTime() + lifetime.toMillis()))
                .signWith(key)
                .compact();
    }

    /** Throws JwtException if the token is invalid or expired. */
    public Long parseUserId(String token) {
        String subject = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().getSubject();
        return Long.valueOf(subject);
    }
}
