package com.impotfacile.repository;

import com.impotfacile.model.identity.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, String> {
}
