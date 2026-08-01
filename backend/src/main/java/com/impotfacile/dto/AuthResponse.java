package com.impotfacile.dto;

import com.impotfacile.model.identity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private UserResponse user;
}
