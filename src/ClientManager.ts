import { RedisClientOptions, createClient } from 'redis'
import { SERVICE } from './CONFIG'
import { RedisClient } from './TYPES'

/** @ignore */
export default class ClientManager {
  /** @ignore */
  static createClient(connectionConfig: RedisClientOptions): RedisClient {
    const client = createClient(connectionConfig)

    client.on('error', error => {
      const fatalLogFunc = console.fatal || console.error
      fatalLogFunc(`[${SERVICE} Redis] Redis Connection Error`, error)
      process.exit(1)
    })

    return client
  }

  /** @ignore */
  static async releaseClient(
    client: RedisClient,
    forced: boolean = false
  ): Promise<void> {
    if (!forced) {
      client.quit()
      console.error(`[${SERVICE} Redis] Redis Connection Disconnected`)
    } else {
      await client.disconnect()
      console.error(
        `[${SERVICE} Redis] Redis Connection Disconnected Forcefully`
      )
    }
  }
}
