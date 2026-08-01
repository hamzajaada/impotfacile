package com.impotfacile.repository;

import com.impotfacile.model.declaration.Declaration;
import com.impotfacile.model.declaration.StatutDeclaration;
import com.impotfacile.model.identity.Client;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DeclarationRepository extends JpaRepository<Declaration, String> {
    Page<Declaration> findByClient(Client client, Pageable pageable);
    List<Declaration> findByStatut(StatutDeclaration statut);
    long countByStatut(StatutDeclaration statut);
}
