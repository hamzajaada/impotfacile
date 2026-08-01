package com.impotfacile.dto;

import lombok.Data;

@Data
public class PersonneAChargeDto {
    private String nom;
    private String lienParente;
    private String dateNaissance;
    private Double revenu;
}
