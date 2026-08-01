package com.impotfacile.config;

import com.impotfacile.model.identity.Administrateur;
import com.impotfacile.model.identity.Role;
import com.impotfacile.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!utilisateurRepository.existsByEmail("admin@impotfacile.com")) {
            Administrateur admin = new Administrateur();
            admin.setEmail("admin@impotfacile.com");
            admin.setMotDePasseHash(passwordEncoder.encode("admin123"));
            admin.setPrenom("Admin");
            admin.setNom("Systeme");
            admin.setRole(Role.ADMINISTRATEUR);
            utilisateurRepository.save(admin);
            log.info("Admin cree: admin@impotfacile.com / admin123");
        }
    }
}
