# @am92/redis

[![npm version](https://img.shields.io/npm/v/@am92/redis?style=for-the-badge)](https://www.npmjs.com/package/@am92/redis)&nbsp;
[![ECMAScript Module](https://img.shields.io/badge/ECMAScript-Module%20Only-red?style=for-the-badge)](https://nodejs.org/api/esm.html)&nbsp;
[![License: MIT](https://img.shields.io/npm/l/@am92/redis?color=yellow&style=for-the-badge)](https://opensource.org/licenses/MIT)&nbsp;
[![Vulnerabilities: Snyk](https://img.shields.io/snyk/vulnerabilities/npm/@am92/redis?style=for-the-badge)](https://security.snyk.io/package/npm/@am92%2Fredis)&nbsp;
[![Downloads](https://img.shields.io/npm/dy/@am92/redis?style=for-the-badge)](https://npm-stat.com/charts.html?package=%40m92%2Fredis)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@am92/redis?style=for-the-badge)](https://bundlephobia.com/package/@am92/redis)

<br />

This is an SDK Wrapper which provides Redis functionalities to interact with a Redis Instance. This package uses [Node-Redis](https://www.npmjs.com/package/redis) package using its v4.x.x version.

This package provides the following functionalities:
* Redis Connection Helper
* Redis SDK Class

<br />

## Table of Content
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Creating a Redis SDK Instance](#creating-a-redis-sdk-instance)
  - [Properties of RedisSdk Instance](#properties-of-redissdk-instance)
  - [Methods of RedisSdk Instance](#methods-of-redissdk-instance)
- [Contributors](#contributors)
- [Resources](#resources)
- [License](#license)

<br />

## Installation
```bash
$ npm install --save @am92/redis
```
<br />

## Environment Variables
The following environment variables need to be set to work with this package:
```sh
##### Redis Config
export REDIS_ENABLED=false
export REDIS_AUTH_ENABLED=false
export REDIS_CHECK_SERVER_IDENTITY=false
export REDIS_HOST=
export REDIS_PORT=
export REDIS_KEY_PREFIX=
export REDIS_AUTH=
```

*Note:*
* *If 'REDIS_ENABLED' is set to 'true', 'REDIS_HOST' and 'REDIS_PORT' are required*
* *If 'REDIS_AUTH_ENABLED' is set to 'true', 'REDIS_AUTH'is required*
* *'REDIS_KEY_PREFIX' prepends all redis keys with the specified value*

<br />

## Creating a Redis SDK Instance
```javascript
import RedisSdk from '@am92/redis'

const redisSdk = new RedisSdk()
export default redisSdk
```

If you wish to pass your custom 'config' for the RedisSdk, then you can build it as follows:
*Note: You will have to call the redisSdk.connect() to establish a connection before using the RedisSdk Methods*

```javascript
import RedisSdk from '@am92/redis'

const config = {
  CONNECTION_CONFIG: {
    host: '',
    port: '',
    password: ''
  }
  KEY_PREFIX: ''
}

const redisSdk = new RedisSdk(config)
export default redisSdk
```

To manage redis connections for RedisSdk Instances with custom 'config', 'connect' and 'disconnect' Methods are provided and they can be called as shown below. The 'connect' method must be called before before using the RedisSdk Methods.

```javascript
// To establish a connection
await redisSdk.connect()

// To release the connection
await redisSdk.disconnect()
```

<br />

### Properties of RedisSdk Instance
| Properties                 | Description                       |
| :------------------------- | :-------------------------------- |
| redisSdk.CONNECTION_CONFIG | Connection Config used by the SDK |
| redisSdk.KEY_PREFIX        | Redis Key Prefix used by the SDK  |

<br />

### Methods of RedisSdk Instance
| Method                                                                    | Description                                             |
| :------------------------------------------------------------------------ | :------------------------------------------------------ |
| [redisSdk.get](#redissdkgetkey-options)                                   | Gets the value of a redis key                           |
| [redisSdk.set](#redissdksetkey-value-options)                             | Sets the value for a redis key                          |
| [redisSdk.getAndExpire](#redissdkgetandexpirekey-ttlinsecs-options)       | Gets the value of a redis key and sets its expiry       |
| [redisSdk.setAndExpire](#redissdksetandexpirekey-value-ttlinsecs-options) | Sets the value of a redis key and sets its expiry       |
| [redisSdk.del](#redissdkdelkey)                                           | Deletes a redis key                                     |
| [redisSdk.keys](#redissdkkeyspattern)                                     | Gets all redis keys for a given key pattern             |
| [redisSdk.delByPattern](#redissdkdelbypatternpattern)                     | Deletes all redis keys for a given key pattern          |
| [redisSdk.incrBy](#redissdkincrbykey-value)                               | Increments the value of a redis key                     |
| [redisSdk.incrByAndExpire](#redissdkincrbyandexpirekey-value-ttlinsecs)   | Increments the value of a redis key and sets its expiry |
| [redisSdk.decrBy](#redissdkdecrbykey-value)                               | Decrements the value of a redis key                     |
| [redisSdk.decrByAndExpire](#redissdkdecrbyandexpirekey-value-ttlinsecs)   | Decrements the value of a redis key and sets its expiry |
| [redisSdk.exists](#redissdkexistskeys)                                    | Returns if keys exists or not                           |

<br />

#### redisSdk.get(key, options)<br />
###### Arguments
* key (String): Redis key name
* options (Object): options as mentioned by 'get' method of redis package

###### Returns
* value (any): Value stored in redis

###### Example
```javascript
const value = await redisSdk.get(key, options)
```

<br />

#### redisSdk.set(key, value, options)<br />
###### Arguments
* key (String): Redis key name
* value (any): Value to be stored in redis
* options (Object): options as mentioned by 'set' method of redis package

###### Returns
* undefined

###### Example
```javascript
await redisSdk.set(key, value, options)
```

<br />

#### redisSdk.getAndExpire(key, ttlInSecs, options)<br />
###### Arguments
* key (String):  Redis key name
* ttlInSecs (Number): Redis key expiry in seconds
* options (Object): options as mentioned by 'get' method of redis package

###### Returns
* value (any): Value stored in redis

###### Example
```javascript
const value = await redisSdk.getAndExpire(key, ttlInSecs, options)
```

<br />

#### redisSdk.setAndExpire(key, value, ttlInSecs, options)<br />
###### Arguments
* key (String): Redis key name
* value (any): Value to be stored in redis
* ttlInSecs (Number): Redis key expiry in seconds
* options (Object): options as mentioned by 'set' method of redis package

###### Returns
* undefined

###### Example
```javascript
await redisSdk.setAndExpire(key, value, ttlInSecs, options)
```

<br />

#### redisSdk.del(key)<br />
###### Arguments
* key (String): Redis key name

###### Returns
* undefined

###### Example
```javascript
await redisSdk.del(key)
```

<br />

#### redisSdk.keys(pattern)<br />
###### Arguments
* pattern (String): Redis key pattern

###### Returns
* keys (Array): Array of keys

###### Example
```javascript
const keys = await redisSdk.keys(pattern)
```

<br />

#### redisSdk.delByPattern(pattern)<br />
###### Arguments
* pattern (String): Redis key pattern

###### Returns
* undefined

###### Example
```javascript
await redisSdk.delByPattern(pattern)
```

<br />

#### redisSdk.incrBy(key, value)<br />
###### Arguments
* key (String): Redis key name
* value (Number): Redis value to be incremented by *(Defaults to 0)*

###### Returns
* incrValue (Number): Incremented redis value

###### Example
```javascript
const incrValue = await redisSdk.incrBy(key, value)
```

<br />

#### redisSdk.incrByAndExpire(key, value, ttlInSecs)<br />
###### Arguments
* key (String): Redis key name
* value (Number): Redis value to be incremented by *(Defaults to 0)*
* ttlInSecs (Number): Redis key expiry in seconds

###### Returns
* incrValue (Number): Incremented redis value

###### Example
```javascript
const incrValue = await redisSdk.incrByAndExpire(key, value, ttlInSecs)
```

<br />

#### redisSdk.decrBy(key, value)<br />
###### Arguments
* key (String): Redis key name
* value (Number): Redis value to be decremented by *(Defaults to 0)*

###### Returns
* decrValue (Number): Decremented redis value

###### Example
```javascript
const decrValue = await redisSdk.decrBy(key, value)
```

<br />

#### redisSdk.decrByAndExpire(key, value, ttlInSecs)<br />
###### Arguments
* key (String): Redis key name
* value (Number): Redis value to be decremented by *(Defaults to 0)*
* ttlInSecs (Number): Redis key expiry in seconds

###### Returns
* decrValue (Number): Decremented redis value

###### Example
```javascript
const decrValue = await redisSdk.decrByAndExpire(key, value, ttlInSecs)
```

<br />

#### redisSdk.exists(keys)<br />
###### Arguments
* keys (Array): Array of redis key names

###### Returns
* keyCount (Number): Returns '0' if key does not exist and '1' if exists

###### Example
```javascript
const keyCount = await redisSdk.exists(keys)
```

<br />

## Contributors
<table>
  <tbody>
    <tr>
      <td align="center">
        <a href='https://github.com/ankitgandhi452'>
          <img src="https://avatars.githubusercontent.com/u/8692027?s=400&v=4" width="100px;" alt="Ankit Gandhi"/>
          <br />
          <sub><b>Ankit Gandhi</b></sub>
        </a>
      </td>
      <td align="center">
        <a href='https://github.com/agarwalmehul'>
          <img src="https://avatars.githubusercontent.com/u/8692023?s=400&v=4" width="100px;" alt="Mehul Agarwal"/>
          <br />
          <sub><b>Mehul Agarwal</b></sub>
        </a>
      </td>
    </tr>
  </tbody>
</table>

<br />

## Resources
* [Node-Redis](https://www.npmjs.com/package/redis)

<br />

## License
* [MIT](https://opensource.org/licenses/MIT)


<br />
<br />
