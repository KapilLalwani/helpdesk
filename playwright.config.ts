import { defineConfig, devices } from "@playwright/test";
import path from "path";

const SERVER_PORT = 3001;
const CLIENT_PORT = 5174;
const SERVER_URL = `http://localhost:${SERVER_PORT}`;
const CLIENT_URL = `http://localhost:${CLIENT_PORT}`;
const SERVER_DIR = path.resolve(__dirname, "packages/server");

export default defineConfig({
  testDir: "./e2e",
  outputDir: "./test-results",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  use: {
    baseURL: CLIENT_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "off",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: "bun run src/index.ts",
      cwd: SERVER_DIR,
      url: `${SERVER_URL}/api/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
      env: {
        DOTENV_CONFIG_PATH: path.resolve(SERVER_DIR, ".env.test"),
      },
    },
    {
      command: `bunx vite --port ${CLIENT_PORT}`,
      cwd: path.resolve(__dirname, "packages/client"),
      url: CLIENT_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
      env: {
        VITE_API_PROXY_TARGET: `http://localhost:${SERVER_PORT}`,
      },
    },
  ],
});
