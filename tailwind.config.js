/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ir: {
          navy: '#0B3B60',       // Official IR Header Blue
          darknavy: '#062038',   // Deeper Navy
          maroon: '#800000',     // Classic Indian Railways Maroon
          crimson: '#991B1B',    // Critical alert red
          gold: '#C27803',       // Seal gold accent
          surface: '#FFFFFF',    // Crisp card surface
          bg: '#F1F5F9',         // Government app background
          panel: '#F8FAFC',      // Table header & subpanel
          border: '#CBD5E1',     // Standard form & table borders
          borderLight: '#E2E8F0',// Subtle border
          text: '#0F172A',       // Primary black text
          muted: '#475569',      // Secondary label text
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
