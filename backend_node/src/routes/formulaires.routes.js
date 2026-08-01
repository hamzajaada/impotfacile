const router = require('express').Router()
const formulaireService = require('../services/formulaire.service')
const { requireAdmin } = require('../middleware/auth.middleware')

function parseBool(value) {
  return value === 'true' || value === true || value === 1 || value === '1'
}

// --- Lecture publique ---
router.get('/', async (req, res, next) => {
  try {
    res.json(await formulaireService.getAllTemplates())
  } catch (err) {
    next(err)
  }
})

router.get('/actif', async (req, res, next) => {
  try {
    const template = await formulaireService.getActiveTemplate()
    if (!template) return res.status(204).end()
    res.json(template)
  } catch (err) {
    next(err)
  }
})

router.get('/annee/:annee', async (req, res, next) => {
  try {
    res.json(await formulaireService.getTemplatesByYear(parseInt(req.params.annee, 10)))
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    res.json(await formulaireService.getTemplate(req.params.id))
  } catch (err) {
    next(err)
  }
})

// --- Administration (ADMINISTRATEUR uniquement) ---
router.post('/', requireAdmin, async (req, res, next) => {
  try {
    res.json(await formulaireService.createTemplate(req.body))
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    await formulaireService.deleteTemplate(req.params.id)
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

router.put('/default', requireAdmin, async (req, res, next) => {
  try {
    await formulaireService.resetToDefault()
    res.status(200).end()
  } catch (err) {
    next(err)
  }
})

router.put('/:id/actif', requireAdmin, async (req, res, next) => {
  try {
    res.json(await formulaireService.toggleActive(req.params.id, parseBool(req.query.actif)))
  } catch (err) {
    next(err)
  }
})

// Sections
router.post('/:templateId/sections', requireAdmin, async (req, res, next) => {
  try {
    res.json(await formulaireService.addSection(req.params.templateId, req.body))
  } catch (err) {
    next(err)
  }
})

router.put('/sections/:sectionId', requireAdmin, async (req, res, next) => {
  try {
    res.json(await formulaireService.updateSection(req.params.sectionId, req.body))
  } catch (err) {
    next(err)
  }
})

router.delete('/sections/:sectionId', requireAdmin, async (req, res, next) => {
  try {
    await formulaireService.deleteSection(req.params.sectionId)
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

router.put('/:templateId/sections/reorder', requireAdmin, async (req, res, next) => {
  try {
    await formulaireService.reorderSections(req.body)
    res.status(200).end()
  } catch (err) {
    next(err)
  }
})

// Champs
router.post('/sections/:sectionId/champs', requireAdmin, async (req, res, next) => {
  try {
    res.json(await formulaireService.addChamp(req.params.sectionId, req.body))
  } catch (err) {
    next(err)
  }
})

router.put('/champs/:champId', requireAdmin, async (req, res, next) => {
  try {
    res.json(await formulaireService.updateChamp(req.params.champId, req.body))
  } catch (err) {
    next(err)
  }
})

router.delete('/champs/:champId', requireAdmin, async (req, res, next) => {
  try {
    await formulaireService.deleteChamp(req.params.champId)
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

router.put('/sections/:sectionId/champs/reorder', requireAdmin, async (req, res, next) => {
  try {
    await formulaireService.reorderChamps(req.body)
    res.status(200).end()
  } catch (err) {
    next(err)
  }
})

// Regles
router.put('/champs/:champId/regles', requireAdmin, async (req, res, next) => {
  try {
    res.json(await formulaireService.setRegles(req.params.champId, req.body))
  } catch (err) {
    next(err)
  }
})

router.post('/champs/:champId/regles', requireAdmin, async (req, res, next) => {
  try {
    res.json(await formulaireService.addRegle(req.params.champId, req.body))
  } catch (err) {
    next(err)
  }
})

router.delete('/regles/:regleId', requireAdmin, async (req, res, next) => {
  try {
    await formulaireService.deleteRegle(req.params.regleId)
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

module.exports = router
