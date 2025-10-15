// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// O nome do seu repositório é 'desenho-tecnico'
const REPO_NAME = 'desenho-tecnico';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: `/${REPO_NAME}/`, // Adiciona o subcaminho do repositório ao BASE_URL
});