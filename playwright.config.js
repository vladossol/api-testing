import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5000',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
  },

  /* Start a local server before running the tests */
  webServer: {
    command: 'python mock_server/mock_server.py',
    url: 'http://localhost:5000/jobs',
    timeout: 60 * 1000,
    reuseExistingServer: !process.env.CI,
  }, 
});

