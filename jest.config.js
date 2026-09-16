const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './', // next.config.js jahan hai
})

const customJestConfig = {
  testEnvironment: 'node', // API routes node env mein chalte hain (browser nahi)
}

module.exports = createJestConfig(customJestConfig)