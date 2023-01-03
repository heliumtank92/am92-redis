"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var {
  REDIS_ENABLED = 'false',
  REDIS_AUTH_ENABLED = 'false',
  REDIS_CHECK_SERVER_IDENTITY = 'false',
  REDIS_HOST = '',
  REDIS_PORT = '',
  REDIS_KEY_PREFIX = '',
  REDIS_AUTH = ''
} = process.env;
var ENABLED = REDIS_ENABLED === 'true';
var CONNECTION_CONFIG = {};
var REQUIRED_CONFIG = [];
var MISSING_CONFIG = [];
if (ENABLED) {
  REQUIRED_CONFIG.push('REDIS_HOST');
  REQUIRED_CONFIG.push('REDIS_PORT');
  var AUTH_ENABLED = REDIS_AUTH_ENABLED === 'true';
  var CHECK_SERVER_IDENTITY = REDIS_CHECK_SERVER_IDENTITY === 'true';
  if (AUTH_ENABLED) {
    REQUIRED_CONFIG.push('REDIS_AUTH');
  }
  REQUIRED_CONFIG.forEach(function (key) {
    if (!process.env[key]) {
      MISSING_CONFIG.push(key);
    }
  });
  if (MISSING_CONFIG.length) {
    console.error("[Error] Redis Config Missing: ".concat(MISSING_CONFIG.join(', ')));
    process.exit(1);
  }
  CONNECTION_CONFIG = {
    host: REDIS_HOST,
    port: REDIS_PORT
  };
  if (AUTH_ENABLED) {
    CONNECTION_CONFIG.password = REDIS_AUTH;
  }
  if (CHECK_SERVER_IDENTITY) {
    CONNECTION_CONFIG.tls = {
      checkServerIdentity: () => undefined
    };
  }
}
var CONFIG = {
  CONNECTION_CONFIG,
  KEY_PREFIX: REDIS_KEY_PREFIX
};
var _default = CONFIG;
exports.default = _default;