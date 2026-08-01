const config = require('./config')
const { initSchema } = require('./db')
const app = require('./app')
const { seedAdmin } = require('./services/seed.service')

async function start() {
  try {
    await initSchema()
    await seedAdmin()
    app.listen(config.port, () => {
      console.log(`[ImpotFacile-Node] API ecoute sur le port ${config.port}`)
    })
  } catch (err) {
    console.error('[ImpotFacile-Node] Erreur au demarrage:', err)
    process.exit(1)
  }
}

start()
