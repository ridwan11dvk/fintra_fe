import { expect, test } from "./currency.fixture";

test.describe("Currency Master Data", () => {
  test.beforeEach(async ({ currencyPage }) => {
    await currencyPage.goto();
    await currencyPage.waitForTableLoad();
  });

  test.describe("Page Load", () => {
    test("should display the currency page with correct title", async ({
      currencyPage,
    }) => {
      await expect(currencyPage.pageTitle).toBeVisible();
      await expect(currencyPage.pageTitle).toHaveText("Currency");
    });

    test("should display the data table", async ({ currencyPage }) => {
      await expect(currencyPage.dataTable.container).toBeVisible();
    });

    test("should display action buttons", async ({ currencyPage }) => {
      await expect(currencyPage.addButton).toBeVisible();
    });

    test("should display search input", async ({ currencyPage }) => {
      await expect(currencyPage.searchInput).toBeVisible();
    });
  });

  test.describe("Search", () => {
    test("should filter table results when searching", async ({
      currencyPage,
    }) => {
      const firstRowText = await currencyPage.dataTable
        .getRow(0)
        .locator("td")
        .nth(1)
        .textContent();

      if (firstRowText) {
        await currencyPage.search(firstRowText);
        await currencyPage.waitForPageLoad();
        await currencyPage.dataTable.expectRowWithText(firstRowText);
      }
    });

    test("should show empty state for non-matching search", async ({
      currencyPage,
    }) => {
      await currencyPage.search("ZZZZNONEXISTENT99999");
      await currencyPage.waitForPageLoad();

      await expect(
        currencyPage.dataTable.container.getByText("No results."),
      ).toBeVisible();
    });
  });

  test.describe("CRUD Operations", () => {
    test("should open the create form modal", async ({ currencyPage }) => {
      await currencyPage.openCreateForm();
      await currencyPage.formModal.expectVisible();
    });

    test("should close create modal on cancel", async ({ currencyPage }) => {
      await currencyPage.openCreateForm();
      const cancelButton = currencyPage.formModal.container.getByRole(
        "button",
        { name: "Close" },
      );
      await cancelButton.click();
      await currencyPage.formModal.expectHidden();
    });
  });
});
