package com.impotfacile.model.formbuilder;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "regles_conditionnelles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegleConditionnelle {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String champCible;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeRegle typeRegle;

    @Column(nullable = false)
    private String valeurAttendue;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "champ_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private ChampFormulaire champ;
}
