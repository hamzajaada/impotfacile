const router = require('express').Router()
const adminService = require('../services/admin.service')
const { requireAdmin } = require('../middleware/auth.middleware')

router.use(requireAdmin)

router.get('/stats', async (req, res, next) => {
  try {
    res.json(await adminService.getStats())
  } catch (err) {
    next(err)
  }
})

router.get('/utilisateurs', async (req, res, next) => {
  try {
    res.json(await adminService.getAllUsers())
  } catch (err) {
    next(err)
  }
})

router.get('/declarations', async (req, res, next) => {
  try {
    res.json(await adminService.getAllDeclarations())
  } catch (err) {
    next(err)
  }
})

router.put('/declarations/:id/valider', async (req, res, next) => {
  try {
    res.json(await adminService.setStatut(req.params.id, 'VALIDEE'))
  } catch (err) {
    next(err)
  }
})

router.put('/declarations/:id/rejeter', async (req, res, next) => {
  try {
    res.json(await adminService.setStatut(req.params.id, 'REJETEE'))
  } catch (err) {
    next(err)
  }
})

module.exports = router
