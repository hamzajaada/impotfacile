const crypto = require('crypto')
const { pool } = require('../db')
const encryption = require('../encryption')
const { toBool, formatDateTime } = require('../mappers')
const { ApiError } = require('../httpError')

function rowToDto(r) {
  return {
    id: r.id,
    anneeFiscale: r.annee_fiscale,
    statut: r.statut,
    dateSoumission: formatDateTime(r.date_soumission),
    avecConjoint: toBool(r.avec_conjoint),
    donneesFormulaire: encryption.decrypt(r.donnees_formulaire),
  }
}

async function clientExists(clientId) {
  const [rows] = await pool.query('SELECT 1 FROM clients WHERE id = ?', [clientId])
  return rows.length > 0
}

async function createDeclaration(clientId, request) {
  if (!(await clientExists(clientId))) {
    throw new ApiError(404, 'Client non trouve')
  }
  const id = crypto.randomUUID()
  const avecConjoint = !!(request.avecConjoint)
  const encrypted = encryption.encrypt(request.donneesFormulaire || null)
  await pool.query(
    `INSERT INTO declarations (id, annee_fiscale, statut, date_soumission, avec_conjoint, client_id, template_id, donnees_formulaire)
     VALUES (?,?,?,?,?,?,?,?)`,
    [id, request.anneeFiscale || 0, 'EN_ATTENTE', new Date(), avecConjoint ? 1 : 0, clientId, null, encrypted]
  )
  return {
    id,
    anneeFiscale: request.anneeFiscale || 0,
    statut: 'EN_ATTENTE',
    dateSoumission: formatDateTime(new Date()),
    avecConjoint,
    donneesFormulaire: encryption.decrypt(encrypted),
  }
}

function buildPage(content, totalElements, page, size) {
  const totalPages = size > 0 ? Math.ceil(totalElements / size) : 0
  const offset = page * size
  return {
    content,
    pageable: {
      sort: { sorted: false, unsorted: true, empty: true },
      offset,
      pageNumber: page,
      pageSize: size,
      paged: true,
      unpaged: false,
    },
    last: page >= totalPages - 1,
    totalElements,
    totalPages,
    size,
    number: page,
    sort: { sorted: false, unsorted: true, empty: true },
    first: page === 0,
    numberOfElements: content.length,
    empty: content.length === 0,
  }
}

async function getClientDeclarations(clientId, page, size) {
  const [countRows] = await pool.query('SELECT COUNT(*) AS c FROM declarations WHERE client_id = ?', [clientId])
  const totalElements = countRows[0].c
  const [rows] = await pool.query(
    'SELECT * FROM declarations WHERE client_id = ? ORDER BY id ASC LIMIT ? OFFSET ?',
    [clientId, size, page * size]
  )
  return buildPage(rows.map(rowToDto), totalElements, page, size)
}

async function getDeclaration(id) {
  const [rows] = await pool.query('SELECT * FROM declarations WHERE id = ?', [id])
  if (!rows[0]) throw new ApiError(404, 'Declaration non trouvee')
  return rows[0]
}

// GET /api/declarations/{id} — renvoie le DTO SANS donneesFormulaire (comme Spring)
async function getOwnedDeclaration(id, userId) {
  const row = await getDeclaration(id)
  if (row.client_id !== userId) {
    throw new ApiError(403, 'Acces refuse a cette declaration')
  }
  return {
    id: row.id,
    anneeFiscale: row.annee_fiscale,
    statut: row.statut,
    dateSoumission: formatDateTime(row.date_soumission),
    avecConjoint: toBool(row.avec_conjoint),
  }
}

async function updateStatut(id, statut) {
  await getDeclaration(id)
  await pool.query('UPDATE declarations SET statut = ? WHERE id = ?', [statut, id])
}

module.exports = {
  createDeclaration,
  getClientDeclarations,
  getOwnedDeclaration,
  updateStatut,
  getDeclaration,
}
