const {
  npm_package_name: pkgName = '',
  npm_package_version: pkgVersion = '',

  REDIS_ENABLED = 'false',
  REDIS_AUTH_ENABLED = 'false',
  REDIS_HOST = '',
  REDIS_PORT = '',
  REDIS_KEY_PREFIX = '',
  REDIS_AUTH = ''
} = process.env

const SERVICE = `${pkgName}@${pkgVersion}`
const logFunc = console.fatal || console.error

const ENABLED = REDIS_ENABLED === 'true'
let CONNECTION_CONFIG = {}

const REQUIRED_CONFIG = []
const MISSING_CONFIG = []

if (ENABLED) {
  REQUIRED_CONFIG.push('REDIS_HOST')
  REQUIRED_CONFIG.push('REDIS_PORT')

  const AUTH_ENABLED = REDIS_AUTH_ENABLED === 'true'

  if (AUTH_ENABLED) {
    REQUIRED_CONFIG.push('REDIS_AUTH')
  }

  REQUIRED_CONFIG.forEach(function (key) {
    if (!process.env[key]) {
      MISSING_CONFIG.push(key)
    }
  })

  if (MISSING_CONFIG.length) {
    logFunc(`[${SERVICE} Redis] Redis Config Missing: ${MISSING_CONFIG.join(', ')}`)
    process.exit(1)
  }

  CONNECTION_CONFIG = {
    socket: {
      host: REDIS_HOST,
      port: REDIS_PORT
    }
  }

  if (AUTH_ENABLED) {
    CONNECTION_CONFIG.socket.tls = true
    CONNECTION_CONFIG.password = REDIS_AUTH
  } else {
    console.warn(`[${SERVICE} Redis] Environment REDIS_AUTH is disabled.`)
  }
}

const CONFIG = {
  CONNECTION_CONFIG,
  KEY_PREFIX: REDIS_KEY_PREFIX
}

export default CONFIG

export { SERVICE }
