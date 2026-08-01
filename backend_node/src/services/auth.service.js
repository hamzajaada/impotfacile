const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { pool } = require('../db')
const jwt = require('../jwt')
const loginAttempts = require('../loginAttempts')
const { ApiError, ValidationError } = require('../httpError')

const USER_WITH_CLIENT_SQL = `
  SELECT u.id, u.email, u.mot_de_passe_hash AS motDePasseHash, u.role, u.prenom, u.nom,
         u.date_creation AS dateCreation, c.telephone, c.profil_fiscal AS profilFiscal,
         a.id AS adminId
  FROM utilisateurs u
  LEFT JOIN clients c ON c.id = u.id
  LEFT JOIN administrateurs a ON a.id = u.id
`

async function findUserByEmail(email) {
  const [rows] = await pool.query(`${USER_WITH_CLIENT_SQL} WHERE u.email = ?`, [email])
  return rows[0] || null
}

async function findUserById(id) {
  const [rows] = await pool.query(`${USER_WITH_CLIENT_SQL} WHERE u.id = ?`, [id])
  return rows[0] || null
}

function isClient(user) {
  return user.adminId == null
}

function toResponse(u) {
  const client = isClient(u)
  return {
    id: u.id,
    email: u.email,
    prenom: u.prenom,
    nom: u.nom,
    role: u.role,
    telephone: client ? u.telephone : null,
    profilFiscal: client ? u.profilFiscal : null,
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateEmail(body, fields) {
  const value = body.email
  if (value === undefined || value === null || String(value).trim() === '') {
    fields.email = 'must not be blank'
  } else if (typeof value !== 'string' || !EMAIL_RE.test(value)) {
    fields.email = 'must be a well-formed email address'
  }
}

function validatePassword(body, fields) {
  const value = body.password
  if (value === undefined || value === null || value === '') {
    fields.password = 'must not be blank'
  } else if (typeof value !== 'string' || value.length < 8) {
    fields.password = 'size must be between 8 and 2147483647'
  }
}

function validateRequired(value, field, fields) {
  if (value === undefined || value === null || String(value).trim() === '') {
    fields[field] = 'must not be blank'
  }
}

async function register(body) {
  const fields = {}
  validateEmail(body, fields)
  validatePassword(body, fields)
  validateRequired(body.prenom, 'prenom', fields)
  validateRequired(body.nom, 'nom', fields)
  if (Object.keys(fields).length) throw new ValidationError(fields)

  if (body.role === 'ADMINISTRATEUR') {
    throw new ApiError(400, "Role non autorise a l'inscription")
  }
  if (body.role !== undefined && body.role !== null && body.role !== 'CLIENT') {
    throw new ApiError(400, 'Champ invalide: role')
  }

  if (await findUserByEmail(body.email)) {
    throw new ApiError(409, 'Email deja utilise')
  }

  const id = crypto.randomUUID()
  const hash = await bcrypt.hash(body.password, 10)
  const now = new Date()
  await pool.query(
    'INSERT INTO utilisateurs (id, email, mot_de_passe_hash, role, prenom, nom, date_creation) VALUES (?,?,?,?,?,?,?)',
    [id, body.email, hash, 'CLIENT', body.prenom, body.nom, now]
  )
  await pool.query(
    'INSERT INTO clients (id, telephone, profil_fiscal) VALUES (?,?,?)',
    [id, body.telephone || null, body.profilFiscal || null]
  )

  const token = jwt.generateToken(id, body.email, 'CLIENT')
  return {
    token,
    user: toResponse({
      id,
      email: body.email,
      prenom: body.prenom,
      nom: body.nom,
      role: 'CLIENT',
      telephone: body.telephone || null,
      profilFiscal: body.profilFiscal || null,
    }),
  }
}

async function login(body) {
  const fields = {}
  validateEmail(body, fields)
  validatePassword(body, fields)
  if (Object.keys(fields).length) throw new ValidationError(fields)

  if (loginAttempts.isBlocked(body.email)) {
    throw new ApiError(429, 'Trop de tentatives de connexion. Reessayez dans 15 minutes.')
  }

  const user = await findUserByEmail(body.email)
  if (!user) {
    loginAttempts.registerFailure(body.email)
    throw new ApiError(401, 'Identifiants invalides')
  }
  const ok = await bcrypt.compare(body.password, user.motDePasseHash)
  if (!ok) {
    loginAttempts.registerFailure(body.email)
    throw new ApiError(401, 'Identifiants invalides')
  }
  loginAttempts.reset(body.email)

  const token = jwt.generateToken(user.id, user.email, user.role)
  return { token, user: toResponse(user) }
}

async function getProfile(userId) {
  const user = await findUserById(userId)
  if (!user) throw new ApiError(404, 'Utilisateur non trouve')
  return toResponse(user)
}

module.exports = { register, login, getProfile, findUserById }
