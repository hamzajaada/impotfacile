const router = require('express').Router()
const authService = require('../services/auth.service')
const { requireAuth } = require('../middleware/auth.middleware')

router.post('/register', async (req, res, next) => {
  try {
    res.json(await authService.register(req.body))
  } catch (err) {
    next(err)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    res.json(await authService.login(req.body))
  } catch (err) {
    next(err)
  }
})

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    res.json(await authService.getProfile(req.user.id))
  } catch (err) {
    next(err)
  }
})

module.exports = router
