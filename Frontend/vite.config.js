import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  base: './', // 👈 This line is the fix

  plugins: [react()],

    // ✅ Enable access from other devices

  server: {
    host: '0.0.0.0', // ✅ Allows access from any device on your local network
    port: 5173,      // ✅ Default Vite port
    strictPort: true,
    cors: true,      // ✅ Allow cross-origin requests
  }
})
