"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _redis = require("redis");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var clientManager = {
  createClient,
  releaseClient
};
var _default = clientManager;
exports.default = _default;
function createClient() {
  return _createClient.apply(this, arguments);
}
function _createClient() {
  _createClient = _asyncToGenerator(function* () {
    var connectionConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var client = (0, _redis.createClient)(connectionConfig);
    client.on('error', error => {
      console.error('Redis Client Error', error);
      process.exit(1);
    });
    yield client.connect();
    return client;
  });
  return _createClient.apply(this, arguments);
}
function releaseClient(_x) {
  return _releaseClient.apply(this, arguments);
}
function _releaseClient() {
  _releaseClient = _asyncToGenerator(function* (client) {
    var forced = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (!forced) {
      if (client.quit) {
        yield client.quit();
      }
    } else {
      if (client.end) {
        yield client.end(true);
      }
    }
  });
  return _releaseClient.apply(this, arguments);
}