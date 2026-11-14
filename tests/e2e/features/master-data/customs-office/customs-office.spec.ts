import { expect, test } from "./customs-office.fixture";

test.describe("Customs Office Master Data", () => {
  test.beforeEach(async ({ customsOfficePage }) => {
    await customsOfficePage.goto();
    await customsOfficePage.waitForTableLoad();
  });

  test.describe("Page Load", () => {
    test("should display the customs office page with correct title", async ({
      customsOfficePage,
    }) => {
      await expect(customsOfficePage.pageTitle).toBeVisible();
      await expect(customsOfficePage.pageTitle).toHaveText("Customs Office");
    });

    test("should display the data table", async ({ customsOfficePage }) => {
      await expect(customsOfficePage.dataTable.container).toBeVisible();
    });

    test("should display action buttons", async ({ customsOfficePage }) => {
      await expect(customsOfficePage.addButton).toBeVisible();
    });

    test("should display search input", async ({ customsOfficePage }) => {
      await expect(customsOfficePage.searchInput).toBeVisible();
    });
  });

  test.describe("Search", () => {
    test("should filter table results when searching", async ({
      customsOfficePage,
    }) => {
      const firstRowText = await customsOfficePage.dataTable
        .getRow(0)
        .locator("td")
        .nth(1)
        .textContent();

      if (firstRowText) {
        await customsOfficePage.search(firstRowText);
        await customsOfficePage.waitForPageLoad();
        await customsOfficePage.dataTable.expectRowWithText(firstRowText);
      }
    });

    test("should show empty state for non-matching search", async ({
      customsOfficePage,
    }) => {
      await customsOfficePage.search("ZZZZNONEXISTENT99999");
      await customsOfficePage.waitForPageLoad();

      await expect(
        customsOfficePage.dataTable.container.getByText("No results."),
      ).toBeVisible();
    });
  });

  test.describe("CRUD Operations", () => {
    test("should open the create form modal", async ({ customsOfficePage }) => {
      await customsOfficePage.openCreateForm();
      await customsOfficePage.formModal.expectTitle("Add Customs Office");
    });

    test("should close create modal on cancel", async ({
      customsOfficePage,
    }) => {
      await customsOfficePage.openCreateForm();
      const cancelButton = customsOfficePage.formModal.container.getByRole(
        "button",
        { name: "Close" },
      );
      await cancelButton.click();
      await customsOfficePage.formModal.expectHidden();
    });
  });
});
