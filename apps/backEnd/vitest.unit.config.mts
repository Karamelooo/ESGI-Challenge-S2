import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['test/**/*.unit.test.js'],
    testTimeout: 30000,
    hookTimeout: 30000,
    environment: 'node',
  },
})
