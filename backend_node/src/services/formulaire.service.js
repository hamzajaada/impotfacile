const crypto = require('crypto')
const { pool } = require('../db')
const { toBool } = require('../mappers')
const { ApiError } = require('../httpError')

async function getTemplateRow(id) {
  const [rows] = await pool.query('SELECT * FROM formulaires_templates WHERE id = ?', [id])
  return rows[0] || null
}

async function getProfils(table, column, id) {
  const [rows] = await pool.query(`SELECT profil FROM ${table} WHERE ${column} = ? ORDER BY profil ASC`, [id])
  return rows.map((r) => r.profil)
}

async function getRegles(champId) {
  const [rows] = await pool.query('SELECT * FROM regles_conditionnelles WHERE champ_id = ?', [champId])
  return rows.map((r) => ({
    id: r.id,
    champCible: r.champ_cible,
    typeRegle: r.type_regle,
    valeurAttendue: r.valeur_attendue,
  }))
}

async function getChamps(sectionId) {
  const [rows] = await pool.query('SELECT * FROM champs_formulaire WHERE section_id = ? ORDER BY ordre ASC', [sectionId])
  const out = []
  for (const c of rows) {
    out.push({
      id: c.id,
      label: c.label,
      type: c.type,
      obligatoire: toBool(c.obligatoire),
      ordre: c.ordre,
      nomChamp: c.nom_champ,
      options: c.options,
      profilsCibles: await getProfils('champs_formulaire_profils', 'champ_id', c.id),
      regles: await getRegles(c.id),
    })
  }
  return out
}

async function getSections(templateId) {
  const [rows] = await pool.query('SELECT * FROM sections_formulaire WHERE template_id = ? ORDER BY ordre ASC', [templateId])
  const out = []
  for (const s of rows) {
    out.push({
      id: s.id,
      titre: s.titre,
      ordre: s.ordre,
      repetable: toBool(s.repetable),
      profilsCibles: await getProfils('sections_formulaire_profils', 'section_id', s.id),
      champs: await getChamps(s.id),
    })
  }
  return out
}

async function buildTemplate(row) {
  return {
    id: row.id,
    nom: row.nom,
    anneeFiscale: row.annee_fiscale,
    version: row.version,
    actif: toBool(row.actif),
    sections: await getSections(row.id),
  }
}

async function getSectionRow(id) {
  const [rows] = await pool.query('SELECT * FROM sections_formulaire WHERE id = ?', [id])
  return rows[0] || null
}

async function getChampRow(id) {
  const [rows] = await pool.query('SELECT * FROM champs_formulaire WHERE id = ?', [id])
  return rows[0] || null
}

async function buildSection(row) {
  return {
    id: row.id,
    titre: row.titre,
    ordre: row.ordre,
    repetable: toBool(row.repetable),
    profilsCibles: await getProfils('sections_formulaire_profils', 'section_id', row.id),
    champs: await getChamps(row.id),
  }
}

async function buildChamp(row) {
  return {
    id: row.id,
    label: row.label,
    type: row.type,
    obligatoire: toBool(row.obligatoire),
    ordre: row.ordre,
    nomChamp: row.nom_champ,
    options: row.options,
    profilsCibles: await getProfils('champs_formulaire_profils', 'champ_id', row.id),
    regles: await getRegles(row.id),
  }
}

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

async function getAllTemplates() {
  const [rows] = await pool.query('SELECT * FROM formulaires_templates ORDER BY id ASC')
  const out = []
  for (const row of rows) out.push(await buildTemplate(row))
  return out
}

async function getTemplate(id) {
  const row = await getTemplateRow(id)
  if (!row) throw new ApiError(500, 'Une erreur interne est survenue') // miroir de Spring (RuntimeException -> 500)
  return buildTemplate(row)
}

async function getTemplatesByYear(anneeFiscale) {
  const [rows] = await pool.query('SELECT * FROM formulaires_templates WHERE annee_fiscale = ? AND actif = 1', [anneeFiscale])
  const out = []
  for (const row of rows) out.push(await buildTemplate(row))
  return out
}

async function getActiveTemplate() {
  const [rows] = await pool.query('SELECT * FROM formulaires_templates WHERE actif = 1 ORDER BY id ASC LIMIT 1')
  if (!rows[0]) return null
  return buildTemplate(rows[0])
}

async function setProfils(table, column, id, profils) {
  await pool.query(`DELETE FROM ${table} WHERE ${column} = ?`, [id])
  for (const p of profils || []) {
    await pool.query(`INSERT INTO ${table} (${column}, profil) VALUES (?,?)`, [id, p])
  }
}

async function insertRegles(champId, regles) {
  const out = []
  for (const r of regles || []) {
    const id = crypto.randomUUID()
    await pool.query(
      'INSERT INTO regles_conditionnelles (id, champ_cible, type_regle, valeur_attendue, champ_id) VALUES (?,?,?,?,?)',
      [id, r.champCible, r.typeRegle, r.valeurAttendue, champId]
    )
    out.push({ id, champCible: r.champCible, typeRegle: r.typeRegle, valeurAttendue: r.valeurAttendue })
  }
  return out
}

async function insertChamp(sectionId, champ) {
  const id = crypto.randomUUID()
  await pool.query(
    `INSERT INTO champs_formulaire (id, label, type, obligatoire, ordre, nom_champ, options, section_id)
     VALUES (?,?,?,?,?,?,?,?)`,
    [
      id,
      champ.label,
      champ.type,
      champ.obligatoire === undefined || champ.obligatoire === null ? 1 : champ.obligatoire ? 1 : 0,
      champ.ordre === undefined || champ.ordre === null ? 0 : champ.ordre,
      champ.nomChamp || null,
      champ.options || null,
      sectionId,
    ]
  )
  await setProfils('champs_formulaire_profils', 'champ_id', id, champ.profilsCibles)
  const row = await getChampRow(id)
  return buildChamp(row)
}

async function insertSection(templateId, section) {
  const id = crypto.randomUUID()
  await pool.query(
    `INSERT INTO sections_formulaire (id, titre, ordre, repetable, template_id) VALUES (?,?,?,?,?)`,
    [
      id,
      section.titre,
      section.ordre === undefined || section.ordre === null ? 0 : section.ordre,
      section.repetable ? 1 : 0,
      templateId,
    ]
  )
  await setProfils('sections_formulaire_profils', 'section_id', id, section.profilsCibles)
  for (const champ of section.champs || []) {
    await insertChamp(id, champ)
  }
  const row = await getSectionRow(id)
  return buildSection(row)
}

async function createTemplate(template) {
  const id = crypto.randomUUID()
  await pool.query(
    `INSERT INTO formulaires_templates (id, nom, annee_fiscale, version, actif) VALUES (?,?,?,?,?)`,
    [
      id,
      template.nom,
      template.anneeFiscale,
      template.version === undefined || template.version === null ? 1 : template.version,
      template.actif === undefined || template.actif === null ? 1 : template.actif ? 1 : 0,
    ]
  )
  for (const section of template.sections || []) {
    await insertSection(id, section)
  }
  const row = await getTemplateRow(id)
  return buildTemplate(row)
}

async function deleteTemplate(id) {
  const sections = await getSections(id)
  for (const s of sections) {
    await deleteChampList(s.champs.map((c) => c.id))
    await pool.query('DELETE FROM sections_formulaire_profils WHERE section_id = ?', [s.id])
  }
  await pool.query('UPDATE declarations SET template_id = NULL WHERE template_id = ?', [id])
  await pool.query('DELETE FROM sections_formulaire WHERE template_id = ?', [id])
  await pool.query('DELETE FROM formulaires_templates WHERE id = ?', [id])
}

async function deleteChampList(ids) {
  for (const champId of ids) {
    await pool.query('DELETE FROM regles_conditionnelles WHERE champ_id = ?', [champId])
    await pool.query('DELETE FROM champs_formulaire_profils WHERE champ_id = ?', [champId])
    await pool.query('DELETE FROM champs_formulaire WHERE id = ?', [champId])
  }
}

async function toggleActive(id, actif) {
  if (actif) {
    await pool.query('UPDATE formulaires_templates SET actif = 0 WHERE actif = 1')
  }
  await pool.query('UPDATE formulaires_templates SET actif = ? WHERE id = ?', [actif ? 1 : 0, id])
  return getTemplate(id)
}

async function resetToDefault() {
  await pool.query('UPDATE formulaires_templates SET actif = 0 WHERE actif = 1')
}

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

async function addSection(templateId, section) {
  const template = await getTemplateRow(templateId)
  if (!template) throw new ApiError(500, 'Une erreur interne est survenue')
  if (!section.profilsCibles) section.profilsCibles = []
  return insertSection(templateId, section)
}

async function updateSection(sectionId, data) {
  const row = await getSectionRow(sectionId)
  if (!row) throw new ApiError(500, 'Une erreur interne est survenue')
  await pool.query(
    'UPDATE sections_formulaire SET titre = ?, ordre = ?, repetable = ? WHERE id = ?',
    [data.titre, data.ordre === undefined ? row.ordre : data.ordre, data.repetable ? 1 : 0, sectionId]
  )
  await setProfils('sections_formulaire_profils', 'section_id', sectionId, data.profilsCibles || [])
  const updated = await getSectionRow(sectionId)
  return buildSection(updated)
}

async function deleteSection(sectionId) {
  const section = await getSectionRow(sectionId)
  if (!section) return
  await deleteChampList((await getChamps(sectionId)).map((c) => c.id))
  await pool.query('DELETE FROM sections_formulaire_profils WHERE section_id = ?', [sectionId])
  await pool.query('DELETE FROM sections_formulaire WHERE id = ?', [sectionId])
}

async function reorderSections(sectionIds) {
  for (let i = 0; i < sectionIds.length; i++) {
    await pool.query('UPDATE sections_formulaire SET ordre = ? WHERE id = ?', [i, sectionIds[i]])
  }
}

// ---------------------------------------------------------------------------
// Champs
// ---------------------------------------------------------------------------

async function addChamp(sectionId, champ) {
  const section = await getSectionRow(sectionId)
  if (!section) throw new ApiError(500, 'Une erreur interne est survenue')
  if (!champ.profilsCibles) champ.profilsCibles = []
  return insertChamp(sectionId, champ)
}

async function updateChamp(champId, data) {
  const row = await getChampRow(champId)
  if (!row) throw new ApiError(500, 'Une erreur interne est survenue')
  await pool.query(
    `UPDATE champs_formulaire SET label = ?, type = ?, obligatoire = ?, ordre = ?, nom_champ = ?, options = ? WHERE id = ?`,
    [
      data.label,
      data.type,
      data.obligatoire === undefined || data.obligatoire === null ? row.obligatoire : data.obligatoire ? 1 : 0,
      data.ordre === undefined || data.ordre === null ? row.ordre : data.ordre,
      data.nomChamp === undefined ? row.nom_champ : data.nomChamp,
      data.options === undefined ? row.options : data.options,
      champId,
    ]
  )
  await setProfils('champs_formulaire_profils', 'champ_id', champId, data.profilsCibles || [])
  const updated = await getChampRow(champId)
  return buildChamp(updated)
}

async function deleteChamp(champId) {
  await deleteChampList([champId])
}

async function reorderChamps(champIds) {
  for (let i = 0; i < champIds.length; i++) {
    await pool.query('UPDATE champs_formulaire SET ordre = ? WHERE id = ?', [i, champIds[i]])
  }
}

// ---------------------------------------------------------------------------
// Regles
// ---------------------------------------------------------------------------

async function setRegles(champId, regles) {
  const champ = await getChampRow(champId)
  if (!champ) throw new ApiError(500, 'Une erreur interne est survenue')
  await pool.query('DELETE FROM regles_conditionnelles WHERE champ_id = ?', [champId])
  return insertRegles(champId, regles)
}

async function addRegle(champId, regle) {
  const champ = await getChampRow(champId)
  if (!champ) throw new ApiError(500, 'Une erreur interne est survenue')
  const inserted = await insertRegles(champId, [regle])
  return inserted[0]
}

async function deleteRegle(regleId) {
  await pool.query('DELETE FROM regles_conditionnelles WHERE id = ?', [regleId])
}

module.exports = {
  getAllTemplates,
  getTemplate,
  getTemplatesByYear,
  getActiveTemplate,
  createTemplate,
  deleteTemplate,
  toggleActive,
  resetToDefault,
  addSection,
  updateSection,
  deleteSection,
  reorderSections,
  addChamp,
  updateChamp,
  deleteChamp,
  reorderChamps,
  setRegles,
  addRegle,
  deleteRegle,
}
