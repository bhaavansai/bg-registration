// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["17353f14ce73.ngrok-free.app"], // your actual ngrok domain
    // host: true, // enable external access if needed
  },
  preview: {
    allowedHosts: ["17353f14ce73.ngrok-free.app"], // same for preview
  },
});
