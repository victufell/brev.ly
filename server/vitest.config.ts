import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/test/**/*.test.ts'],
    exclude: ['node_modules', 'dist', 'src/test/integration'],
    testTimeout: 10000,
  },
}); 