package com.impotfacile.service;

import com.impotfacile.dto.*;
import com.impotfacile.exception.ApiException;
import com.impotfacile.model.identity.*;
import com.impotfacile.repository.UtilisateurRepository;
import com.impotfacile.security.JwtTokenProvider;
import com.impotfacile.security.LoginAttemptService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtProvider;
    private final LoginAttemptService loginAttemptService;

    public AuthResponse register(RegisterRequest request) {
        if (request.getRole() != null && request.getRole() != Role.CLIENT) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Role non autorise a l'inscription");
        }
        if (utilisateurRepository.existsByEmail(request.getEmail())) {
            throw new ApiException(HttpStatus.CONFLICT, "Email deja utilise");
        }

        Client client = new Client();
        client.setTelephone(request.getTelephone());
        client.setProfilFiscal(request.getProfilFiscal());
        client.setEmail(request.getEmail());
        client.setMotDePasseHash(passwordEncoder.encode(request.getPassword()));
        client.setPrenom(request.getPrenom());
        client.setNom(request.getNom());
        client.setRole(Role.CLIENT);

        utilisateurRepository.save(client);

        String token = jwtProvider.generateToken(client.getId(), client.getEmail(), client.getRole().name());
        return new AuthResponse(token, toResponse(client));
    }

    public AuthResponse login(LoginRequest request) {
        if (loginAttemptService.isBlocked(request.getEmail())) {
            throw new ApiException(HttpStatus.TOO_MANY_REQUESTS,
                    "Trop de tentatives de connexion. Reessayez dans 15 minutes.");
        }

        Utilisateur user = utilisateurRepository.findByEmail(request.getEmail()).orElse(null);
        if (user == null) {
            loginAttemptService.registerFailure(request.getEmail());
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Identifiants invalides");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getMotDePasseHash())) {
            loginAttemptService.registerFailure(request.getEmail());
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Identifiants invalides");
        }

        loginAttemptService.reset(request.getEmail());

        String token = jwtProvider.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return new AuthResponse(token, toResponse(user));
    }

    public UserResponse getProfile(String userId) {
        Utilisateur user = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Utilisateur non trouve"));
        return toResponse(user);
    }

    private UserResponse toResponse(Utilisateur user) {
        UserResponse r = new UserResponse();
        r.setId(user.getId());
        r.setEmail(user.getEmail());
        r.setPrenom(user.getPrenom());
        r.setNom(user.getNom());
        r.setRole(user.getRole());
        if (user instanceof Client c) {
            r.setTelephone(c.getTelephone());
            r.setProfilFiscal(c.getProfilFiscal());
        }
        return r;
    }
}
