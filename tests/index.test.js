import { describe } from '@jest/globals'
import testIf from './testif.js'

describe('Sample Module', () => {
  testIf('false')('Sample Test Case', async () => { })
})
