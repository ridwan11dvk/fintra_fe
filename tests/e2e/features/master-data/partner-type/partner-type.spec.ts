import { expect, test } from "./partner-type.fixture";

test.describe("Partner Type Master Data", () => {
  test.beforeEach(async ({ partnerTypePage }) => {
    await partnerTypePage.goto();
    await partnerTypePage.waitForTableLoad();
  });

  test("should display the partner type page", async ({ partnerTypePage }) => {
    await expect(partnerTypePage.pageTitle).toBeVisible();
  });

  test("should display the data table", async ({ partnerTypePage }) => {
    await expect(partnerTypePage.dataTable.container).toBeVisible();
  });

  test("should display add button", async ({ partnerTypePage }) => {
    await expect(partnerTypePage.addButton).toBeVisible();
  });
});
