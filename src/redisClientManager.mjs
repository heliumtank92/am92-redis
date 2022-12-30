import { createClient as createRedisClient } from 'redis'
import CONFIG from './CONFIG.mjs'

const { CONNECTION_CONFIG } = CONFIG

const redisClientManager = {
  connect,
  getClient,
  createClient,
  releaseClient
}

export default redisClientManager

let client

async function connect (connectionConfig = CONNECTION_CONFIG) {
  client = await createClient(connectionConfig)
  return client
}

async function createClient (connectionConfig) {
  const { host, port } = connectionConfig
  console.log(`[Info] Connecting to Redis on '${host}:${port}'...`)

  // Create Redis Client and Return
  const client = createRedisClient(connectionConfig)
  client.on('error', () => {
    const errMsg = `[Error] Unable to Connect to Redis on '${host}:${port}'!`
    const error = new Error(errMsg)
    console.log(error)
    return process.exit(1)
  })

  await client.connect()
  console.log(`[Info] Redis Connection on '${host}:${port}' Established`)

  return client
}

function getClient () {
  return client
}

async function releaseClient (client, forced = false) {
  if (!forced) {
    if (client.quit) { await client.quit() }
  } else {
    if (client.end) { await client.end(true) }
  }
}
