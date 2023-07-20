import { SetOptions } from 'redis'
import ClientManager from './ClientManager'
import CONFIG, { SERVICE } from './CONFIG'
import { REDIS_CONFIG, RedisClient } from './TYPES'

export default class RedisSdk {
  CONFIG: REDIS_CONFIG
  client: RedisClient
  connected: boolean = false

  constructor(config: REDIS_CONFIG = CONFIG) {
    this.CONFIG = config
    this.client = ClientManager.createClient(config.CONNECTION_CONFIG)

    // Method Hard-binding
    this.connect = this.connect.bind(this)
    this.disconnect = this.disconnect.bind(this)
    this.getClient = this.getClient.bind(this)
    this.prefixKey = this.prefixKey.bind(this)
    this.unprefixKey = this.unprefixKey.bind(this)

    this.get = this.get.bind(this)
    this.set = this.set.bind(this)
    this.getAndExpire = this.getAndExpire.bind(this)
    this.setAndExpire = this.setAndExpire.bind(this)
    this.del = this.del.bind(this)
    this.keys = this.keys.bind(this)
    this.delByPattern = this.delByPattern.bind(this)
    this.incrBy = this.incrBy.bind(this)
    this.incrByAndExpire = this.incrByAndExpire.bind(this)
    this.decrBy = this.decrBy.bind(this)
    this.decrByAndExpire = this.decrByAndExpire.bind(this)
    this.exists = this.exists.bind(this)
  }

  async connect(): Promise<void> {
    console.info(`[${SERVICE} Redis] Establishing Redis Connection...`)
    await this.client.connect()
    const successLogFunc = console.success || console.info
    successLogFunc(`[${SERVICE} Redis] Redis Connection Established`)
    this.connected = true
  }

  async disconnect(forced: boolean = false): Promise<void> {
    if (!this.connected) {
      console.error(
        `[${SERVICE} Redis] Disconnection to Redis failed as it is not connected`
      )
      return
    }

    await ClientManager.releaseClient(this.client, forced)
    this.connected = false
  }

  getClient(): RedisClient {
    if (this.connected) {
      return this.client
    }
    throw new Error('Unable to get Redis Client as its not connected')
  }

  prefixKey(key: string = ''): string {
    if (typeof key !== 'string') {
      return ''
    }

    const { KEY_PREFIX } = this.CONFIG
    const prefixPattern = `${KEY_PREFIX}__`
    const hasPrefix = key.indexOf(prefixPattern) === 0
    const prefixedKey = (!hasPrefix && `${prefixPattern}${key}`) || key
    return prefixedKey
  }

  unprefixKey(key: string = ''): string {
    if (typeof key !== 'string') {
      return ''
    }

    const { KEY_PREFIX } = this.CONFIG
    const prefixPattern = `${KEY_PREFIX}__`
    const hasPrefix = key.indexOf(prefixPattern) === 0
    const unprefixedKey = (!hasPrefix && key.split(prefixPattern)[1]) || key
    return unprefixedKey
  }

  async get(key: string): Promise<string | null> {
    // Get Redis Client
    const client = this.getClient()

    // Implement Logic
    const prefixedKey = this.prefixKey(key)
    const value = await client.get(prefixedKey)

    // Return Value
    return value
  }

  async set(
    key: string,
    value: string = '',
    options: SetOptions
  ): Promise<string | null> {
    // Get Redis Client
    const client = this.getClient()

    // Implement Logic and Handle TTL
    const prefixedKey = this.prefixKey(key)
    const returnValue = await client.set(prefixedKey, value, options)
    return returnValue
  }

  async getAndExpire(key: string, ttlInSecs: number) {
    // Get Redis Client
    const client = this.getClient()

    // Implement Logic and Handle TTL
    const prefixedKey = this.prefixKey(key)
    const value = await client.get(prefixedKey)
    if (ttlInSecs) {
      await client.expire(prefixedKey, ttlInSecs)
    }

    // Return Value
    return value
  }

  async setAndExpire(
    key: string,
    value: string = '',
    ttlInSecs: number,
    options: SetOptions
  ): Promise<string | null> {
    // Get Redis Client
    const client = this.getClient()

    // Implement Logic and Handle TTL
    const prefixedKey = this.prefixKey(key)
    const returnValue = await client.set(prefixedKey, value, options)
    if (ttlInSecs) {
      await client.expire(prefixedKey, ttlInSecs)
    }
    return returnValue
  }

  async del(keys: string | string[]): Promise<number> {
    // Get Redis Client
    const client = this.getClient()

    // Implement Logic
    const prefixedKeys =
      keys instanceof Array ? keys.map(this.prefixKey) : this.prefixKey(keys)
    const deleteCount = await client.del(prefixedKeys)
    return deleteCount
  }

  async keys(pattern: string): Promise<string[]> {
    // Get Redis Client
    const client = this.getClient()

    // Implement Logic
    const searchPatten = this.prefixKey(pattern)
    const prefixedKeys = await client.keys(searchPatten)
    const values = prefixedKeys.map(this.unprefixKey)
    return values
  }

  async delByPattern(pattern: string): Promise<number> {
    const foundKeys = await this.keys(pattern)
    const deleteCount = await this.del(foundKeys)
    return deleteCount
  }

  async incrBy(key: string, value: number = 0): Promise<number> {
    // Get Redis Client
    const client = this.getClient()

    // Implement Logic and Handle TTL
    const prefixedKey = this.prefixKey(key)
    const incrValue = await client.incrBy(prefixedKey, value)
    return incrValue
  }

  async incrByAndExpire(
    key: string,
    value = 0,
    ttlInSecs: number
  ): Promise<number> {
    // Get Redis Client
    const client = this.getClient()

    // Implement Logic and Handle TTL
    const prefixedKey = this.prefixKey(key)
    const incrValue = await client.incrBy(prefixedKey, value)
    if (ttlInSecs) {
      await client.expire(prefixedKey, ttlInSecs)
    }

    // Return Value
    return incrValue
  }

  async decrBy(key: string, value: number = 0): Promise<number> {
    // Get Redis Client
    const client = this.getClient()

    // Implement Logic and Handle TTL
    const prefixedKey = this.prefixKey(key)
    const decrValue = await client.decrBy(prefixedKey, value)
    return decrValue
  }

  async decrByAndExpire(
    key: string,
    value: number = 0,
    ttlInSecs: number
  ): Promise<number> {
    // Get Redis Client
    const client = this.getClient()

    // Implement Logic and Handle TTL
    const prefixedKey = this.prefixKey(key)
    const decrValue = await client.decrBy(prefixedKey, value)
    if (ttlInSecs) {
      await client.expire(prefixedKey, ttlInSecs)
    }

    // Return Value
    return decrValue
  }

  async exists(keys: string[] = []): Promise<number> {
    // Get Redis Client
    const client = this.getClient()

    // Implement Logic
    const prefixedKeys = keys.map(this.prefixKey)
    const keyCount = await client.exists(prefixedKeys)
    return keyCount
  }
}
