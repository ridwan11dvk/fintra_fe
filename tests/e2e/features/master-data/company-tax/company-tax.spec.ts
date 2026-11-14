import { expect, test } from "./company-tax.fixture";

test.describe("Company Tax Master Data", () => {
  test.beforeEach(async ({ companyTaxPage }) => {
    await companyTaxPage.goto();
    await companyTaxPage.waitForTableLoad();
  });

  test("should display the company tax page", async ({ companyTaxPage }) => {
    await expect(companyTaxPage.pageTitle).toBeVisible();
  });

  test("should display the data table", async ({ companyTaxPage }) => {
    await expect(companyTaxPage.dataTable.container).toBeVisible();
  });

  test("should display add button", async ({ companyTaxPage }) => {
    await expect(companyTaxPage.addButton).toBeVisible();
  });
});
