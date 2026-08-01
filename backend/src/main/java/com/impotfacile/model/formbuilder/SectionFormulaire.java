package com.impotfacile.model.formbuilder;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "sections_formulaire")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SectionFormulaire {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String titre;

    @Builder.Default
    private int ordre = 0;

    @Builder.Default
    private Boolean repetable = false;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "sections_formulaire_profils",
            joinColumns = @JoinColumn(name = "section_id"))
    @Column(name = "profil")
    @Builder.Default
    private Set<String> profilsCibles = new LinkedHashSet<>();

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private FormulaireTemplate template;

    @OneToMany(mappedBy = "section", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderBy("ordre ASC")
    @Builder.Default
    private List<ChampFormulaire> champs = new ArrayList<>();
}
