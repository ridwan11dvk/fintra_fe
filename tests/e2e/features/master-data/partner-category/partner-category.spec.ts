import { expect, test } from "./partner-category.fixture";

test.describe("Partner Category Master Data", () => {
  test.beforeEach(async ({ partnerCategoryPage }) => {
    await partnerCategoryPage.goto();
    await partnerCategoryPage.waitForTableLoad();
  });

  test.describe("Page Load", () => {
    test("should display the partner category page with correct title", async ({
      partnerCategoryPage,
    }) => {
      await expect(partnerCategoryPage.pageTitle).toBeVisible();
      await expect(partnerCategoryPage.pageTitle).toHaveText(
        "Partner Category",
      );
    });

    test("should display the data table", async ({ partnerCategoryPage }) => {
      await expect(partnerCategoryPage.dataTable.container).toBeVisible();
    });

    test("should display action buttons", async ({ partnerCategoryPage }) => {
      await expect(partnerCategoryPage.addButton).toBeVisible();
    });

    test("should display search input", async ({ partnerCategoryPage }) => {
      await expect(partnerCategoryPage.searchInput).toBeVisible();
    });
  });

  test.describe("Search", () => {
    test("should filter table results when searching", async ({
      partnerCategoryPage,
    }) => {
      const firstRowText = await partnerCategoryPage.dataTable
        .getRow(0)
        .locator("td")
        .nth(1)
        .textContent();

      if (firstRowText) {
        await partnerCategoryPage.search(firstRowText);
        await partnerCategoryPage.waitForPageLoad();
        await partnerCategoryPage.dataTable.expectRowWithText(firstRowText);
      }
    });

    test("should show empty state for non-matching search", async ({
      partnerCategoryPage,
    }) => {
      await partnerCategoryPage.search("ZZZZNONEXISTENT99999");
      await partnerCategoryPage.waitForPageLoad();

      await expect(
        partnerCategoryPage.dataTable.container.getByText("No results."),
      ).toBeVisible();
    });
  });

  test.describe("CRUD Operations", () => {
    test("should open the create form modal", async ({
      partnerCategoryPage,
    }) => {
      await partnerCategoryPage.openCreateForm();
      await partnerCategoryPage.formModal.expectTitle("Add Partner Category");
    });

    test("should close create modal on cancel", async ({
      partnerCategoryPage,
    }) => {
      await partnerCategoryPage.openCreateForm();
      const cancelButton = partnerCategoryPage.formModal.container.getByRole(
        "button",
        { name: "Close" },
      );
      await cancelButton.click();
      await partnerCategoryPage.formModal.expectHidden();
    });
  });
});
