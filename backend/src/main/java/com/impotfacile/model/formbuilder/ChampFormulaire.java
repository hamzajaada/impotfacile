package com.impotfacile.model.formbuilder;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "champs_formulaire")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChampFormulaire {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String label;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeChamp type;

    @Builder.Default
    private Boolean obligatoire = true;

    @Builder.Default
    private int ordre = 0;

    @Column(name = "nom_champ")
    private String nomChamp;

    @Column(length = 2000)
    private String options;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "champs_formulaire_profils",
            joinColumns = @JoinColumn(name = "champ_id"))
    @Column(name = "profil")
    @Builder.Default
    private Set<String> profilsCibles = new LinkedHashSet<>();

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private SectionFormulaire section;

    @OneToMany(mappedBy = "champ", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    private List<RegleConditionnelle> regles = new ArrayList<>();
}
