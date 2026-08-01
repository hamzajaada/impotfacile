package com.impotfacile.model.declaration;

import com.impotfacile.model.identity.Client;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "declarations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Declaration {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private int anneeFiscale;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private StatutDeclaration statut = StatutDeclaration.EN_ATTENTE;

    @Column(nullable = false)
    private LocalDateTime dateSoumission;

    @Builder.Default
    private Boolean avecConjoint = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Client client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private com.impotfacile.model.formbuilder.FormulaireTemplate template;

    @OneToMany(mappedBy = "declaration", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<ReponseChamp> reponses = new ArrayList<>();

    @OneToMany(mappedBy = "declaration", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<PersonneACharge> personnesACharge = new ArrayList<>();

    @OneToMany(mappedBy = "declaration", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Document> documents = new ArrayList<>();

    @Column(columnDefinition = "LONGTEXT")
    private String donneesFormulaire;
}
