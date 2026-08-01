package com.impotfacile.repository;

import com.impotfacile.model.formbuilder.ChampFormulaire;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChampFormulaireRepository extends JpaRepository<ChampFormulaire, String> {
    List<ChampFormulaire> findBySectionIdOrderByOrdreAsc(String sectionId);
}
