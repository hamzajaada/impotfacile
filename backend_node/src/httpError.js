class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

class ValidationError extends Error {
  constructor(fields) {
    super('Validation echouee')
    this.fields = fields
  }
}

const REASON_PHRASES = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  429: 'Too Many Requests',
  500: 'Internal Server Error',
}

module.exports = { ApiError, ValidationError, REASON_PHRASES }
