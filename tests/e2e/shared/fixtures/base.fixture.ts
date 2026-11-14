import { test as base } from "@playwright/test";
import { DashboardPage } from "../pages/dashboard.page";

type PageFixtures = {
  dashboardPage: DashboardPage;
};

export const test = base.extend<PageFixtures>({
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },
});

export { expect } from "@playwright/test";
