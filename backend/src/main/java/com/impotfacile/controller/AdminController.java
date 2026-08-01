package com.impotfacile.controller;

import com.impotfacile.dto.AdminDeclarationDto;
import com.impotfacile.dto.AdminUserDto;
import com.impotfacile.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    @GetMapping("/utilisateurs")
    public ResponseEntity<List<AdminUserDto>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/declarations")
    public ResponseEntity<List<AdminDeclarationDto>> getAllDeclarations() {
        return ResponseEntity.ok(adminService.getAllDeclarations());
    }

    @PutMapping("/declarations/{id}/valider")
    public ResponseEntity<AdminDeclarationDto> validateDeclaration(@PathVariable String id) {
        return ResponseEntity.ok(adminService.validateDeclaration(id));
    }

    @PutMapping("/declarations/{id}/rejeter")
    public ResponseEntity<AdminDeclarationDto> rejectDeclaration(@PathVariable String id) {
        return ResponseEntity.ok(adminService.rejectDeclaration(id));
    }
}
