package com.impotfacile.service;

import com.impotfacile.model.formbuilder.*;
import com.impotfacile.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FormulaireService {

    private final FormulaireTemplateRepository templateRepository;
    private final SectionFormulaireRepository sectionRepository;
    private final ChampFormulaireRepository champRepository;
    private final RegleConditionnelleRepository regleRepository;

    public List<FormulaireTemplate> getAllTemplates() {
        return templateRepository.findAll();
    }

    public FormulaireTemplate getTemplate(String id) {
        return templateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Template non trouve"));
    }

    public List<FormulaireTemplate> getTemplatesByYear(int anneeFiscale) {
        return templateRepository.findByAnneeFiscaleAndActifTrue(anneeFiscale);
    }

    public FormulaireTemplate getActiveTemplate() {
        List<FormulaireTemplate> actifs = templateRepository.findByActifTrue();
        return actifs.isEmpty() ? null : actifs.get(0);
    }

    @Transactional
    public FormulaireTemplate createTemplate(FormulaireTemplate template) {
        return templateRepository.save(template);
    }

    @Transactional
    public void deleteTemplate(String id) {
        templateRepository.deleteById(id);
    }

    @Transactional
    public FormulaireTemplate toggleActive(String id, boolean actif) {
        if (actif) {
            for (FormulaireTemplate t : templateRepository.findAll()) {
                if (Boolean.TRUE.equals(t.getActif())) {
                    t.setActif(false);
                    templateRepository.save(t);
                }
            }
        }
        FormulaireTemplate template = getTemplate(id);
        template.setActif(actif);
        return templateRepository.save(template);
    }

    @Transactional
    public void resetToDefault() {
        for (FormulaireTemplate t : templateRepository.findAll()) {
            if (Boolean.TRUE.equals(t.getActif())) {
                t.setActif(false);
                templateRepository.save(t);
            }
        }
    }

    // --- Sections ---

    @Transactional
    public SectionFormulaire addSection(String templateId, SectionFormulaire section) {
        FormulaireTemplate template = getTemplate(templateId);
        if (section.getProfilsCibles() == null) {
            section.setProfilsCibles(new java.util.LinkedHashSet<>());
        }
        section.setTemplate(template);
        return sectionRepository.save(section);
    }

    @Transactional
    public SectionFormulaire updateSection(String sectionId, SectionFormulaire data) {
        SectionFormulaire section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new RuntimeException("Section non trouvee"));
        section.setTitre(data.getTitre());
        section.setRepetable(data.getRepetable());
        section.setOrdre(data.getOrdre());
        section.setProfilsCibles(data.getProfilsCibles() == null
                ? new java.util.LinkedHashSet<>() : data.getProfilsCibles());
        return sectionRepository.save(section);
    }

    @Transactional
    public void deleteSection(String sectionId) {
        sectionRepository.deleteById(sectionId);
    }

    @Transactional
    public void reorderSections(String templateId, List<String> sectionIds) {
        for (int i = 0; i < sectionIds.size(); i++) {
            int ordre = i;
            String sectionId = sectionIds.get(i);
            SectionFormulaire section = sectionRepository.findById(sectionId)
                    .orElseThrow(() -> new RuntimeException("Section non trouvee: " + sectionId));
            section.setOrdre(ordre);
            sectionRepository.save(section);
        }
    }

    // --- Champs ---

    @Transactional
    public ChampFormulaire addChamp(String sectionId, ChampFormulaire champ) {
        SectionFormulaire section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new RuntimeException("Section non trouvee"));
        if (champ.getProfilsCibles() == null) {
            champ.setProfilsCibles(new java.util.LinkedHashSet<>());
        }
        champ.setSection(section);
        return champRepository.save(champ);
    }

    @Transactional
    public ChampFormulaire updateChamp(String champId, ChampFormulaire data) {
        ChampFormulaire champ = champRepository.findById(champId)
                .orElseThrow(() -> new RuntimeException("Champ non trouve"));
        champ.setLabel(data.getLabel());
        champ.setType(data.getType());
        champ.setObligatoire(data.getObligatoire());
        champ.setNomChamp(data.getNomChamp());
        champ.setOptions(data.getOptions());
        champ.setOrdre(data.getOrdre());
        champ.setProfilsCibles(data.getProfilsCibles() == null
                ? new java.util.LinkedHashSet<>() : data.getProfilsCibles());
        return champRepository.save(champ);
    }

    @Transactional
    public void deleteChamp(String champId) {
        champRepository.deleteById(champId);
    }

    @Transactional
    public void reorderChamps(String sectionId, List<String> champIds) {
        for (int i = 0; i < champIds.size(); i++) {
            int ordre = i;
            String champId = champIds.get(i);
            ChampFormulaire champ = champRepository.findById(champId)
                    .orElseThrow(() -> new RuntimeException("Champ non trouve: " + champId));
            champ.setOrdre(ordre);
            champRepository.save(champ);
        }
    }

    // --- Regles ---

    @Transactional
    public List<RegleConditionnelle> setRegles(String champId, List<RegleConditionnelle> regles) {
        ChampFormulaire champ = champRepository.findById(champId)
                .orElseThrow(() -> new RuntimeException("Champ non trouve"));
        champ.getRegles().clear();
        for (RegleConditionnelle regle : regles) {
            regle.setChamp(champ);
            champ.getRegles().add(regle);
        }
        champRepository.save(champ);
        return regles;
    }

    @Transactional
    public RegleConditionnelle addRegle(String champId, RegleConditionnelle regle) {
        ChampFormulaire champ = champRepository.findById(champId)
                .orElseThrow(() -> new RuntimeException("Champ non trouve"));
        regle.setChamp(champ);
        champ.getRegles().add(regle);
        champRepository.save(champ);
        return regle;
    }

    @Transactional
    public void deleteRegle(String regleId) {
        regleRepository.deleteById(regleId);
    }
}
