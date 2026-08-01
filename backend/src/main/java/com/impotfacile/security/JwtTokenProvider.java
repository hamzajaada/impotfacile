package com.impotfacile.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final SecretKey key;
    private final long expiration;
    private final String issuer;

    public JwtTokenProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long expiration,
            @Value("${jwt.issuer:impotfacile}") String issuer) {
        if (secret == null || secret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalStateException(
                    "Le secret JWT doit contenir au moins 32 octets (HMAC-SHA256). Configurez la variable JWT_SECRET.");
        }
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expiration = expiration;
        this.issuer = issuer;
    }

    public String generateToken(String userId, String email, String role) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);
        return Jwts.builder()
                .subject(userId)
                .issuer(issuer)
                .claim("email", email)
                .claim("role", role)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }

    public String getUserIdFromToken(String token) {
        return parser().parseSignedClaims(token).getPayload().getSubject();
    }

    public String getRoleFromToken(String token) {
        return parser().parseSignedClaims(token).getPayload().get("role", String.class);
    }

    public boolean validateToken(String token) {
        try {
            parser().parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private JwtParser parser() {
        return Jwts.parser().requireIssuer(issuer).verifyWith(key).build();
    }
}
