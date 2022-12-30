import clientManager from './clientManager.mjs'
import CONFIG from './CONFIG.mjs'

export default class RedisSdk {
  constructor (config = {}) {
    const { CONNECTION_CONFIG, KEY_PREFIX = '' } = config

    this.CONNECTION_CONFIG = CONNECTION_CONFIG || CONFIG.CONNECTION_CONFIG
    this.KEY_PREFIX = KEY_PREFIX || CONFIG.KEY_PREFIX

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

  async connect () {
    const { CONNECTION_CONFIG } = this
    this.client = await clientManager.createClient(CONNECTION_CONFIG)
  }

  async disconnect (forced = false) {
    if (this.client) {
      await clientManager.releaseClient(this.client, forced)
      delete this.client
    } else {
      console.error('Disconnection to Redis failed as it is not connected')
    }
  }

  getClient () {
    if (this.client) { return this.client }
    throw new Error('Unable to get Redis Client as its not connected')
  }

  prefixKey (key = '') {
    if (typeof key !== 'string') { return '' }

    const { KEY_PREFIX } = this
    const prefixPattern = `${KEY_PREFIX}__`
    const hasPrefix = key.indexOf(prefixPattern) === 0
    const prefixedKey = (!hasPrefix && `${prefixPattern}${key}`) || key
    return prefixedKey
  }

  unprefixKey (key = '') {
    if (typeof key !== 'string') { return '' }

    const { KEY_PREFIX } = this
    const prefixPattern = `${KEY_PREFIX}__`
    const hasPrefix = key.indexOf(prefixPattern) === 0
    const unprefixedKey = (!hasPrefix && key.split(prefixPattern)[1]) || key
    return unprefixedKey
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
    const prefixedKeys = await client.keys(searchPatten)
    const values = prefixedKeys.map(this.unprefixKey)
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
