import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/css/app.css", "resources/js/main.jsx"],
            refresh: true,
        }),
        react(),
    ],
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:8000",
                changeOrigin: true,
                secure: false, // Set to true if your backend is HTTPS
            },
            // UNCOMMENT THESE LINES for Sanctum and Auth routes
            "/sanctum/csrf-cookie": {
                target: "http://localhost:8000",
                changeOrigin: true,
                secure: false, // Set to true if your backend is HTTPS
            },
            "/login": {
                target: "http://localhost:8000",
                changeOrigin: true,
                secure: false, // Set to true if your backend is HTTPS
            },
            "/logout": {
                target: "http://localhost:8000",
                changeOrigin: true,
                secure: false, // Set to true if your backend is HTTPS
            },
        },
    },
});
