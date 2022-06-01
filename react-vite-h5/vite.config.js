import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import { createStyleImportPlugin } from 'vite-plugin-style-import'
export default defineConfig({
  plugins: [react(), createStyleImportPlugin({
    libs: [
      {
        libraryName: 'zarm',
        esModule: true,
        resolveStyle: (name) => {
          return `zarm/es/${name}/style/css`
        },
      },
    ],
  })],
  css: {
    modules: {
      localsConvention: 'dashesOnly'
    },
    preprocessorOptions: {
      less: {
        // 支持内联 JavaScript
        javascriptEnabled: true
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        // 当遇到/api路径时，将其转换成target的值
        target: 'http://localhost:7002/api/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '') // 将api重写为空
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'utils': path.resolve(__dirname, 'src/utils')
    }
  }
})
