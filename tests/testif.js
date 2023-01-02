import { test } from '@jest/globals'

const testIf = (condition) => (condition === 'true') ? test : test.skip

export default testIf
