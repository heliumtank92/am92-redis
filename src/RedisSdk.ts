import { SetOptions } from 'redis'
import ClientManager from './ClientManager'
import CONFIG, { SERVICE } from './CONFIG'
import { REDIS_CONFIG, RedisClient } from './TYPES'

/**
 * Class to create an SDK which interacts with a Redis Instance
 *
 * @class
 */
export default class RedisSdk {
  /**
   * Redis Config used by the SDK
   */
  CONFIG: REDIS_CONFIG
  /**
   * Redis Client used by the SDK
   */
  client: RedisClient
  /**
   * Flag identifying if the connection has been established or not
   */
  connected: boolean = false

  /**
   * Creates an instance of RedisSdk.
   *
   * @constructor
   * @param [config]
   */
  constructor(config?: REDIS_CONFIG) {
    this.CONFIG = { ...CONFIG, ...config }
    this.client = ClientManager.createClient(this.CONFIG.CONNECTION_CONFIG)

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

  /**
   * Establish a connection with the Redis Instance
   *
   * @async
   * @returns
   */
  async connect(): Promise<void> {
    console.info(`[${SERVICE} Redis] Establishing Redis Connection...`)
    await this.client.connect()
    const successLogFunc = console.success || console.info
    successLogFunc(`[${SERVICE} Redis] Redis Connection Established`)
    this.connected = true
  }

  /**
   * Releases the connection with the Redis Instance if established
   *
   * @async
   * @param [forced=false]
   * @returns
   */
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

  /**
   * Returns the Redis client as configured using `CONFIG`
   *
   * @returns
   */
  getClient(): RedisClient {
    if (this.connected) {
      return this.client
    }
    throw new Error('Unable to get Redis Client as its not connected')
  }

  /**
   * Prefixes the Redis key with `CONFIG.KEY_PREFIX`
   *
   * @param [key='']
   * @returns
   */
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

  /**
   * Unprefixes the Redis key with `CONFIG.KEY_PREFIX`
   *
   * @param [key='']
   * @returns
   */
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

  /**
   * Gets the value of a Redis key
   *
   * @async
   * @param key Redis key name
   * @returns Value stored in Redis
   */
  async get(key: string): Promise<string | null> {
    // Get Redis Client
    const client = this.getClient()

    // Implement Logic
    const prefixedKey = this.prefixKey(key)
    const value = await client.get(prefixedKey)

    // Return Value
    return value
  }

  /**
   * Sets the value for a Redis key
   *
   * @async
   * @param key Redis key name
   * @param value Value to be stored in Redis
   * @param options Options as mentioned by 'set' method of Redis package
   * @returns
   */
  async set(
    key: string,
    value: string,
    options: SetOptions
  ): Promise<string | null> {
    // Get Redis Client
    const client = this.getClient()

    // Implement Logic and Handle TTL
    const prefixedKey = this.prefixKey(key)
    const returnValue = await client.set(prefixedKey, value, options)
    return returnValue
  }

  /**
   * Gets the value of a Redis key and sets the expiry of Redis key
   *
   * @async
   * @param key Redis key name
   * @param ttlInSecs Redis key expiry in seconds
   * @returns
   */
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

  /**
   * Sets the value of a Redis key and sets the expiry of Redis key
   *
   * @async
   * @param key Redis key name
   * @param value Value to be stored in Redis
   * @param ttlInSecs Redis key expiry in seconds
   * @param options Options as mentioned by 'set' method of Redis package
   * @returns
   */
  async setAndExpire(
    key: string,
    value: string,
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

  /**
   * Deletes a Redis key or keys
   *
   * @async
   * @param keys Redis key name or Array of Redis key names
   * @returns
   */
  async del(keys: string | string[]): Promise<number> {
    // Get Redis Client
    const client = this.getClient()

    // Implement Logic
    const prefixedKeys =
      keys instanceof Array ? keys.map(this.prefixKey) : this.prefixKey(keys)
    const deleteCount = await client.del(prefixedKeys)
    return deleteCount
  }

  /**
   * Gets all Redis keys for a given key pattern
   *
   * @async
   * @param pattern Redis key pattern
   * @returns Array of Redis keys
   */
  async keys(pattern: string): Promise<string[]> {
    // Get Redis Client
    const client = this.getClient()

    // Implement Logic
    const searchPatten = this.prefixKey(pattern)
    const prefixedKeys = await client.keys(searchPatten)
    const values = prefixedKeys.map(this.unprefixKey)
    return values
  }

  /**
   * Deletes all Redis keys for a given key pattern
   *
   * @async
   * @param pattern Redis key pattern
   * @returns
   */
  async delByPattern(pattern: string): Promise<number> {
    const foundKeys = await this.keys(pattern)
    const deleteCount = await this.del(foundKeys)
    return deleteCount
  }

  /**
   * Increments the value of a Redis key
   *
   * @async
   * @param key Redis key name
   * @param [value=0] Redis value to be incremented by
   * @returns Incremented Redis value
   */
  async incrBy(key: string, value: number = 0): Promise<number> {
    // Get Redis Client
    const client = this.getClient()

    // Implement Logic and Handle TTL
    const prefixedKey = this.prefixKey(key)
    const incrValue = await client.incrBy(prefixedKey, value)
    return incrValue
  }

  /**
   * Increments the value of a Redis key and sets the expiry of Redis key
   *
   * @async
   * @param key Redis key name
   * @param [value=0] Redis value to be incremented by
   * @param ttlInSecs Redis key expiry in seconds
   * @returns Incremented Redis value
   */
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

  /**
   * Decrements the value of a Redis key
   *
   * @async
   * @param key Redis key name
   * @param [value=0] Redis value to be decremented by
   * @returns Decremented Redis value
   */
  async decrBy(key: string, value: number = 0): Promise<number> {
    // Get Redis Client
    const client = this.getClient()

    // Implement Logic and Handle TTL
    const prefixedKey = this.prefixKey(key)
    const decrValue = await client.decrBy(prefixedKey, value)
    return decrValue
  }

  /**
   * Decrements the value of a Redis key and sets the expiry of Redis key
   *
   * @async
   * @param key Redis key name
   * @param [value=0] Redis value to be decremented by
   * @param ttlInSecs Redis key expiry in seconds
   * @returns Decremented Redis value
   */
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

  /**
   * Checks if Redis keys exist or not
   *
   * @async
   * @param [keys=[]] Array of Redis key names
   * @returns Returns '0' if key does not exist and '1' if exists
   */
  async exists(keys: string[] = []): Promise<number> {
    // Get Redis Client
    const client = this.getClient()

    // Implement Logic
    const prefixedKeys = keys.map(this.prefixKey)
    const keyCount = await client.exists(prefixedKeys)
    return keyCount
  }
}
