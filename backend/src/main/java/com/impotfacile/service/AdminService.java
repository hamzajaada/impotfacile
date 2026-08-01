package com.impotfacile.service;

import com.impotfacile.dto.AdminDeclarationDto;
import com.impotfacile.dto.AdminUserDto;
import com.impotfacile.exception.ApiException;
import com.impotfacile.model.identity.Client;
import com.impotfacile.model.declaration.Declaration;
import com.impotfacile.model.declaration.StatutDeclaration;
import com.impotfacile.repository.*;
import com.impotfacile.security.EncryptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UtilisateurRepository utilisateurRepository;
    private final DeclarationRepository declarationRepository;
    private final EncryptionService encryptionService;

    public Map<String, Object> getStats() {
        return Map.of(
                "totalUtilisateurs", utilisateurRepository.count(),
                "totalDeclarations", declarationRepository.count(),
                "enAttente", declarationRepository.countByStatut(StatutDeclaration.EN_ATTENTE),
                "validees", declarationRepository.countByStatut(StatutDeclaration.VALIDEE),
                "rejetees", declarationRepository.countByStatut(StatutDeclaration.REJETEE)
        );
    }

    public List<AdminUserDto> getAllUsers() {
        return utilisateurRepository.findAll().stream()
                .map(u -> AdminUserDto.builder()
                        .id(u.getId())
                        .email(u.getEmail())
                        .prenom(u.getPrenom())
                        .nom(u.getNom())
                        .role(u.getRole())
                        .dateCreation(u.getDateCreation())
                        .build())
                .toList();
    }

    public List<AdminDeclarationDto> getAllDeclarations() {
        return declarationRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public AdminDeclarationDto validateDeclaration(String id) {
        Declaration decl = declarationRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Declaration non trouvee"));
        decl.setStatut(StatutDeclaration.VALIDEE);
        declarationRepository.save(decl);
        return toDto(decl);
    }

    @Transactional
    public AdminDeclarationDto rejectDeclaration(String id) {
        Declaration decl = declarationRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Declaration non trouvee"));
        decl.setStatut(StatutDeclaration.REJETEE);
        declarationRepository.save(decl);
        return toDto(decl);
    }

    private AdminDeclarationDto toDto(Declaration d) {
        Client client = d.getClient();
        return AdminDeclarationDto.builder()
                .id(d.getId())
                .anneeFiscale(d.getAnneeFiscale())
                .statut(d.getStatut())
                .dateSoumission(d.getDateSoumission())
                .avecConjoint(d.getAvecConjoint())
                .donneesFormulaire(encryptionService.decrypt(d.getDonneesFormulaire()))
                .clientId(client != null ? client.getId() : null)
                .clientNom(client != null ? client.getPrenom() + " " + client.getNom() : null)
                .clientEmail(client != null ? client.getEmail() : null)
                .build();
    }
}
