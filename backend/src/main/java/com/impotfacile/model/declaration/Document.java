package com.impotfacile.model.declaration;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String nomFichier;

    @Column(nullable = false)
    private String cheminFichier;

    private String contentType;

    private Long taille;

    @Builder.Default
    private LocalDateTime dateUpload = LocalDateTime.now();

    @Builder.Default
    private Boolean verifie = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "declaration_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Declaration declaration;
}
