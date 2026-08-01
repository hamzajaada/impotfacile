package com.impotfacile.repository;

import com.impotfacile.model.formbuilder.FormulaireTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FormulaireTemplateRepository extends JpaRepository<FormulaireTemplate, String> {
    List<FormulaireTemplate> findByAnneeFiscaleAndActifTrue(int anneeFiscale);
    List<FormulaireTemplate> findByActifTrue();
}
