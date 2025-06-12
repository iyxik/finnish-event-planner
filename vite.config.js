import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/css/app.css", "resources/js/app.jsx"],
            refresh: true,
        }),
        react(),
    ],
    // ADD THIS BLOCK
    server: {
        proxy: {
            "/api": {
                // Any request starting with /api
                target: "http://localhost:8000", // Forward to your Laravel backend
                changeOrigin: true, // Necessary for virtual hosts or different origins
                // If you are using Laravel Sanctum for CSRF protection and authentication,
                // you will likely need to proxy these routes too:
                // '/sanctum/csrf-cookie': {
                //     target: 'http://localhost:8000',
                //     changeOrigin: true,
                // },
                // '/login': { // If your login endpoint is /login (not /api/login)
                //     target: 'http://localhost:8000',
                //     changeOrigin: true,
                // },
                // '/logout': { // If your logout endpoint is /logout (not /api/logout)
                //     target: 'http://localhost:8000',
                //     changeOrigin: true,
                // },
            },
        },
    },
});
