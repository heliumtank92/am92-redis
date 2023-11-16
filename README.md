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
    socket: {
      host: '',
      port: 6379,
      tls: true
    },
    password: ''
  }
  KEY_PREFIX: ''
}

const redisSdk = new RedisSdk(config)
export default redisSdk
```

To manage redis connections for RedisSdk Instances, 'connect' and 'disconnect' methods are provided and they can be called as shown below. The 'connect' method must be called before before using the RedisSdk Methods.

```javascript
// To establish a connection
await redisSdk.connect()

// To release the connection
await redisSdk.disconnect()

// To force release the connection
await redisSdk.disconnect(true)
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
