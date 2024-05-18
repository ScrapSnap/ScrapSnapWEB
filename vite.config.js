import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig(() => {
    return {
        plugins: [
            vue(),
            /*VitePWA({
                registerType: 'autoUpdate',
                injectRegister: false,
                // Custom service worker
                srcDir: './public/', // Specify the directory where your custom service worker is located
                filename: 'custom-sw.js', // Use a custom filename for your service worker
                strategies: 'injectManifest',
                devOptions: {
                    enabled: true
                },
                workbox: {
                    globPatterns: ['/*.{js,css,html,ico,png,svg}']
                }
            })*/
            VitePWA({
                srcDir: "src",
                filename: "service-worker.js",
                strategies: "injectManifest",
                injectRegister: false,
                manifest: false,
                injectManifest: {
                    injectionPoint: undefined,
                },
            })
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        }
    };
});
