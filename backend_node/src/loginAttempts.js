// Anti brute-force sur la connexion (miroir de LoginAttemptService.java)
const MAX_ATTEMPTS = 5
const LOCK_MS = 15 * 60 * 1000

const attempts = new Map()

function normalize(email) {
  return (email || '').trim().toLowerCase()
}

function isBlocked(email) {
  const attempt = attempts.get(normalize(email))
  if (!attempt) return false
  if (attempt.failures >= MAX_ATTEMPTS) {
    if (Date.now() < attempt.blockedUntil) return true
    attempts.delete(normalize(email))
  }
  return false
}

function registerFailure(email) {
  const key = normalize(email)
  let attempt = attempts.get(key)
  if (!attempt) {
    attempt = { failures: 0, blockedUntil: 0 }
    attempts.set(key, attempt)
  }
  attempt.failures += 1
  if (attempt.failures >= MAX_ATTEMPTS) {
    attempt.blockedUntil = Date.now() + LOCK_MS
  }
}

function reset(email) {
  attempts.delete(normalize(email))
}

module.exports = { isBlocked, registerFailure, reset }
