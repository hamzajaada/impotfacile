const router = require('express').Router()
const declarationService = require('../services/declaration.service')
const { requireAuth, requireAdmin } = require('../middleware/auth.middleware')

function intParam(value, fallback) {
  const n = parseInt(value, 10)
  return Number.isNaN(n) ? fallback : n
}

router.post('/', requireAuth, async (req, res, next) => {
  try {
    res.json(await declarationService.createDeclaration(req.user.id, req.body))
  } catch (err) {
    next(err)
  }
})

router.get('/my', requireAuth, async (req, res, next) => {
  try {
    const page = intParam(req.query.page, 0)
    const size = intParam(req.query.size, 10)
    res.json(await declarationService.getClientDeclarations(req.user.id, page, size))
  } catch (err) {
    next(err)
  }
})

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    res.json(await declarationService.getOwnedDeclaration(req.params.id, req.user.id))
  } catch (err) {
    next(err)
  }
})

const STATUTS = ['EN_ATTENTE', 'VALIDEE', 'REJETEE']

router.put('/:id/statut', requireAdmin, async (req, res, next) => {
  try {
    const statut = req.query.statut
    if (!STATUTS.includes(statut)) {
      return res.status(400).json({
        timestamp: new Date().toISOString(),
        status: 400,
        error: 'Bad Request',
        message: `No enum constant com.impotfacile.model.declaration.StatutDeclaration.${statut}`,
      })
    }
    await declarationService.updateStatut(req.params.id, statut)
    res.status(200).end()
  } catch (err) {
    next(err)
  }
})

module.exports = router
