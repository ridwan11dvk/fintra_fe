import { expect, test } from "./regency.fixture";

test.describe("Regency Master Data", () => {
  test.beforeEach(async ({ regencyPage }) => {
    await regencyPage.goto();
    await regencyPage.waitForTableLoad();
  });

  test.describe("Page Load", () => {
    test("should display the regency page with correct title", async ({
      regencyPage,
    }) => {
      await expect(regencyPage.pageTitle).toBeVisible();
      await expect(regencyPage.pageTitle).toHaveText("Regency");
    });

    test("should display the data table", async ({ regencyPage }) => {
      await expect(regencyPage.dataTable.container).toBeVisible();
    });

    test("should display action buttons", async ({ regencyPage }) => {
      await expect(regencyPage.addButton).toBeVisible();
    });

    test("should display search input", async ({ regencyPage }) => {
      await expect(regencyPage.searchInput).toBeVisible();
    });
  });

  test.describe("Search", () => {
    test("should filter table results when searching", async ({
      regencyPage,
    }) => {
      const firstRowText = await regencyPage.dataTable
        .getRow(0)
        .locator("td")
        .nth(1)
        .textContent();

      if (firstRowText) {
        await regencyPage.search(firstRowText);
        await regencyPage.waitForPageLoad();
        await regencyPage.dataTable.expectRowWithText(firstRowText);
      }
    });

    test("should show empty state for non-matching search", async ({
      regencyPage,
    }) => {
      await regencyPage.search("ZZZZNONEXISTENT99999");
      await regencyPage.waitForPageLoad();

      await expect(
        regencyPage.dataTable.container.getByText("No results."),
      ).toBeVisible();
    });
  });

  test.describe("CRUD Operations", () => {
    test("should open the create form modal", async ({ regencyPage }) => {
      await regencyPage.openCreateForm();
      await regencyPage.formModal.expectTitle("Add Regency");
    });

    test("should close create modal on cancel", async ({ regencyPage }) => {
      await regencyPage.openCreateForm();
      const cancelButton = regencyPage.formModal.container.getByRole("button", {
        name: "Close",
      });
      await cancelButton.click();
      await regencyPage.formModal.expectHidden();
    });
  });
});
