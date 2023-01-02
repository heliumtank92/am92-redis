import { createClient as createRedisClient } from 'redis'

const clientManager = {
  createClient,
  releaseClient
}

export default clientManager

async function createClient (connectionConfig = {}) {
  const client = createRedisClient(connectionConfig)

  client.on('error', (error) => {
    console.error('Redis Client Error', error)
    process.exit(1)
  })

  await client.connect()
  return client
}

async function releaseClient (client, forced = false) {
  if (!forced) {
    if (client.quit) { await client.quit() }
  } else {
    if (client.end) { await client.end(true) }
  }
}
