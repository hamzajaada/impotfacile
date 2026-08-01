package com.impotfacile.security;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class LoginAttemptService {

    public static final int MAX_ATTEMPTS = 5;
    private static final long LOCK_MINUTES = 15;

    private final Map<String, Attempt> attempts = new ConcurrentHashMap<>();

    public boolean isBlocked(String email) {
        Attempt attempt = attempts.get(normalize(email));
        if (attempt == null) return false;
        if (attempt.failures >= MAX_ATTEMPTS) {
            if (Instant.now().isBefore(attempt.blockedUntil)) {
                return true;
            }
            attempts.remove(normalize(email));
        }
        return false;
    }

    public void registerFailure(String email) {
        Attempt attempt = attempts.computeIfAbsent(normalize(email), k -> new Attempt());
        attempt.failures++;
        if (attempt.failures >= MAX_ATTEMPTS) {
            attempt.blockedUntil = Instant.now().plusSeconds(LOCK_MINUTES * 60);
        }
    }

    public void reset(String email) {
        attempts.remove(normalize(email));
    }

    private String normalize(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    private static class Attempt {
        int failures;
        Instant blockedUntil;
    }
}
