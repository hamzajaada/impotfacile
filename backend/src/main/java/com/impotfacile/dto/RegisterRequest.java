package com.impotfacile.dto;

import com.impotfacile.model.identity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank @Email
    private String email;
    @NotBlank @Size(min = 8)
    private String password;
    @NotBlank
    private String prenom;
    @NotBlank
    private String nom;
    private Role role = Role.CLIENT;
    private String telephone;
    private String profilFiscal;
}
