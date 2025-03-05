import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'components': path.resolve(__dirname, './src/components'),
      'services': path.resolve(__dirname, './src/services'),
      'types': path.resolve(__dirname, './src/types'),
      'features': path.resolve(__dirname, './src/features'),
      'hooks': path.resolve(__dirname, './src/hooks'),
      'lib': path.resolve(__dirname, './src/lib')
    }
  }
})
