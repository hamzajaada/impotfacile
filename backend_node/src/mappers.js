function toBool(value) {
  if (value === null || value === undefined) return false
  if (Buffer.isBuffer(value)) return value.length > 0 && value[0] !== 0
  return Boolean(value)
}

function pad(n) {
  return String(n).padStart(2, '0')
}

// Formate un DATETIME comme le fait Spring (LocalDateTime ISO, sans millisecondes, heure locale serveur)
function formatDateTime(value) {
  if (!value) return null
  if (typeof value === 'string') return value
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return null
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

module.exports = { toBool, formatDateTime }
