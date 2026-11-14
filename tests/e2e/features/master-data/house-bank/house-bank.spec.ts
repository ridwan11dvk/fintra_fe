import { expect, test } from "./house-bank.fixture";

test.describe("House Bank Master Data", () => {
  test.beforeEach(async ({ houseBankPage }) => {
    await houseBankPage.goto();
    await houseBankPage.waitForTableLoad();
  });

  test("should display the house bank page", async ({ houseBankPage }) => {
    await expect(houseBankPage.pageTitle).toBeVisible();
  });

  test("should display the data table", async ({ houseBankPage }) => {
    await expect(houseBankPage.dataTable.container).toBeVisible();
  });

  test("should display add button", async ({ houseBankPage }) => {
    await expect(houseBankPage.addButton).toBeVisible();
  });

  test("should display export button", async ({ houseBankPage }) => {
    await expect(houseBankPage.exportButton).toBeVisible();
  });

  test("should display import button", async ({ houseBankPage }) => {
    await expect(houseBankPage.importButton).toBeVisible();
  });
});
