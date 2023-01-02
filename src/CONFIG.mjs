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
let CONNECTION_CONFIG = {}

const REQUIRED_CONFIG = []
const MISSING_CONFIG = []

if (ENABLED) {
  REQUIRED_CONFIG.push('REDIS_HOST')
  REQUIRED_CONFIG.push('REDIS_PORT')

  const AUTH_ENABLED = REDIS_AUTH_ENABLED === 'true'
  const CHECK_SERVER_IDENTITY = REDIS_CHECK_SERVER_IDENTITY === 'true'

  if (AUTH_ENABLED) {
    REQUIRED_CONFIG.push('REDIS_AUTH')
  }

  REQUIRED_CONFIG.forEach(function (key) {
    if (!process.env[key]) {
      MISSING_CONFIG.push(key)
    }
  })

  if (MISSING_CONFIG.length) {
    console.error(`[Error] Redis Config Missing: ${MISSING_CONFIG.join(', ')}`)
    process.exit(1)
  }

  CONNECTION_CONFIG = {
    host: REDIS_HOST,
    port: REDIS_PORT
  }

  if (AUTH_ENABLED) {
    CONNECTION_CONFIG.password = REDIS_AUTH
  }

  if (CHECK_SERVER_IDENTITY) {
    CONNECTION_CONFIG.tls = { checkServerIdentity: () => undefined }
  }
}

const CONFIG = {
  CONNECTION_CONFIG,
  KEY_PREFIX: REDIS_KEY_PREFIX
}

export default CONFIG
