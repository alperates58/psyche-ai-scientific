import { defineConfig, devices } from '@playwright/test';

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
          DATABASE_URL: 'postgresql://mock:mock@localhost:5432/mock',
          AUTH_SECRET: 'psyche-e2e-auth-test-secret-minimum-32-chars-long-abcdef',
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
