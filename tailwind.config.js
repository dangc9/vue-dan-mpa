/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    './index.html',
    './src/**/*.vue',
    './src/**/*.jsx',
    './src/**/*.tsx',
    './page/**/index.html',
    './page/**/*.vue',
    './page/**/*.jsx',
    './page/**/*.tsx',
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [
    plugin(function ({ addComponents, theme }) {
      addComponents({
        '.el-bg-color': {
          backgroundColor: 'var(--el-bg-color)',
        },
        '.el-bg-color-overlay': {
          backgroundColor: 'var(--el-bg-color-overlay)',
        },
        '.el-border-color': {
          borderColor: 'var(--el-border-color)',
        },
        '.el-border': {
          border: '1px solid var(--el-border-color)',
        },
      })
    }),
  ],
}
