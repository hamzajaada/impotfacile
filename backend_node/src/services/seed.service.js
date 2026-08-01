const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { pool } = require('../db')

// Miroir de DataInitializer.java (Spring) : cree l'admin par defaut si absent
async function seedAdmin() {
  const [rows] = await pool.query('SELECT id FROM utilisateurs WHERE email = ?', ['admin@impotfacile.com'])
  if (rows.length > 0) return
  const id = crypto.randomUUID()
  const hash = await bcrypt.hash('admin123', 10)
  await pool.query(
    'INSERT INTO utilisateurs (id, email, mot_de_passe_hash, role, prenom, nom, date_creation) VALUES (?,?,?,?,?,?,?)',
    [id, 'admin@impotfacile.com', hash, 'ADMINISTRATEUR', 'Admin', 'Systeme', new Date()]
  )
  await pool.query('INSERT INTO administrateurs (id) VALUES (?)', [id])
  console.log('[ImpotFacile-Node] Admin cree: admin@impotfacile.com / admin123')
}

module.exports = { seedAdmin }
