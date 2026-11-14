import { expect, test } from "../../shared/fixtures/base.fixture";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
  });

  test("should load the dashboard page", async ({ dashboardPage }) => {
    await dashboardPage.waitForPageLoad();
    await expect(dashboardPage.page).toHaveURL(/\/dashboard/);
  });

  test("should display sidebar navigation", async ({ dashboardPage }) => {
    await expect(dashboardPage.sidebar.container).toBeVisible();
  });

  test("should display header", async ({ dashboardPage }) => {
    await expect(dashboardPage.header.container).toBeVisible();
  });
});
