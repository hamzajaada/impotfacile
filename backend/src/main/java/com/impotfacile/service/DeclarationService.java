package com.impotfacile.service;

import com.impotfacile.dto.ClientDeclarationDto;
import com.impotfacile.dto.DeclarationRequest;
import com.impotfacile.exception.ApiException;
import com.impotfacile.model.declaration.*;
import com.impotfacile.model.identity.Client;
import com.impotfacile.repository.*;
import com.impotfacile.security.EncryptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DeclarationService {

    private final DeclarationRepository declarationRepository;
    private final ClientRepository clientRepository;
    private final EncryptionService encryptionService;

    public ClientDeclarationDto createDeclaration(String clientId, DeclarationRequest request) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Client non trouve"));

        Declaration decl = Declaration.builder()
                .client(client)
                .anneeFiscale(request.getAnneeFiscale())
                .avecConjoint(request.getAvecConjoint() != null && request.getAvecConjoint())
                .statut(StatutDeclaration.EN_ATTENTE)
                .dateSoumission(LocalDateTime.now())
                .donneesFormulaire(encryptionService.encrypt(request.getDonneesFormulaire()))
                .build();

        Declaration saved = declarationRepository.save(decl);
        return toDto(saved);
    }

    public Page<ClientDeclarationDto> getClientDeclarations(String clientId, int page, int size) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Client non trouve"));
        return declarationRepository.findByClient(client, PageRequest.of(page, size))
                .map(this::toDto);
    }

    public Declaration getDeclaration(String id) {
        return declarationRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Declaration non trouvee"));
    }

    public Declaration getOwnedDeclaration(String id, String userId) {
        Declaration decl = getDeclaration(id);
        if (!decl.getClient().getId().equals(userId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Acces refuse a cette declaration");
        }
        return decl;
    }

    @Transactional
    public Declaration updateStatut(String id, StatutDeclaration statut) {
        Declaration decl = getDeclaration(id);
        decl.setStatut(statut);
        return declarationRepository.save(decl);
    }

    private ClientDeclarationDto toDto(Declaration d) {
        return ClientDeclarationDto.builder()
                .id(d.getId())
                .anneeFiscale(d.getAnneeFiscale())
                .statut(d.getStatut())
                .dateSoumission(d.getDateSoumission())
                .avecConjoint(d.getAvecConjoint())
                .donneesFormulaire(encryptionService.decrypt(d.getDonneesFormulaire()))
                .build();
    }
}
