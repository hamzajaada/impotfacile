package com.impotfacile.model.identity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "utilisateurs")
@Inheritance(strategy = InheritanceType.JOINED)
@Data
@NoArgsConstructor
public abstract class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String motDePasseHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private String prenom;
    private String nom;

    @Column(nullable = false)
    private java.time.LocalDateTime dateCreation;

    @PrePersist
    protected void onCreate() {
        dateCreation = java.time.LocalDateTime.now();
    }
}
