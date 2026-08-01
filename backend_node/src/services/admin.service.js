const { pool } = require('../db')
const encryption = require('../encryption')
const { toBool, formatDateTime } = require('../mappers')
const { ApiError } = require('../httpError')

const DECLARATION_SELECT = `
  SELECT d.*, u.prenom AS clientPrenom, u.nom AS clientNom, u.email AS clientEmail
  FROM declarations d
  LEFT JOIN utilisateurs u ON u.id = d.client_id
`

function declToDto(r) {
  return {
    id: r.id,
    anneeFiscale: r.annee_fiscale,
    statut: r.statut,
    dateSoumission: formatDateTime(r.date_soumission),
    avecConjoint: toBool(r.avec_conjoint),
    donneesFormulaire: encryption.decrypt(r.donnees_formulaire),
    clientId: r.client_id,
    clientNom: r.clientPrenom && r.clientNom ? `${r.clientPrenom} ${r.clientNom}` : null,
    clientEmail: r.clientEmail,
  }
}

async function getStats() {
  const [[{ c: totalUtilisateurs }]] = await pool.query('SELECT COUNT(*) AS c FROM utilisateurs')
  const [[{ c: totalDeclarations }]] = await pool.query('SELECT COUNT(*) AS c FROM declarations')
  const [[{ c: enAttente }]] = await pool.query("SELECT COUNT(*) AS c FROM declarations WHERE statut = 'EN_ATTENTE'")
  const [[{ c: validees }]] = await pool.query("SELECT COUNT(*) AS c FROM declarations WHERE statut = 'VALIDEE'")
  const [[{ c: rejetees }]] = await pool.query("SELECT COUNT(*) AS c FROM declarations WHERE statut = 'REJETEE'")
  return { totalUtilisateurs, totalDeclarations, enAttente, validees, rejetees }
}

async function getAllUsers() {
  const [rows] = await pool.query(
    'SELECT id, email, prenom, nom, role, date_creation AS dateCreation FROM utilisateurs ORDER BY date_creation ASC'
  )
  return rows.map((r) => ({
    id: r.id,
    email: r.email,
    prenom: r.prenom,
    nom: r.nom,
    role: r.role,
    dateCreation: formatDateTime(r.dateCreation),
  }))
}

async function getAllDeclarations() {
  const [rows] = await pool.query(`${DECLARATION_SELECT} ORDER BY d.id ASC`)
  return rows.map(declToDto)
}

async function setStatut(id, statut) {
  const [rows] = await pool.query(`${DECLARATION_SELECT} WHERE d.id = ?`, [id])
  if (!rows[0]) throw new ApiError(404, 'Declaration non trouvee')
  await pool.query('UPDATE declarations SET statut = ? WHERE id = ?', [statut, id])
  const [updated] = await pool.query(`${DECLARATION_SELECT} WHERE d.id = ?`, [id])
  return declToDto(updated[0])
}

module.exports = { getStats, getAllUsers, getAllDeclarations, setStatut }
