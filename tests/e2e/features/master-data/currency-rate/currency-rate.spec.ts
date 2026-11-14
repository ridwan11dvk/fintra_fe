import { expect, test } from "./currency-rate.fixture";

test.describe("Currency Rate Master Data", () => {
  test.beforeEach(async ({ currencyRatePage }) => {
    await currencyRatePage.goto();
    await currencyRatePage.waitForTableLoad();
  });

  test("should display the currency rate page with correct title", async ({
    currencyRatePage,
  }) => {
    await expect(currencyRatePage.pageTitle).toBeVisible();
  });

  test("should display the data table", async ({ currencyRatePage }) => {
    await expect(currencyRatePage.dataTable.container).toBeVisible();
  });

  test("should display add button", async ({ currencyRatePage }) => {
    await expect(currencyRatePage.addButton).toBeVisible();
  });

  test("should display search input", async ({ currencyRatePage }) => {
    await expect(currencyRatePage.searchInput).toBeVisible();
  });
});
