import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Or use '0.0.0.0' for listening on all network interfaces
    port: 3000, // Optional: Specify a port (default is 5173)
},
})
