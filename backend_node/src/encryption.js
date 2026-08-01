const crypto = require('crypto')
const config = require('./config')

const PREFIX = 'enc:'
const IV_LENGTH = 12
const GCM_TAG_BYTES = 16

const key = Buffer.from(config.encryptionKey, 'base64')
if (key.length !== 32) {
  throw new Error('APP_ENCRYPTION_KEY doit contenir une cle AES-256 en base64 (32 octets)')
}

// Format compatible avec EncryptionService.java (Spring) :
//   "enc:" + base64( IV(12) + ciphertext + GCM-TAG(16) )
function encrypt(plaintext) {
  if (plaintext === null || plaintext === undefined || plaintext === '') return plaintext
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
  const ciphertext = Buffer.concat([cipher.update(String(plaintext), 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return PREFIX + Buffer.concat([iv, ciphertext, tag]).toString('base64')
}

function decrypt(ciphertext) {
  if (!ciphertext) return ciphertext
  if (!ciphertext.startsWith(PREFIX)) return ciphertext
  const combined = Buffer.from(ciphertext.slice(PREFIX.length), 'base64')
  const iv = combined.subarray(0, IV_LENGTH)
  const tag = combined.subarray(combined.length - GCM_TAG_BYTES)
  const data = combined.subarray(IV_LENGTH, combined.length - GCM_TAG_BYTES)
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAuthTag(tag)
  return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8')
}

module.exports = { encrypt, decrypt }
