// eslint.config.mjs
import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['.gitignore'],
  rules: {
    'no-console': 'off',
  },
})
