import { expect, test } from "./general-ledger-account.fixture";

test.describe("General Ledger Account Master Data", () => {
  test.beforeEach(async ({ generalLedgerAccountPage }) => {
    await generalLedgerAccountPage.goto();
    await generalLedgerAccountPage.waitForTableLoad();
  });

  test.describe("Page Load", () => {
    test("should display the GL account page with correct title", async ({
      generalLedgerAccountPage,
    }) => {
      await expect(generalLedgerAccountPage.pageTitle).toBeVisible();
    });

    test("should display the data table", async ({
      generalLedgerAccountPage,
    }) => {
      await expect(generalLedgerAccountPage.dataTable.container).toBeVisible();
    });

    test("should display action buttons", async ({
      generalLedgerAccountPage,
    }) => {
      await expect(generalLedgerAccountPage.addButton).toBeVisible();
    });

    test("should display search input", async ({
      generalLedgerAccountPage,
    }) => {
      await expect(generalLedgerAccountPage.searchInput).toBeVisible();
    });
  });

  test.describe("Search", () => {
    test("should filter table results when searching", async ({
      generalLedgerAccountPage,
    }) => {
      const firstRowText = await generalLedgerAccountPage.dataTable
        .getRow(0)
        .locator("td")
        .nth(1)
        .textContent();

      if (firstRowText) {
        await generalLedgerAccountPage.search(firstRowText);
        await generalLedgerAccountPage.waitForPageLoad();
        await generalLedgerAccountPage.dataTable.expectRowWithText(
          firstRowText,
        );
      }
    });

    test("should show empty state for non-matching search", async ({
      generalLedgerAccountPage,
    }) => {
      await generalLedgerAccountPage.search("ZZZZNONEXISTENT99999");
      await generalLedgerAccountPage.waitForPageLoad();

      await expect(
        generalLedgerAccountPage.dataTable.container.getByText("No results."),
      ).toBeVisible();
    });
  });

  test.describe("CRUD Operations", () => {
    test("should open the create form modal", async ({
      generalLedgerAccountPage,
    }) => {
      await generalLedgerAccountPage.openCreateForm();
      await generalLedgerAccountPage.formModal.expectVisible();
    });

    test("should close create modal on cancel", async ({
      generalLedgerAccountPage,
    }) => {
      await generalLedgerAccountPage.openCreateForm();
      const cancelButton =
        generalLedgerAccountPage.formModal.container.getByRole("button", {
          name: "Close",
        });
      await cancelButton.click();
      await generalLedgerAccountPage.formModal.expectHidden();
    });
  });
});
