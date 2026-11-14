import { expect, test } from "./village.fixture";

test.describe("Village Master Data", () => {
  test.beforeEach(async ({ villagePage }) => {
    await villagePage.goto();
    await villagePage.waitForTableLoad();
  });

  test.describe("Page Load", () => {
    test("should display the village page with correct title", async ({
      villagePage,
    }) => {
      await expect(villagePage.pageTitle).toBeVisible();
      await expect(villagePage.pageTitle).toHaveText("Village");
    });

    test("should display the data table", async ({ villagePage }) => {
      await expect(villagePage.dataTable.container).toBeVisible();
    });

    test("should display action buttons", async ({ villagePage }) => {
      await expect(villagePage.addButton).toBeVisible();
    });

    test("should display search input", async ({ villagePage }) => {
      await expect(villagePage.searchInput).toBeVisible();
    });
  });

  test.describe("Search", () => {
    test("should filter table results when searching", async ({
      villagePage,
    }) => {
      const firstRowText = await villagePage.dataTable
        .getRow(0)
        .locator("td")
        .nth(1)
        .textContent();

      if (firstRowText) {
        await villagePage.search(firstRowText);
        await villagePage.waitForPageLoad();
        await villagePage.dataTable.expectRowWithText(firstRowText);
      }
    });

    test("should show empty state for non-matching search", async ({
      villagePage,
    }) => {
      await villagePage.search("ZZZZNONEXISTENT99999");
      await villagePage.waitForPageLoad();

      await expect(
        villagePage.dataTable.container.getByText("No results."),
      ).toBeVisible();
    });
  });

  test.describe("CRUD Operations", () => {
    test("should open the create form modal", async ({ villagePage }) => {
      await villagePage.openCreateForm();
      await villagePage.formModal.expectTitle("Add Village");
    });

    test("should close create modal on cancel", async ({ villagePage }) => {
      await villagePage.openCreateForm();
      const cancelButton = villagePage.formModal.container.getByRole("button", {
        name: "Close",
      });
      await cancelButton.click();
      await villagePage.formModal.expectHidden();
    });
  });
});
