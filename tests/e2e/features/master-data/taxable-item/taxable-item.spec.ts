import { expect, test } from "./taxable-item.fixture";

test.describe("Taxable Item Master Data", () => {
  test.beforeEach(async ({ taxableItemPage }) => {
    await taxableItemPage.goto();
    await taxableItemPage.waitForTableLoad();
  });

  test.describe("Page Load", () => {
    test("should display the taxable item page with correct title", async ({
      taxableItemPage,
    }) => {
      await expect(taxableItemPage.pageTitle).toBeVisible();
    });

    test("should display the data table", async ({ taxableItemPage }) => {
      await expect(taxableItemPage.dataTable.container).toBeVisible();
    });

    test("should display action buttons", async ({ taxableItemPage }) => {
      await expect(taxableItemPage.addButton).toBeVisible();
    });

    test("should display search input", async ({ taxableItemPage }) => {
      await expect(taxableItemPage.searchInput).toBeVisible();
    });
  });

  test.describe("Search", () => {
    test("should filter table results when searching", async ({
      taxableItemPage,
    }) => {
      // Hierarchy cells render "<fullCode> - <name>". The server-side search
      // matches field values, not the joined display string — and empty
      // fullCodes produce a leading " - " that matches nothing. Use the
      // Level-1 code (always populated) as the search term instead.
      const firstRowCell = await taxableItemPage.dataTable
        .getRow(0)
        .locator("td")
        .first()
        .textContent();
      const firstRowCode = firstRowCell?.split(" - ")[0]?.trim();

      if (firstRowCode) {
        await taxableItemPage.search(firstRowCode);
        await taxableItemPage.waitForPageLoad();
        await taxableItemPage.dataTable.expectRowWithText(firstRowCode);
      }
    });

    test("should show empty state for non-matching search", async ({
      taxableItemPage,
    }) => {
      await taxableItemPage.search("ZZZZNONEXISTENT99999");
      await taxableItemPage.waitForPageLoad();

      await expect(
        taxableItemPage.dataTable.container.getByText(
          "No taxable items found.",
        ),
      ).toBeVisible();
    });
  });

  test.describe("CRUD Operations", () => {
    test("should open the create form modal", async ({ taxableItemPage }) => {
      await taxableItemPage.openCreateForm();
      await taxableItemPage.formModal.expectVisible();
    });

    test("should close create modal on cancel", async ({ taxableItemPage }) => {
      await taxableItemPage.openCreateForm();
      const cancelButton = taxableItemPage.formModal.container.getByRole(
        "button",
        { name: "Close" },
      );
      await cancelButton.click();
      await taxableItemPage.formModal.expectHidden();
    });
  });
});
