import { createClient as createRedisClient } from 'redis'
import { SERVICE } from './CONFIG.mjs'

const clientManager = {
  createClient,
  releaseClient
}

export default clientManager

async function createClient (connectionConfig = {}) {
  const client = createRedisClient(connectionConfig)

  client.on('error', (error) => {
    console.error(`[${SERVICE} Redis] Redis Connection Error`, error)
    throw error
  })

  console.trace(`[${SERVICE} Redis] Establishing Redis Connection...`)
  await client.connect()
  console.info(`[${SERVICE} Redis] Redis Connection Established`)
  return client
}

async function releaseClient (client, forced = false) {
  if (!client) {
    console.error(`[${SERVICE} Redis] Disconnection to Redis failed as it is not connected`)
    return
  }

  if (!forced) {
    client.quit()
    console.error(`[${SERVICE} Redis] Redis Connection Disconnected`)
  } else {
    await client.disconnect()
    console.error(`[${SERVICE} Redis] Redis Connection Disconnected Forcefully`)
  }
}
