import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   host: '192.168.0.58',  // Allows external network devices to access the server
  //   port: 5175,        // The port you're using, can change this if needed
  //   open: true,        // Optional: Automatically open the browser when the server starts
  // },
});
