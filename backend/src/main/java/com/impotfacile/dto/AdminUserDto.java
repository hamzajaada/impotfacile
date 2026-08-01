package com.impotfacile.dto;

import com.impotfacile.model.identity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserDto {
    private String id;
    private String email;
    private String prenom;
    private String nom;
    private Role role;
    private LocalDateTime dateCreation;
}
