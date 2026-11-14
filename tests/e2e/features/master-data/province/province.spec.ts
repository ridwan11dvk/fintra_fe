import { expect, test } from "./province.fixture";

test.describe("Province Master Data", () => {
  test.beforeEach(async ({ provincePage }) => {
    await provincePage.goto();
    await provincePage.waitForTableLoad();
  });

  test.describe("Page Load", () => {
    test("should display the province page with correct title", async ({
      provincePage,
    }) => {
      await expect(provincePage.pageTitle).toBeVisible();
      await expect(provincePage.pageTitle).toHaveText("Province");
    });

    test("should display the data table", async ({ provincePage }) => {
      await expect(provincePage.dataTable.container).toBeVisible();
    });

    test("should display action buttons", async ({ provincePage }) => {
      await expect(provincePage.addButton).toBeVisible();
    });

    test("should display search input", async ({ provincePage }) => {
      await expect(provincePage.searchInput).toBeVisible();
    });
  });

  test.describe("Search", () => {
    test("should filter table results when searching", async ({
      provincePage,
    }) => {
      const firstRowText = await provincePage.dataTable
        .getRow(0)
        .locator("td")
        .nth(1)
        .textContent();

      if (firstRowText) {
        await provincePage.search(firstRowText);
        await provincePage.waitForPageLoad();
        await provincePage.dataTable.expectRowWithText(firstRowText);
      }
    });

    test("should show empty state for non-matching search", async ({
      provincePage,
    }) => {
      await provincePage.search("ZZZZNONEXISTENT99999");
      await provincePage.waitForPageLoad();

      await expect(
        provincePage.dataTable.container.getByText("No results."),
      ).toBeVisible();
    });
  });

  test.describe("CRUD Operations", () => {
    test("should open the create form modal", async ({ provincePage }) => {
      await provincePage.openCreateForm();
      await provincePage.formModal.expectTitle("Add Province");
    });

    test("should close create modal on cancel", async ({ provincePage }) => {
      await provincePage.openCreateForm();
      const cancelButton = provincePage.formModal.container.getByRole(
        "button",
        { name: "Close" },
      );
      await cancelButton.click();
      await provincePage.formModal.expectHidden();
    });
  });
});
