const {
  REDIS_ENABLED = 'false',
  REDIS_AUTH_ENABLED = 'false',
  REDIS_CHECK_SERVER_IDENTITY = 'false',
  REDIS_HOST = '',
  REDIS_PORT = '',
  REDIS_KEY_PREFIX = '',
  REDIS_AUTH = ''
} = process.env

const ENABLED = REDIS_ENABLED === 'true'
const AUTH_ENABLED = REDIS_AUTH_ENABLED === 'true'
const CHECK_SERVER_IDENTITY = REDIS_CHECK_SERVER_IDENTITY === 'true'

let REQUIRED_CONFIG = []

if (ENABLED) {
  REQUIRED_CONFIG = REQUIRED_CONFIG.concat(['REDIS_HOST', 'REDIS_PORT'])
}

if (ENABLED && AUTH_ENABLED) {
  REQUIRED_CONFIG = REQUIRED_CONFIG.concat(['REDIS_AUTH'])
}

// Terminate Server if any Redis Configuration is missing
REQUIRED_CONFIG.forEach(function (key) {
  if (!process.env[key]) {
    console.error('[Error] Missing Redis Config:', key)
    return process.exit(1)
  }
})

// Redis Configuration to required establish connection
const CONNECTION_CONFIG = {
  host: REDIS_HOST,
  port: REDIS_PORT
}

if (AUTH_ENABLED) {
  CONNECTION_CONFIG.password = REDIS_AUTH
}

if (CHECK_SERVER_IDENTITY) {
  CONNECTION_CONFIG.tls = { checkServerIdentity: () => undefined }
}

const CONFIG = {
  CONNECTION_CONFIG,
  KEY_PREFIX: REDIS_KEY_PREFIX
}

export default CONFIG
