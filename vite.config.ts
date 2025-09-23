import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path, { resolve } from 'path';
import { loadEnv } from 'vite';
import { execSync } from 'child_process';
import { ValidateEnv } from '@julr/vite-plugin-validate-env';

const ENV_DIR = './env';

// Refer to documentation on how to configure the Vite config:
// https://vitejs.dev/config
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ENV_DIR);

  // For the Git version.
  const gitCommitHash = execSync('git rev-parse --short HEAD || echo "0000000"')
    .toString()
    .trim();

  process.env.VITE_GIT_COMMIT_HASH = gitCommitHash;

  return {
    base: mode === 'production' 
      ? `/apps/${env.VITE_APP_ID}`
      : '/',
    plugins: [
      react(),
      [
        ValidateEnv({
          configFile: 'env.config',
        }),
      ],
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@env': path.resolve(__dirname, 'env'),
      },
    },
    test: {
      setupFiles: [resolve(__dirname, './src/utils/test/setupTests.ts')],
      environment: 'jsdom',
      include: ['src/**/*.test.tsx', 'src/**/*.test.ts'],
      globals: true,
      coverage: {
        all: true,
        provider: 'v8',
        reporter: ['text', 'html', 'clover', 'json', 'cobertura'],
      },
    },
    server: {
      port: 3000,
      proxy: {},
    },
    build: { sourcemap: true },
    envDir: ENV_DIR,
  };
});
