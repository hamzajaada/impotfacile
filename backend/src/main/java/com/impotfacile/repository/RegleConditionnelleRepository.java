package com.impotfacile.repository;

import com.impotfacile.model.formbuilder.RegleConditionnelle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RegleConditionnelleRepository extends JpaRepository<RegleConditionnelle, String> {
    List<RegleConditionnelle> findByChampId(String champId);
    void deleteByChampId(String champId);
}
