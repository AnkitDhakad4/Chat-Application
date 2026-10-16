import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  theme: {
        extend: {
            animation: {
                'border': 'border 4s linear infinite',
            },
            keyframes: {
                'border': {
                    to: { '--border-angle': '360deg' },
                }
            }                      
        },
    },
  plugins: [react(), tailwindcss()],
  server:
  {
    host: true,
    port : 5173,
  }
})


