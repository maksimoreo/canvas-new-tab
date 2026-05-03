import { defineConfig } from 'wxt'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react', '@wxt-dev/auto-icons'],
  vite: () => ({
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './'),
      },
    },
  }),
  manifest: {
    permissions: ['storage'],
  },
  autoIcons: {
    developmentIndicator: false,
    baseIconPath: 'assets/icon.svg',
  },
})
