import { defineConfig, devices } from '@playwright/test';

if (process.loadEnvFile) {
  try {
    process.loadEnvFile('.env');
  } catch {}
}

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 45000,
  expect: {
    timeout: 10000
  },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
    headless: true,
    trace: 'off',
  },
  webServer: process.env.PLAYWRIGHT_TEST_BASE_URL
    ? undefined
    : {
        command: "node .next/standalone/server.js",
        env: {
          PORT: '3000',
          DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5434/psyche_ai_test?schema=public',
          TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5434/psyche_ai_test?schema=public',
          AUTH_SECRET: process.env.AUTH_SECRET || 'psyche-e2e-auth-test-secret-minimum-32-chars-long-abcdef',
          AUTH_URL: 'http://localhost:3000',
          AUTH_TRUST_HOST: 'true',
          SMTP_HOST: 'smtp.psycheai.test',
          SMTP_USER: 'test_smtp_user',
          SMTP_PASSWORD: 'test_smtp_password',
        },
        port: 3000,
        reuseExistingServer: false,
        timeout: 120000,
      },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
