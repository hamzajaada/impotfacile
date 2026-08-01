package com.impotfacile.controller;

import com.impotfacile.dto.ClientDeclarationDto;
import com.impotfacile.dto.DeclarationRequest;
import com.impotfacile.service.DeclarationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/declarations")
@RequiredArgsConstructor
public class DeclarationController {

    private final DeclarationService declarationService;

    @PostMapping
    public ResponseEntity<ClientDeclarationDto> create(Authentication auth, @RequestBody DeclarationRequest request) {
        String clientId = (String) auth.getPrincipal();
        return ResponseEntity.ok(declarationService.createDeclaration(clientId, request));
    }

    @GetMapping("/my")
    public ResponseEntity<Page<ClientDeclarationDto>> getMyDeclarations(
            Authentication auth,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        String clientId = (String) auth.getPrincipal();
        return ResponseEntity.ok(declarationService.getClientDeclarations(clientId, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClientDeclarationDto> getDeclaration(@PathVariable String id, Authentication auth) {
        String clientId = (String) auth.getPrincipal();
        var decl = declarationService.getOwnedDeclaration(id, clientId);
        return ResponseEntity.ok(ClientDeclarationDto.builder()
                .id(decl.getId())
                .anneeFiscale(decl.getAnneeFiscale())
                .statut(decl.getStatut())
                .dateSoumission(decl.getDateSoumission())
                .avecConjoint(decl.getAvecConjoint())
                .build());
    }

    @PutMapping("/{id}/statut")
    public ResponseEntity<Void> updateStatut(
            @PathVariable String id,
            @RequestParam String statut) {
        declarationService.updateStatut(id,
                com.impotfacile.model.declaration.StatutDeclaration.valueOf(statut));
        return ResponseEntity.ok().build();
    }
}
