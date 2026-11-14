import { expect, test } from "./partner.fixture";

test.describe("Partner Master Data", () => {
  test.beforeEach(async ({ partnerPage }) => {
    await partnerPage.goto();
    await partnerPage.waitForTableLoad();
  });

  test.describe("Page Load", () => {
    test("should display the partner page with correct title", async ({
      partnerPage,
    }) => {
      await expect(partnerPage.pageTitle).toBeVisible();
    });

    test("should display the data table", async ({ partnerPage }) => {
      await expect(partnerPage.dataTable.container).toBeVisible();
    });

    test("should display action buttons", async ({ partnerPage }) => {
      await expect(partnerPage.addButton).toBeVisible();
    });

    test("should display search input", async ({ partnerPage }) => {
      await expect(partnerPage.searchInput).toBeVisible();
    });
  });

  test.describe("Search", () => {
    test("should filter table results when searching", async ({
      partnerPage,
    }) => {
      const firstRowText = await partnerPage.dataTable
        .getRow(0)
        .locator("td")
        .nth(1)
        .textContent();

      if (firstRowText) {
        await partnerPage.search(firstRowText);
        await partnerPage.waitForPageLoad();
        await partnerPage.dataTable.expectRowWithText(firstRowText);
      }
    });

    test("should show empty state for non-matching search", async ({
      partnerPage,
    }) => {
      await partnerPage.search("ZZZZNONEXISTENT99999");
      await partnerPage.waitForPageLoad();

      await expect(
        partnerPage.dataTable.container.getByText("No results."),
      ).toBeVisible();
    });
  });

  test.describe("CRUD Operations", () => {
    test("should open the create form", async ({ partnerPage }) => {
      await partnerPage.openCreateForm();
      await expect(partnerPage.createPageTitle).toBeVisible();
    });

    test("should close create form on cancel", async ({ partnerPage }) => {
      await partnerPage.openCreateForm();
      await partnerPage.backButton.click();
      await partnerPage.waitForPageLoad();
      await expect(partnerPage.pageTitle).toBeVisible();
    });
  });
});
