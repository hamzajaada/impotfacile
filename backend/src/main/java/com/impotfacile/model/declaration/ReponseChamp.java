package com.impotfacile.model.declaration;

import com.impotfacile.model.formbuilder.ChampFormulaire;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reponses_champs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReponseChamp {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(length = 5000)
    private String valeur;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "declaration_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Declaration declaration;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "champ_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private ChampFormulaire champ;
}
