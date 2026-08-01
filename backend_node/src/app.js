const express = require('express')
const cors = require('cors')
const config = require('./config')
const authRoutes = require('./routes/auth.routes')
const declarationsRoutes = require('./routes/declarations.routes')
const formulairesRoutes = require('./routes/formulaires.routes')
const adminRoutes = require('./routes/admin.routes')
const { extractUser } = require('./middleware/auth.middleware')
const { ApiError, ValidationError, REASON_PHRASES } = require('./httpError')

const app = express()
app.disable('x-powered-by')

app.use(
  cors({
    origin: config.corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization'],
    credentials: true,
    maxAge: 3600,
  })
)

app.use(express.json({ limit: '10mb' }))

app.use(extractUser)

app.use('/api/auth', authRoutes)
app.use('/api/declarations', declarationsRoutes)
app.use('/api/formulaires', formulairesRoutes)
app.use('/api/admin', adminRoutes)

// 404 (miroir de NoResourceFoundException -> 404 "Ressource introuvable")
app.use((req, res) => {
  res.status(404).json({
    timestamp: new Date().toISOString(),
    status: 404,
    error: 'Not Found',
    message: 'Ressource introuvable',
  })
})

// Gestion des erreurs (miroir de GlobalExceptionHandler.java)
app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(400).json({
      timestamp: new Date().toISOString(),
      status: 400,
      error: 'Validation echouee',
      fields: err.fields,
    })
  }
  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({
      timestamp: new Date().toISOString(),
      status: 400,
      error: 'Bad Request',
      message: 'Corps de requete invalide',
    })
  }
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      timestamp: new Date().toISOString(),
      status: err.status,
      error: REASON_PHRASES[err.status] || 'Error',
      message: err.message,
    })
  }
  console.error('[ImpotFacile-Node] Erreur interne:', err)
  res.status(500).json({
    timestamp: new Date().toISOString(),
    status: 500,
    error: 'Internal Server Error',
    message: 'Une erreur interne est survenue',
  })
})

module.exports = app
