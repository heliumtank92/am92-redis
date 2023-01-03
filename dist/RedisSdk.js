"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _clientManager = _interopRequireDefault(require("./clientManager.js"));
var _CONFIG = _interopRequireDefault(require("./CONFIG.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
class RedisSdk {
  constructor() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var {
      CONNECTION_CONFIG,
      KEY_PREFIX = ''
    } = config;
    this.CONNECTION_CONFIG = CONNECTION_CONFIG || _CONFIG.default.CONNECTION_CONFIG;
    this.KEY_PREFIX = KEY_PREFIX || _CONFIG.default.KEY_PREFIX;

    // Method Hard-binding
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.getClient = this.getClient.bind(this);
    this.prefixKey = this.prefixKey.bind(this);
    this.unprefixKey = this.unprefixKey.bind(this);
    this.get = this.get.bind(this);
    this.set = this.set.bind(this);
    this.getAndExpire = this.getAndExpire.bind(this);
    this.setAndExpire = this.setAndExpire.bind(this);
    this.del = this.del.bind(this);
    this.keys = this.keys.bind(this);
    this.delByPattern = this.delByPattern.bind(this);
    this.incrBy = this.incrBy.bind(this);
    this.incrByAndExpire = this.incrByAndExpire.bind(this);
    this.decrBy = this.decrBy.bind(this);
    this.decrByAndExpire = this.decrByAndExpire.bind(this);
    this.exists = this.exists.bind(this);
  }
  connect() {
    var _this = this;
    return _asyncToGenerator(function* () {
      var {
        CONNECTION_CONFIG
      } = _this;
      _this.client = yield _clientManager.default.createClient(CONNECTION_CONFIG);
    })();
  }
  disconnect() {
    var _arguments = arguments,
      _this2 = this;
    return _asyncToGenerator(function* () {
      var forced = _arguments.length > 0 && _arguments[0] !== undefined ? _arguments[0] : false;
      if (_this2.client) {
        yield _clientManager.default.releaseClient(_this2.client, forced);
        delete _this2.client;
      } else {
        console.error('Disconnection to Redis failed as it is not connected');
      }
    })();
  }
  getClient() {
    if (this.client) {
      return this.client;
    }
    throw new Error('Unable to get Redis Client as its not connected');
  }
  prefixKey() {
    var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    if (typeof key !== 'string') {
      return '';
    }
    var {
      KEY_PREFIX
    } = this;
    var prefixPattern = "".concat(KEY_PREFIX, "__");
    var hasPrefix = key.indexOf(prefixPattern) === 0;
    var prefixedKey = !hasPrefix && "".concat(prefixPattern).concat(key) || key;
    return prefixedKey;
  }
  unprefixKey() {
    var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    if (typeof key !== 'string') {
      return '';
    }
    var {
      KEY_PREFIX
    } = this;
    var prefixPattern = "".concat(KEY_PREFIX, "__");
    var hasPrefix = key.indexOf(prefixPattern) === 0;
    var unprefixedKey = !hasPrefix && key.split(prefixPattern)[1] || key;
    return unprefixedKey;
  }
  get() {
    var _arguments2 = arguments,
      _this3 = this;
    return _asyncToGenerator(function* () {
      var key = _arguments2.length > 0 && _arguments2[0] !== undefined ? _arguments2[0] : '';
      var options = _arguments2.length > 1 ? _arguments2[1] : undefined;
      // Get Redis Client
      var client = _this3.getClient();

      // Implement Logic
      var prefixedKey = _this3.prefixKey(key);
      var value = yield client.get(prefixedKey, options);

      // Return Value
      return value;
    })();
  }
  set() {
    var _arguments3 = arguments,
      _this4 = this;
    return _asyncToGenerator(function* () {
      var key = _arguments3.length > 0 && _arguments3[0] !== undefined ? _arguments3[0] : '';
      var value = _arguments3.length > 1 && _arguments3[1] !== undefined ? _arguments3[1] : '';
      var options = _arguments3.length > 2 ? _arguments3[2] : undefined;
      // Get Redis Client
      var client = _this4.getClient();

      // Implement Logic and Handle TTL
      var prefixedKey = _this4.prefixKey(key);
      yield client.set(prefixedKey, value, options);
    })();
  }
  getAndExpire() {
    var _arguments4 = arguments,
      _this5 = this;
    return _asyncToGenerator(function* () {
      var key = _arguments4.length > 0 && _arguments4[0] !== undefined ? _arguments4[0] : '';
      var ttlInSecs = _arguments4.length > 1 ? _arguments4[1] : undefined;
      var options = _arguments4.length > 2 ? _arguments4[2] : undefined;
      // Get Redis Client
      var client = _this5.getClient();

      // Implement Logic and Handle TTL
      var prefixedKey = _this5.prefixKey(key);
      var value = yield client.get(prefixedKey, options);
      if (ttlInSecs) {
        yield client.expire(prefixedKey, ttlInSecs);
      }

      // Return Value
      return value;
    })();
  }
  setAndExpire() {
    var _arguments5 = arguments,
      _this6 = this;
    return _asyncToGenerator(function* () {
      var key = _arguments5.length > 0 && _arguments5[0] !== undefined ? _arguments5[0] : '';
      var value = _arguments5.length > 1 && _arguments5[1] !== undefined ? _arguments5[1] : '';
      var ttlInSecs = _arguments5.length > 2 ? _arguments5[2] : undefined;
      var options = _arguments5.length > 3 ? _arguments5[3] : undefined;
      // Get Redis Client
      var client = _this6.getClient();

      // Implement Logic and Handle TTL
      var prefixedKey = _this6.prefixKey(key);
      yield client.set(prefixedKey, value, options);
      if (ttlInSecs) {
        yield client.expire(prefixedKey, ttlInSecs);
      }
    })();
  }
  del() {
    var _arguments6 = arguments,
      _this7 = this;
    return _asyncToGenerator(function* () {
      var key = _arguments6.length > 0 && _arguments6[0] !== undefined ? _arguments6[0] : '';
      // Get Redis Client
      var client = _this7.getClient();

      // Implement Logic
      var prefixedKey = _this7.prefixKey(key);
      yield client.del(prefixedKey);
    })();
  }
  keys() {
    var _arguments7 = arguments,
      _this8 = this;
    return _asyncToGenerator(function* () {
      var pattern = _arguments7.length > 0 && _arguments7[0] !== undefined ? _arguments7[0] : '';
      // Get Redis Client
      var client = _this8.getClient();

      // Implement Logic
      var searchPatten = _this8.prefixKey(pattern);
      var prefixedKeys = yield client.keys(searchPatten);
      var values = prefixedKeys.map(_this8.unprefixKey);
      return values;
    })();
  }
  delByPattern() {
    var _arguments8 = arguments,
      _this9 = this;
    return _asyncToGenerator(function* () {
      var pattern = _arguments8.length > 0 && _arguments8[0] !== undefined ? _arguments8[0] : '';
      var foundKeys = yield _this9.keys(pattern);
      var promises = foundKeys.map(_this9.del);
      var response = yield Promise.all(promises);
      return response;
    })();
  }
  incrBy() {
    var _arguments9 = arguments,
      _this10 = this;
    return _asyncToGenerator(function* () {
      var key = _arguments9.length > 0 && _arguments9[0] !== undefined ? _arguments9[0] : '';
      var value = _arguments9.length > 1 && _arguments9[1] !== undefined ? _arguments9[1] : 0;
      // Get Redis Client
      var client = _this10.getClient();

      // Implement Logic and Handle TTL
      var prefixedKey = _this10.prefixKey(key);
      var incrValue = yield client.incrBy(prefixedKey, value);
      return incrValue;
    })();
  }
  incrByAndExpire() {
    var _arguments10 = arguments,
      _this11 = this;
    return _asyncToGenerator(function* () {
      var key = _arguments10.length > 0 && _arguments10[0] !== undefined ? _arguments10[0] : '';
      var value = _arguments10.length > 1 && _arguments10[1] !== undefined ? _arguments10[1] : 0;
      var ttlInSecs = _arguments10.length > 2 ? _arguments10[2] : undefined;
      // Get Redis Client
      var client = _this11.getClient();

      // Implement Logic and Handle TTL
      var prefixedKey = _this11.prefixKey(key);
      var incrValue = yield client.incrBy(prefixedKey, value);
      if (ttlInSecs) {
        yield client.expire(prefixedKey, ttlInSecs);
      }

      // Return Value
      return incrValue;
    })();
  }
  decrBy() {
    var _arguments11 = arguments,
      _this12 = this;
    return _asyncToGenerator(function* () {
      var key = _arguments11.length > 0 && _arguments11[0] !== undefined ? _arguments11[0] : '';
      var value = _arguments11.length > 1 && _arguments11[1] !== undefined ? _arguments11[1] : 0;
      // Get Redis Client
      var client = _this12.getClient();

      // Implement Logic and Handle TTL
      var prefixedKey = _this12.prefixKey(key);
      var decrValue = yield client.decrBy(prefixedKey, value);
      return decrValue;
    })();
  }
  decrByAndExpire() {
    var _arguments12 = arguments,
      _this13 = this;
    return _asyncToGenerator(function* () {
      var key = _arguments12.length > 0 && _arguments12[0] !== undefined ? _arguments12[0] : '';
      var value = _arguments12.length > 1 && _arguments12[1] !== undefined ? _arguments12[1] : 0;
      var ttlInSecs = _arguments12.length > 2 ? _arguments12[2] : undefined;
      // Get Redis Client
      var client = _this13.getClient();

      // Implement Logic and Handle TTL
      var prefixedKey = _this13.prefixKey(key);
      var decrValue = yield client.decrBy(prefixedKey, value);
      if (ttlInSecs) {
        yield client.expire(prefixedKey, ttlInSecs);
      }

      // Return Value
      return decrValue;
    })();
  }
  exists() {
    var _arguments13 = arguments,
      _this14 = this;
    return _asyncToGenerator(function* () {
      var keys = _arguments13.length > 0 && _arguments13[0] !== undefined ? _arguments13[0] : [];
      // Get Redis Client
      var client = _this14.getClient();

      // Implement Logic
      var prefixedKeys;
      if (keys instanceof Array) {
        prefixedKeys = keys.map(_this14.prefixKey);
      } else {
        prefixedKeys = [..._arguments13].map(_this14.prefixKey);
      }
      var keyCount = yield client.exists(prefixedKeys);
      return keyCount;
    })();
  }
}
exports.default = RedisSdk;