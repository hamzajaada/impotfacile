package com.impotfacile.model.formbuilder;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "formulaires_templates")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FormulaireTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private int anneeFiscale;

    @Builder.Default
    private int version = 1;

    @Builder.Default
    private Boolean actif = true;

    @OneToMany(mappedBy = "template", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderBy("ordre ASC")
    @Builder.Default
    private List<SectionFormulaire> sections = new ArrayList<>();
}
