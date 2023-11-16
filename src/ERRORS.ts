import { RedisSdkErrorMap } from './TYPES'

/** @ignore */
export const CLIENT_NOT_CONNECTED_ERROR: RedisSdkErrorMap = {
  message: 'Invalid interpolateXml Arguments: templatePath cannot be blank',
  statusCode: 500,
  errorCode: 'RedisSdk::CLIENT_NOT_CONNECTED'
}
