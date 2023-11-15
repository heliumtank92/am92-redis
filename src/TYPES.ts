import { RedisClientOptions, RedisClientType, RedisDefaultModules } from 'redis'

/**
 * Type definition of config object for RedisSdk Class
 *
 * @interface
 */
export interface REDIS_CONFIG {
  /**
   * Redis Connection Configuration as defined in 'redis' package
   */
  CONNECTION_CONFIG: RedisClientOptions
  /**
   * String to prefix all Redis keys when using the RedisSdk instance
   */
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
