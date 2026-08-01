package com.impotfacile.dto;

import com.impotfacile.model.declaration.StatutDeclaration;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientDeclarationDto {
    private String id;
    private int anneeFiscale;
    private StatutDeclaration statut;
    private LocalDateTime dateSoumission;
    private Boolean avecConjoint;
    private String donneesFormulaire;
}
