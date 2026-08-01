package com.impotfacile.model.declaration;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "personnes_a_charge")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PersonneACharge {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String nom;

    private String lienParente;

    private LocalDate dateNaissance;

    private Double revenu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "declaration_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Declaration declaration;
}
