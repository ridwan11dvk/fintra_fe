import { expect, test } from "./transaction-type.fixture";

test.describe("Transaction Type Master Data", () => {
  test.beforeEach(async ({ transactionTypePage }) => {
    await transactionTypePage.goto();
    await transactionTypePage.waitForTableLoad();
  });

  test.describe("Page Load", () => {
    test("should display the transaction type page with correct title", async ({
      transactionTypePage,
    }) => {
      await expect(transactionTypePage.pageTitle).toBeVisible();
      await expect(transactionTypePage.pageTitle).toHaveText(
        "Transaction Type",
      );
    });

    test("should display the data table", async ({ transactionTypePage }) => {
      await expect(transactionTypePage.dataTable.container).toBeVisible();
    });

    test("should display action buttons", async ({ transactionTypePage }) => {
      await expect(transactionTypePage.addButton).toBeVisible();
    });

    test("should display search input", async ({ transactionTypePage }) => {
      await expect(transactionTypePage.searchInput).toBeVisible();
    });
  });

  test.describe("Search", () => {
    test("should filter table results when searching", async ({
      transactionTypePage,
    }) => {
      const firstRowText = await transactionTypePage.dataTable
        .getRow(0)
        .locator("td")
        .nth(1)
        .textContent();

      if (firstRowText) {
        await transactionTypePage.search(firstRowText);
        await transactionTypePage.waitForPageLoad();
        await transactionTypePage.dataTable.expectRowWithText(firstRowText);
      }
    });

    test("should show empty state for non-matching search", async ({
      transactionTypePage,
    }) => {
      await transactionTypePage.search("ZZZZNONEXISTENT99999");
      await transactionTypePage.waitForPageLoad();

      await expect(
        transactionTypePage.dataTable.container.getByText("No results."),
      ).toBeVisible();
    });
  });

  test.describe("CRUD Operations", () => {
    test("should open the create form modal", async ({
      transactionTypePage,
    }) => {
      await transactionTypePage.openCreateForm();
      await transactionTypePage.formModal.expectTitle("Add Transaction Type");
    });

    test("should close create modal on cancel", async ({
      transactionTypePage,
    }) => {
      await transactionTypePage.openCreateForm();
      const cancelButton = transactionTypePage.formModal.container.getByRole(
        "button",
        { name: "Close" },
      );
      await cancelButton.click();
      await transactionTypePage.formModal.expectHidden();
    });
  });
});
