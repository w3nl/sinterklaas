// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  // een heel hoofdstuk uitspelen duurt een minuut of twee als alle tests tegelijk draaien
  timeout: 240_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    // PW_CHROMIUM: een al geïnstalleerde Chromium gebruiken in plaats van die van Playwright (handig zonder internet)
    ...(process.env.PW_CHROMIUM ? { launchOptions: { executablePath: process.env.PW_CHROMIUM } } : {}),
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } }, testIgnore: /phone\.spec/ },
    { name: 'phone', use: { ...devices['Pixel 7'] }, testMatch: /phone\.spec/ },
    // Firefox speelt de bewegingstests als PW_FIREFOX=1 (zo staat het in de workflow "Speel het spel").
    ...(process.env.PW_FIREFOX ? [{ name: 'firefox', use: { ...devices['Desktop Firefox'], viewport: { width: 1280, height: 900 } }, testMatch: /motion\.spec/ }] : []),
  ],
  webServer: {
    command: 'node tests/serve.js',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
  },
});
