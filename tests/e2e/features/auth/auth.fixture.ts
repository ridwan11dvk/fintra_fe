import { test as base } from "@playwright/test";
import { DashboardPage } from "../../shared/pages/dashboard.page";
import { LoginPage } from "./login.page";

type AuthFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
};

/**
 * Auth-aware test fixture.
 * Use `unauthenticatedTest` for tests that need a fresh browser (no storageState).
 * The default `test` from base.fixture.ts already uses storageState via the config.
 */
export const unauthenticatedTest = base.extend<AuthFixtures>({
  storageState: async ({}, use) => {
    await use({ cookies: [], origins: [] });
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },
});

export { expect } from "@playwright/test";
