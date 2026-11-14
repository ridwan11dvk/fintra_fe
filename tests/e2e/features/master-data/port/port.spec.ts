import { expect, test } from "./port.fixture";

test.describe("Port Master Data", () => {
  test.beforeEach(async ({ portPage }) => {
    await portPage.goto();
    await portPage.waitForTableLoad();
  });

  test.describe("Page Load", () => {
    test("should display the port page with correct title", async ({
      portPage,
    }) => {
      await expect(portPage.pageTitle).toBeVisible();
      await expect(portPage.pageTitle).toHaveText("Port");
    });

    test("should display the data table", async ({ portPage }) => {
      await expect(portPage.dataTable.container).toBeVisible();
    });

    test("should display action buttons", async ({ portPage }) => {
      await expect(portPage.addButton).toBeVisible();
    });

    test("should display search input", async ({ portPage }) => {
      await expect(portPage.searchInput).toBeVisible();
    });
  });

  test.describe("Search", () => {
    test("should filter table results when searching", async ({ portPage }) => {
      const firstRowText = await portPage.dataTable
        .getRow(0)
        .locator("td")
        .nth(2)
        .textContent();

      if (firstRowText) {
        await portPage.search(firstRowText);
        await portPage.waitForPageLoad();
        await portPage.dataTable.expectRowWithText(firstRowText);
      }
    });

    test("should show empty state for non-matching search", async ({
      portPage,
    }) => {
      await portPage.search("ZZZZNONEXISTENT99999");
      await portPage.waitForPageLoad();

      await expect(
        portPage.dataTable.container.getByText("No results."),
      ).toBeVisible();
    });
  });

  test.describe("CRUD Operations", () => {
    test("should open the create form modal", async ({ portPage }) => {
      await portPage.openCreateForm();
      await portPage.formModal.expectVisible();
    });

    test("should close create modal on cancel", async ({ portPage }) => {
      await portPage.openCreateForm();
      const cancelButton = portPage.formModal.container.getByRole("button", {
        name: "Close",
      });
      await cancelButton.click();
      await portPage.formModal.expectHidden();
    });
  });
});
