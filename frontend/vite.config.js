import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": "https://home-harbor-backend.vercel.app", // 将所有'/api'开头的请求代理到http://localhost:8000
    },
  },
  plugins: [react()],
});
