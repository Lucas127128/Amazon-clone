import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  testIgnore: 'example.spec.ts',
  fullyParallel: true,
  reporter: [['list'], ['html']],
  use: {
    // baseURL: 'http://localhost:5174',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 15 Pro Max'] },
    // },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
  // webServer: {
  //   command: 'bunx vite',
  //   url: 'http://localhost:5174',
  //   reuseExistingServer: !process.env.CI,
  // },
});
