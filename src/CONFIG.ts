import { RedisClientOptions } from 'redis'
import { REDIS_CONFIG } from './TYPES'

/** @ignore */
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

/** @ignore */
export const SERVICE = `${pkgName}@${pkgVersion}`

/** @ignore */
let CONNECTION_CONFIG: RedisClientOptions = {}

/** @ignore */
const REQUIRED_CONFIG: string[] = []
/** @ignore */
const MISSING_CONFIGS: string[] = []

if (REDIS_ENABLED === 'true') {
  REQUIRED_CONFIG.push('REDIS_HOST')
  REQUIRED_CONFIG.push('REDIS_PORT')

  /** @ignore */
  const AUTH_ENABLED = REDIS_AUTH_ENABLED === 'true'

  if (AUTH_ENABLED) {
    REQUIRED_CONFIG.push('REDIS_AUTH')
  }

  REQUIRED_CONFIG.forEach(function (key) {
    if (!process.env[key]) {
      MISSING_CONFIGS.push(key)
    }
  })

  if (MISSING_CONFIGS.length) {
    const fatalLogFunc = console.fatal || console.log
    fatalLogFunc(
      `[${SERVICE} Redis] Redis Config Missing: ${MISSING_CONFIGS.join(', ')}`
    )
    process.exit(1)
  }

  CONNECTION_CONFIG = {
    socket: {
      host: REDIS_HOST,
      port: parseInt(REDIS_PORT, 10),
      tls: AUTH_ENABLED
    },
    password: AUTH_ENABLED ? REDIS_AUTH : undefined
  }

  if (!AUTH_ENABLED) {
    console.warn(`[${SERVICE} Redis] Environment REDIS_AUTH is disabled.`)
  }
}

/** @ignore */
const CONFIG: REDIS_CONFIG = {
  CONNECTION_CONFIG,
  KEY_PREFIX: REDIS_KEY_PREFIX
}

export default CONFIG
