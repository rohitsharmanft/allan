import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Allows external network devices to access the server
    port: 5173,        // The port you're using, can change this if needed
    open: true,        // Optional: Automatically open the browser when the server starts
  },
});
