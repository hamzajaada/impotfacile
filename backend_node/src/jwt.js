const jwt = require('jsonwebtoken')
const config = require('./config')

function generateToken(userId, email, role) {
  return jwt.sign(
    { email, role },
    config.jwtSecret,
    {
      subject: userId,
      issuer: config.jwtIssuer,
      expiresIn: Math.floor(config.jwtExpirationMs / 1000),
    }
  )
}

function parseToken(token) {
  try {
    return jwt.verify(token, config.jwtSecret, { issuer: config.jwtIssuer })
  } catch {
    return null
  }
}

module.exports = { generateToken, parseToken }
