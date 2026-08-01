package com.impotfacile.controller;

import com.impotfacile.model.formbuilder.*;
import com.impotfacile.service.FormulaireService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/formulaires")
@RequiredArgsConstructor
public class FormulaireController {

    private final FormulaireService formulaireService;

    @GetMapping
    public ResponseEntity<List<FormulaireTemplate>> getAll() {
        return ResponseEntity.ok(formulaireService.getAllTemplates());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FormulaireTemplate> getOne(@PathVariable String id) {
        return ResponseEntity.ok(formulaireService.getTemplate(id));
    }

    @GetMapping("/actif")
    public ResponseEntity<FormulaireTemplate> getActive() {
        FormulaireTemplate template = formulaireService.getActiveTemplate();
        if (template == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(template);
    }

    @GetMapping("/annee/{annee}")
    public ResponseEntity<List<FormulaireTemplate>> getByYear(@PathVariable int annee) {
        return ResponseEntity.ok(formulaireService.getTemplatesByYear(annee));
    }

    @PostMapping
    public ResponseEntity<FormulaireTemplate> create(@RequestBody FormulaireTemplate template) {
        return ResponseEntity.ok(formulaireService.createTemplate(template));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTemplate(@PathVariable String id) {
        formulaireService.deleteTemplate(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/actif")
    public ResponseEntity<FormulaireTemplate> toggleActive(
            @PathVariable String id, @RequestParam boolean actif) {
        return ResponseEntity.ok(formulaireService.toggleActive(id, actif));
    }

    @PutMapping("/default")
    public ResponseEntity<Void> resetToDefault() {
        formulaireService.resetToDefault();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{templateId}/sections")
    public ResponseEntity<SectionFormulaire> addSection(
            @PathVariable String templateId, @RequestBody SectionFormulaire section) {
        return ResponseEntity.ok(formulaireService.addSection(templateId, section));
    }

    @PutMapping("/sections/{sectionId}")
    public ResponseEntity<SectionFormulaire> updateSection(
            @PathVariable String sectionId, @RequestBody SectionFormulaire section) {
        return ResponseEntity.ok(formulaireService.updateSection(sectionId, section));
    }

    @DeleteMapping("/sections/{sectionId}")
    public ResponseEntity<Void> deleteSection(@PathVariable String sectionId) {
        formulaireService.deleteSection(sectionId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{templateId}/sections/reorder")
    public ResponseEntity<Void> reorderSections(
            @PathVariable String templateId, @RequestBody List<String> sectionIds) {
        formulaireService.reorderSections(templateId, sectionIds);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/sections/{sectionId}/champs")
    public ResponseEntity<ChampFormulaire> addChamp(
            @PathVariable String sectionId, @RequestBody ChampFormulaire champ) {
        return ResponseEntity.ok(formulaireService.addChamp(sectionId, champ));
    }

    @PutMapping("/champs/{champId}")
    public ResponseEntity<ChampFormulaire> updateChamp(
            @PathVariable String champId, @RequestBody ChampFormulaire champ) {
        return ResponseEntity.ok(formulaireService.updateChamp(champId, champ));
    }

    @DeleteMapping("/champs/{champId}")
    public ResponseEntity<Void> deleteChamp(@PathVariable String champId) {
        formulaireService.deleteChamp(champId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/sections/{sectionId}/champs/reorder")
    public ResponseEntity<Void> reorderChamps(
            @PathVariable String sectionId, @RequestBody List<String> champIds) {
        formulaireService.reorderChamps(sectionId, champIds);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/champs/{champId}/regles")
    public ResponseEntity<List<RegleConditionnelle>> setRegles(
            @PathVariable String champId, @RequestBody List<RegleConditionnelle> regles) {
        return ResponseEntity.ok(formulaireService.setRegles(champId, regles));
    }

    @PostMapping("/champs/{champId}/regles")
    public ResponseEntity<RegleConditionnelle> addRegle(
            @PathVariable String champId, @RequestBody RegleConditionnelle regle) {
        return ResponseEntity.ok(formulaireService.addRegle(champId, regle));
    }

    @DeleteMapping("/regles/{regleId}")
    public ResponseEntity<Void> deleteRegle(@PathVariable String regleId) {
        formulaireService.deleteRegle(regleId);
        return ResponseEntity.ok().build();
    }
}
