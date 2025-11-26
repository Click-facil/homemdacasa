import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        click: {
          bg: '#051020',       // Fundo azul escuro
          card: '#0f172a',     // Fundo dos cartões
          text: '#f1f5f9',     // Texto claro
          muted: '#94a3b8',    // Texto cinza
          primary: '#0ea5e9',  // Azul Neon (Ciano)
          cta: '#22c55e',      // Verde do botão
          ctaHover: '#16a34a', // Verde mais escuro
        }
      },
    },
  },
  plugins: [],
};
export default config;