import { config } from 'dotenv';
import { beforeAll, afterAll, afterEach } from 'vitest';

config({ path: '.env.test' });

beforeAll(async () => {
  // Setup global test environment
});

afterEach(() => {
  // Clean up after each test
});

afterAll(async () => {
  // Cleanup after all tests
});