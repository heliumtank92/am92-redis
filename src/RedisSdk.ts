import { SetOptions } from 'redis'
import ClientManager from './ClientManager'
import { RedisSdkError } from './RedisSdkError'
import CONFIG, { SERVICE } from './CONFIG'
import { CLIENT_NOT_CONNECTED_ERROR } from './ERRORS'
import { RedisSdkConfig, RedisClient } from './TYPES'

/**
 * Class to create an SDK which interacts with a Redis Instance
 *
 * @class
 */
export class RedisSdk {
  /**
   * Redis Config used by the SDK
   */
  CONFIG: RedisSdkConfig
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
   * @param [config] Redis SDK Configuration
   */
  constructor(config?: RedisSdkConfig) {
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
    this.expire = this.expire.bind(this)
    this.expireAt = this.expireAt.bind(this)
    this.expireTime = this.expireTime.bind(this)
    this.ttl = this.ttl.bind(this)
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

    this.hSet = this.hSet.bind(this)
    this.hSetNX = this.hSetNX.bind(this)
    this.hIncrBy = this.hIncrBy.bind(this)
    this.hGet = this.hGet.bind(this)
    this.hGetAll = this.hGetAll.bind(this)
    this.hKeys = this.hKeys.bind(this)
    this.hVals = this.hVals.bind(this)
    this.hLen = this.hLen.bind(this)
    this.hStrLen = this.hStrLen.bind(this)
    this.hDel = this.hDel.bind(this)
    this.hExists = this.hExists.bind(this)
    this.hmGet = this.hmGet.bind(this)
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
    throw new RedisSdkError(CLIENT_NOT_CONNECTED_ERROR)
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
   * @returns
   */
  async get(key: string): Promise<string | null> {
    const client = this.getClient()
    const prefixedKey = this.prefixKey(key)
    const value = await client.get(prefixedKey)
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
    options?: SetOptions
  ): Promise<string | null> {
    const client = this.getClient()
    const prefixedKey = this.prefixKey(key)
    const returnValue = await client.set(prefixedKey, value, options)
    return returnValue
  }

  /**
   * Sets the expiry of Redis key in seconds
   *
   * @async
   * @param key Redis key name
   * @param ttlInSecs Redis key expiry in seconds
   * @param [mode] Conditions when expiry should be set
   * @returns
   */
  async expire(
    key: string,
    ttlInSecs: number,
    mode?: 'NX' | 'XX' | 'GT' | 'LT'
  ): Promise<boolean> {
    const client = this.getClient()
    const prefixedKey = this.prefixKey(key)
    const isSet = await client.expire(prefixedKey, ttlInSecs, mode)
    return isSet
  }

  /**
   * Sets the expiry of Redis key to Unix timestamp
   *
   * @async
   * @param key Redis key name
   * @param ttlInSecs Redis key expiry in seconds
   * @param [mode] Conditions when expiry should be set
   * @returns
   */
  async expireAt(
    key: string,
    unixInSecs: number,
    mode?: 'NX' | 'XX' | 'GT' | 'LT'
  ): Promise<boolean> {
    const client = this.getClient()
    const prefixedKey = this.prefixKey(key)
    const isSet = await client.expireAt(prefixedKey, unixInSecs, mode)
    return isSet
  }

  /**
   * Get the expiry of Redis key as Unix timestamp
   *
   * @async
   * @param key Redis key name
   * @returns
   */
  async expireTime(key: string): Promise<number> {
    const client = this.getClient()
    const prefixedKey = this.prefixKey(key)
    const unixInSecs = await client.expireTime(prefixedKey)
    return unixInSecs
  }

  /**
   * Get the expiry of Redis key in seconds.
   *
   * @async
   * @param key Redis key name
   * @returns
   */
  async ttl(key: string): Promise<number> {
    const client = this.getClient()
    const prefixedKey = this.prefixKey(key)
    const ttlInSecs = await client.ttl(prefixedKey)
    return ttlInSecs
  }

  /**
   * Gets the value of a Redis key and sets the expiry of Redis key
   *
   * @async
   * @param key Redis key name
   * @param ttlInSecs Redis key expiry in seconds
   * @returns
   */
  async getAndExpire(key: string, ttlInSecs: number): Promise<string | null> {
    const client = this.getClient()
    const prefixedKey = this.prefixKey(key)
    const value = await client.get(prefixedKey)

    if (ttlInSecs) {
      await client.expire(prefixedKey, ttlInSecs)
    }

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
    options?: SetOptions
  ): Promise<string | null> {
    const client = this.getClient()
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
    const client = this.getClient()
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
   * @returns
   */
  async keys(pattern: string): Promise<string[]> {
    const client = this.getClient()
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
   * @returns
   */
  async incrBy(key: string, value: number = 0): Promise<number> {
    const client = this.getClient()
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
   * @returns
   */
  async incrByAndExpire(
    key: string,
    value: number = 0,
    ttlInSecs: number
  ): Promise<number> {
    const client = this.getClient()
    const prefixedKey = this.prefixKey(key)
    const incrValue = await client.incrBy(prefixedKey, value || 0)

    if (ttlInSecs) {
      await client.expire(prefixedKey, ttlInSecs)
    }

    return incrValue
  }

  /**
   * Decrements the value of a Redis key
   *
   * @async
   * @param key Redis key name
   * @param [value=0] Redis value to be decremented by
   * @returns
   */
  async decrBy(key: string, value: number = 0): Promise<number> {
    const client = this.getClient()
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
   * @returns
   */
  async decrByAndExpire(
    key: string,
    value: number = 0,
    ttlInSecs: number
  ): Promise<number> {
    const client = this.getClient()
    const prefixedKey = this.prefixKey(key)
    const decrValue = await client.decrBy(prefixedKey, value || 0)

    if (ttlInSecs) {
      await client.expire(prefixedKey, ttlInSecs)
    }

    return decrValue
  }

  /**
   * Checks if Redis keys exist or not
   *
   * @async
   * @param [keys=[]] Array of Redis key names
   * @returns
   */
  async exists(keys: string[]): Promise<number> {
    const client = this.getClient()
    const prefixedKeys = (keys || []).map(this.prefixKey)
    const keyCount = await client.exists(prefixedKeys)
    return keyCount
  }

  /**
   * Creates or modifies the value of a field in a hash
   *
   * @async
   * @param key Redis key name of hash
   * @param field Hash field
   * @param value Hash value
   * @returns
   */
  async hSet(
    key: string,
    field: string,
    value: string | number
  ): Promise<number> {
    const client = this.getClient()
    const prefixedKey = this.prefixKey(key)
    const isSet = await client.hSet(prefixedKey, field, value)
    return isSet
  }

  /**
   * Sets the value of a field in a hash only when the field doesn't exist
   *
   * @async
   * @param key Redis key name of hash
   * @param field Hash field
   * @param value Hash value
   * @returns
   */
  async hSetNX(key: string, field: string, value: string): Promise<boolean> {
    const client = this.getClient()
    const prefixedKey = this.prefixKey(key)
    const isSet = await client.hSetNX(prefixedKey, field, value)
    return isSet
  }

  /**
   * Increments the integer value of a field in a hash by a number. Uses 0 as initial value if the field doesn't exist
   *
   * @async
   * @param key Redis key name of hash
   * @param field Hash field
   * @param [value=0] Value to be incremented by
   * @returns
   */
  async hIncrBy(
    key: string,
    field: string,
    value: number = 0
  ): Promise<number> {
    const client = this.getClient()
    const prefixedKey = this.prefixKey(key)
    const incrValue = await client.hIncrBy(prefixedKey, field, value)
    return incrValue
  }

  /**
   * Returns the value of a field in a hash
   *
   * @async
   * @param key Redis key name of hash
   * @param field Hash field
   * @returns
   */
  async hGet(key: string, field: string): Promise<string | undefined> {
    const client = this.getClient()
    const prefixedKey = this.prefixKey(key)
    const value = await client.hGet(prefixedKey, field)
    return value
  }

  /**
   * Returns all fields and values in a hash
   *
   * @async
   * @param key Redis key name of hash
   * @returns
   */
  async hGetAll(key: string): Promise<{ [x: string]: string }> {
    const client = this.getClient()
    const prefixedKey = this.prefixKey(key)
    const hash = await client.hGetAll(prefixedKey)
    return hash
  }

  /**
   * Returns all fields in a hash
   *
   * @async
   * @param key Redis key name of hash
   * @returns
   */
  async hKeys(key: string): Promise<string[]> {
    const client = this.getClient()
    const prefixedKey = this.prefixKey(key)
    const fields = await client.hKeys(prefixedKey)
    return fields
  }

  /**
   * Returns all values in a hash
   *
   * @async
   * @param key Redis key name of hash
   * @returns
   */
  async hVals(key: string): Promise<string[]> {
    const client = this.getClient()
    const prefixedKey = this.prefixKey(key)
    const values = await client.hVals(prefixedKey)
    return values
  }

  /**
   * Returns the number of fields in a hash
   *
   * @async
   * @param key Redis key name of hash
   * @returns
   */
  async hLen(key: string): Promise<number> {
    const client = this.getClient()
    const prefixedKey = this.prefixKey(key)
    const fieldCount = await client.hLen(prefixedKey)
    return fieldCount
  }

  /**
   * Returns the length of the value of a field
   *
   * @async
   * @param key Redis key name of hash
   * @param field Hash field
   * @returns
   */
  async hStrLen(key: string, field: string): Promise<number> {
    const client = this.getClient()
    const prefixedKey = this.prefixKey(key)
    const length = await client.hStrLen(prefixedKey, field)
    return length
  }

  /**
   * Deletes one or more fields and their values from a hash. Deletes the hash if no fields remain
   *
   * @async
   * @param key Redis key name of hash
   * @param field Hash field
   * @returns
   */
  async hDel(key: string, field: string): Promise<number> {
    const client = this.getClient()
    const prefixedKey = this.prefixKey(key)
    const isDel = await client.hDel(prefixedKey, field)
    return isDel
  }

  /**
   * Determines whether a field exists in a hash
   *
   * @async
   * @param key Redis key name of hash
   * @param field Hash field
   * @returns
   */
  async hExists(key: string, field: string): Promise<boolean> {
    const client = this.getClient()
    const prefixedKey = this.prefixKey(key)
    const exists = await client.hExists(prefixedKey, field)
    return exists
  }

  /**
   * Returns the values of all fields in a hash
   *
   * @async
   * @param key Redis key name of hash
   * @param fields Hash fields
   * @returns
   */
  async hmGet(key: string, fields: string[]): Promise<string[]> {
    const client = this.getClient()
    const prefixedKey = this.prefixKey(key)
    const exists = await client.hmGet(prefixedKey, fields)
    return exists
  }
}
