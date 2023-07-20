import { RedisClientOptions, RedisClientType, RedisDefaultModules } from 'redis'

export interface REDIS_CONFIG {
  CONNECTION_CONFIG: RedisClientOptions
  KEY_PREFIX: string
}

/** @ignore */
export type RedisClient = RedisClientType<
  RedisDefaultModules,
  { [key: string]: any },
  { [key: string]: any }
>

declare global {
  /** @ignore */
  interface Console {
    success?(...data: any[]): void
    fatal?(...data: any[]): void
  }
}
