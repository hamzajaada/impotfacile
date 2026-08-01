const fs = require('fs')
const path = require('path')
const mysql = require('mysql2/promise')
const config = require('./config')

const pool = mysql.createPool({
  ...config.db,
  waitForConnections: true,
  connectionLimit: 10,
  decimalNumbers: true,
})

async function initSchema() {
  const { database, ...connOpts } = config.db
  const conn = await mysql.createConnection({ ...connOpts, multipleStatements: true })
  try {
    // cPanel : la base est creee via l'interface MySQL ; CREATE DATABASE peut etre refuse
    try {
      await conn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)
    } catch (err) {
      console.log('[ImpotFacile-Node] Base deja creee ou droits CREATE refuses, on continue.')
    }
    await conn.query(`USE \`${database}\``)
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8')
    await conn.query(schema)
  } finally {
    await conn.end()
  }
}

module.exports = { pool, initSchema }
