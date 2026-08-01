package com.impotfacile.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class DeclarationRequest {
    private int anneeFiscale;
    private Boolean avecConjoint;
    private String donneesFormulaire;
    private Map<String, String> reponses;
    private List<PersonneAChargeDto> personnesACharge;
}
