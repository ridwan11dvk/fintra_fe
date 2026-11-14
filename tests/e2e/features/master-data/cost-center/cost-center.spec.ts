import { expect, test } from "./cost-center.fixture";

test.describe("Cost Center Master Data", () => {
  test.beforeEach(async ({ costCenterPage }) => {
    await costCenterPage.goto();
    await costCenterPage.waitForTableLoad();
  });

  test.describe("Page Load", () => {
    test("should display the cost center page with correct title", async ({
      costCenterPage,
    }) => {
      await expect(costCenterPage.pageTitle).toBeVisible();
      await expect(costCenterPage.pageTitle).toHaveText("Cost Center");
    });

    test("should display the data table", async ({ costCenterPage }) => {
      await expect(costCenterPage.dataTable.container).toBeVisible();
    });

    test("should display action buttons", async ({ costCenterPage }) => {
      await expect(costCenterPage.addButton).toBeVisible();
    });

    test("should display search input", async ({ costCenterPage }) => {
      await expect(costCenterPage.searchInput).toBeVisible();
    });
  });

  test.describe("Search", () => {
    test("should filter table results when searching", async ({
      costCenterPage,
    }) => {
      const firstRowText = await costCenterPage.dataTable
        .getRow(0)
        .locator("td")
        .nth(1)
        .textContent();

      if (firstRowText) {
        await costCenterPage.search(firstRowText);
        await costCenterPage.waitForPageLoad();
        await costCenterPage.dataTable.expectRowWithText(firstRowText);
      }
    });

    test("should show empty state for non-matching search", async ({
      costCenterPage,
    }) => {
      await costCenterPage.search("ZZZZNONEXISTENT99999");
      await costCenterPage.waitForPageLoad();

      await expect(
        costCenterPage.dataTable.container.getByText("No results."),
      ).toBeVisible();
    });
  });

  test.describe("CRUD Operations", () => {
    test("should open the create form modal", async ({ costCenterPage }) => {
      await costCenterPage.openCreateForm();
      await costCenterPage.formModal.expectVisible();
    });

    test("should close create modal on cancel", async ({ costCenterPage }) => {
      await costCenterPage.openCreateForm();
      const cancelButton = costCenterPage.formModal.container.getByRole(
        "button",
        { name: "Close" },
      );
      await cancelButton.click();
      await costCenterPage.formModal.expectHidden();
    });
  });
});
