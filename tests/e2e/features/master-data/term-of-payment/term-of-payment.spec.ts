import { expect, test } from "./term-of-payment.fixture";

test.describe("Term of Payment Master Data", () => {
  test.beforeEach(async ({ termOfPaymentPage }) => {
    await termOfPaymentPage.goto();
    await termOfPaymentPage.waitForTableLoad();
  });

  test.describe("Page Load", () => {
    test("should display the term of payment page with correct title", async ({
      termOfPaymentPage,
    }) => {
      await expect(termOfPaymentPage.pageTitle).toBeVisible();
      await expect(termOfPaymentPage.pageTitle).toHaveText("Term of Payment");
    });

    test("should display the data table", async ({ termOfPaymentPage }) => {
      await expect(termOfPaymentPage.dataTable.container).toBeVisible();
    });

    test("should display action buttons", async ({ termOfPaymentPage }) => {
      await expect(termOfPaymentPage.addButton).toBeVisible();
    });

    test("should display search input", async ({ termOfPaymentPage }) => {
      await expect(termOfPaymentPage.searchInput).toBeVisible();
    });
  });

  test.describe("Search", () => {
    test("should filter table results when searching", async ({
      termOfPaymentPage,
    }) => {
      const firstRowText = await termOfPaymentPage.dataTable
        .getRow(0)
        .locator("td")
        .nth(1)
        .textContent();

      if (firstRowText) {
        await termOfPaymentPage.search(firstRowText);
        await termOfPaymentPage.waitForPageLoad();
        await termOfPaymentPage.dataTable.expectRowWithText(firstRowText);
      }
    });

    test("should show empty state for non-matching search", async ({
      termOfPaymentPage,
    }) => {
      await termOfPaymentPage.search("ZZZZNONEXISTENT99999");
      await termOfPaymentPage.waitForPageLoad();

      await expect(
        termOfPaymentPage.dataTable.container.getByText("No results."),
      ).toBeVisible();
    });
  });

  test.describe("CRUD Operations", () => {
    test("should open the create form modal", async ({ termOfPaymentPage }) => {
      await termOfPaymentPage.openCreateForm();
      await termOfPaymentPage.formModal.expectTitle("Add Payment Term");
    });

    test("should close create modal on cancel", async ({
      termOfPaymentPage,
    }) => {
      await termOfPaymentPage.openCreateForm();
      const cancelButton = termOfPaymentPage.formModal.container.getByRole(
        "button",
        { name: "Close" },
      );
      await cancelButton.click();
      await termOfPaymentPage.formModal.expectHidden();
    });
  });
});
