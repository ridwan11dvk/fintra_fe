import {
  defineConfig,
  devices,
  ScreenshotMode,
  VideoMode,
} from "@playwright/test";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env.test") });

const baseURL = process.env.BASE_URL || "http://localhost:5173";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: Boolean(process.env.PARALLEL ?? false),
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : Number(process.env.TEST_RETRIES ?? 0),
  workers: 1,
  timeout: Number(process.env.TEST_TIMEOUT ?? 30_000),
  expect: {
    timeout: Number(process.env.EXPLICIT_WAIT ?? 15_000),
  },
  reporter: [["html"], ["list"], ["json"]],
  outputDir: ".output/tests/e2e",

  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: (process.env.SCREENSHOT_MODE ??
      "only-on-failure") as ScreenshotMode,
    video: (process.env.VIDEO_MODE ?? "retain-on-failure") as VideoMode,
    actionTimeout: Number(process.env.IMPLICIT_WAIT ?? 10_000),
    headless: process.env.HEADLESS === "true",
    launchOptions: {
      slowMo: Number(process.env.SLOW_MO ?? 0),
    },
  },

  projects: [
    {
      name: "setup",
      testMatch: /^.*\.setup\.ts$/,
    },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["setup"],
    },
  ],

  webServer: {
    command: "npm run dev",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
