const { parseToken } = require('../jwt')

function iso() {
  return new Date().toISOString()
}

function unauthorized(res) {
  return res.status(401).json({
    timestamp: iso(),
    status: 401,
    error: 'Non authentifie',
    message: 'Veuillez vous connecter',
  })
}

function forbidden(res) {
  return res.status(403).json({
    timestamp: iso(),
    status: 403,
    error: 'Acces refuse',
    message: "Vous n'avez pas les droits necessaires",
  })
}

// Resout req.user si un Bearer token valide est present (miroir de JwtAuthenticationFilter)
function extractUser(req, res, next) {
  const header = req.headers.authorization || ''
  if (header.startsWith('Bearer ')) {
    const payload = parseToken(header.slice(7))
    if (payload && payload.sub) {
      req.user = { id: payload.sub, email: payload.email, role: payload.role }
    }
  }
  next()
}

function requireAuth(req, res, next) {
  if (!req.user) return unauthorized(res)
  next()
}

function requireAdmin(req, res, next) {
  if (!req.user) return unauthorized(res)
  if (req.user.role !== 'ADMINISTRATEUR') return forbidden(res)
  next()
}

module.exports = { extractUser, requireAuth, requireAdmin }
