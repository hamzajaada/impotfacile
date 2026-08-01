package com.impotfacile.repository;

import com.impotfacile.model.formbuilder.SectionFormulaire;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SectionFormulaireRepository extends JpaRepository<SectionFormulaire, String> {
    List<SectionFormulaire> findByTemplateIdOrderByOrdreAsc(String templateId);
}
