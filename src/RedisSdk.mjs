import redisClientManager from './redisClientManager.mjs'

const { connect, releaseClient, getClient } = redisClientManager

export default class RedisSdk {
  constructor (config = {}) {
    const {
      CONNECTION_CONFIG,
      KEY_PREFIX = ''
    } = config

    this.CONNECTION_CONFIG = CONNECTION_CONFIG
    this.KEY_PREFIX = KEY_PREFIX || ''

    // Method Hard-binding
    this.connect = this.connect.bind(this)
    this.disconnect = this.disconnect.bind(this)
    this.getClient = this.getClient.bind(this)
    this.prefixKey = this.prefixKey.bind(this)

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

  async connect () {
    const { CONNECTION_CONFIG } = this
    if (CONNECTION_CONFIG) {
      this.client = await connect(CONNECTION_CONFIG)
    } else {
      console.log('[Info] Connection to Redis failed as no CONNECTION_CONFIG provided')
    }
  }

  async disconnect (forced = false) {
    const { client } = this
    if (client) {
      await releaseClient(client, forced)
      delete this.client
    } else {
      console.log('[Info] Disconnection to Redis failed as no CONNECTION_CONFIG provided')
    }
  }

  getClient () {
    const { CONNECTION_CONFIG, client } = this

    if (client) { return client }
    if (!CONNECTION_CONFIG) { return getClient() }

    throw new Error('[Error] Unable to get Redis Client as its not connected.')
  }

  prefixKey (key = '') {
    if (typeof key !== 'string') { return '' }

    const { KEY_PREFIX } = this
    const prefixPattern = `${KEY_PREFIX}__`
    const hasPrefix = key.indexOf(prefixPattern) === 0
    const prefixedKey = (!hasPrefix && `${prefixPattern}${key}`) || key
    return prefixedKey
  }

  async get (key = '', options) {
    // Get Redis Client
    const client = this.getClient()

    // Implement Logic
    const prefixedKey = this.prefixKey(key)
    const value = await client.get(prefixedKey, options)

    // Return Value
    return value
  }

  async set (key = '', value = '', options) {
    // Get Redis Client
    const client = this.getClient()

    // Implement Logic and Handle TTL
    const prefixedKey = this.prefixKey(key)
    await client.set(prefixedKey, value, options)
  }

  async getAndExpire (key = '', ttlInSecs, options) {
    // Get Redis Client
    const client = this.getClient()

    // Implement Logic and Handle TTL
    const prefixedKey = this.prefixKey(key)
    const value = await client.get(prefixedKey, options)
    if (ttlInSecs) {
      await client.expire(prefixedKey, ttlInSecs)
    }

    // Return Value
    return value
  }

  async setAndExpire (key = '', value = '', ttlInSecs, options) {
    // Get Redis Client
    const client = this.getClient()

    // Implement Logic and Handle TTL
    const prefixedKey = this.prefixKey(key)
    await client.set(prefixedKey, value, options)
    if (ttlInSecs) {
      await client.expire(prefixedKey, ttlInSecs)
    }
  }

  async del (key = '') {
    // Get Redis Client
    const client = this.getClient()

    // Implement Logic
    const prefixedKey = this.prefixKey(key)
    await client.del(prefixedKey)
  }

  async keys (pattern = '') {
    // Get Redis Client
    const client = this.getClient()

    // Implement Logic
    const searchPatten = this.prefixKey(pattern)
    const values = await client.keys(searchPatten)
    return values
  }

  async delByPattern (pattern = '') {
    const foundKeys = await this.keys(pattern)
    const promises = foundKeys.map(this.del)
    const response = await Promise.all(promises)
    return response
  }

  async incrBy (key = '', value = 0) {
    // Get Redis Client
    const client = this.getClient()

    // Implement Logic and Handle TTL
    const prefixedKey = this.prefixKey(key)
    const incrValue = await client.incrBy(prefixedKey, value)
    return incrValue
  }

  async incrByAndExpire (key = '', value = 0, ttlInSecs) {
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

  async decrBy (key = '', value = 0) {
    // Get Redis Client
    const client = this.getClient()

    // Implement Logic and Handle TTL
    const prefixedKey = this.prefixKey(key)
    const decrValue = await client.decrBy(prefixedKey, value)
    return decrValue
  }

  async decrByAndExpire (key = '', value = 0, ttlInSecs) {
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

  async exists (keys = []) {
    // Get Redis Client
    const client = this.getClient()

    // Implement Logic
    let prefixedKeys
    if (keys instanceof Array) {
      prefixedKeys = keys.map(this.prefixKey)
    } else {
      prefixedKeys = [...arguments].map(this.prefixKey)
    }

    const keyCount = await client.exists(prefixedKeys)
    return keyCount
  }
}
