package com.impotfacile.dto;

import com.impotfacile.model.identity.Role;
import lombok.Data;

@Data
public class UserResponse {
    private String id;
    private String email;
    private String prenom;
    private String nom;
    private Role role;
    private String telephone;
    private String profilFiscal;
}
