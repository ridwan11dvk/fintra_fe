import { expect, test } from "./transaction-category.fixture";

test.describe("Transaction Category Master Data", () => {
  test.beforeEach(async ({ transactionCategoryPage }) => {
    await transactionCategoryPage.goto();
    await transactionCategoryPage.waitForTableLoad();
  });

  test.describe("Page Load", () => {
    test("should display the transaction category page with correct title", async ({
      transactionCategoryPage,
    }) => {
      await expect(transactionCategoryPage.pageTitle).toBeVisible();
      await expect(transactionCategoryPage.pageTitle).toHaveText(
        "Transaction Category",
      );
    });

    test("should display the data table", async ({
      transactionCategoryPage,
    }) => {
      await expect(transactionCategoryPage.dataTable.container).toBeVisible();
    });

    test("should display action buttons", async ({
      transactionCategoryPage,
    }) => {
      await expect(transactionCategoryPage.addButton).toBeVisible();
    });

    test("should display search input", async ({ transactionCategoryPage }) => {
      await expect(transactionCategoryPage.searchInput).toBeVisible();
    });
  });

  test.describe("Search", () => {
    test("should filter table results when searching", async ({
      transactionCategoryPage,
    }) => {
      const firstRowText = await transactionCategoryPage.dataTable
        .getRow(0)
        .locator("td")
        .nth(1)
        .textContent();

      if (firstRowText) {
        await transactionCategoryPage.search(firstRowText);
        await transactionCategoryPage.waitForPageLoad();
        await transactionCategoryPage.dataTable.expectRowWithText(firstRowText);
      }
    });

    test("should show empty state for non-matching search", async ({
      transactionCategoryPage,
    }) => {
      await transactionCategoryPage.search("ZZZZNONEXISTENT99999");
      await transactionCategoryPage.waitForPageLoad();

      await expect(
        transactionCategoryPage.dataTable.container.getByText("No results."),
      ).toBeVisible();
    });
  });

  test.describe("CRUD Operations", () => {
    test("should open the create form modal", async ({
      transactionCategoryPage,
    }) => {
      await transactionCategoryPage.openCreateForm();
      await transactionCategoryPage.formModal.expectTitle(
        "Create Transaction Category",
      );
    });

    test("should close create modal on cancel", async ({
      transactionCategoryPage,
    }) => {
      await transactionCategoryPage.openCreateForm();
      const cancelButton =
        transactionCategoryPage.formModal.container.getByRole("button", {
          name: "Close",
        });
      await cancelButton.click();
      await transactionCategoryPage.formModal.expectHidden();
    });
  });
});
