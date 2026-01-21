import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 4,
  retries: 0,
  reporter: ['html', 'list'],

  use: {
    baseURL: 'http://localhost:5000',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
  },

  webServer: {
    command: 'python mock_server/mock_server.py',
    url: 'http://localhost:5000/jobs',
    reuseExistingServer: false,
    timeout: 60 * 1000,
  },
});
