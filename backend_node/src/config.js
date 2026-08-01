require('dotenv').config()

function int(value, fallback) {
  const n = parseInt(value, 10)
  return Number.isNaN(n) ? fallback : n
}

module.exports = {
  port: int(process.env.PORT, 8080),
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: int(process.env.DB_PORT, 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'impotfacile',
    charset: 'utf8mb4',
  },
  jwtSecret: process.env.JWT_SECRET || 'impotfacile-2026-super-secret-key-required-32-bytes-minimum!',
  jwtExpirationMs: int(process.env.JWT_EXPIRATION_MS, 86400000),
  jwtIssuer: process.env.JWT_ISSUER || 'impotfacile',
  encryptionKey: process.env.APP_ENCRYPTION_KEY || '8qEzHxrYddOlPSVtRVL9zr/hcaedLBcYJYnBTa9vDKE=',
  corsOrigins: (process.env.APP_CORS_ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:3001')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
}
