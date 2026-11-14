import { expect, test } from "./tax-rate.fixture";

test.describe("Tax Rate Master Data", () => {
  test.beforeEach(async ({ taxRatePage }) => {
    await taxRatePage.goto();
    await taxRatePage.waitForTableLoad();
  });

  test.describe("Page Load", () => {
    test("should display the tax rate page with correct title", async ({
      taxRatePage,
    }) => {
      await expect(taxRatePage.pageTitle).toBeVisible();
    });

    test("should display the data table", async ({ taxRatePage }) => {
      await expect(taxRatePage.dataTable.container).toBeVisible();
    });

    test("should display action buttons", async ({ taxRatePage }) => {
      await expect(taxRatePage.addButton).toBeVisible();
    });
  });

  test.describe("CRUD Operations", () => {
    test("should open the create form modal", async ({ taxRatePage }) => {
      await taxRatePage.openCreateForm();
      await taxRatePage.formModal.expectVisible();
    });

    test("should close create modal on cancel", async ({ taxRatePage }) => {
      await taxRatePage.openCreateForm();
      const cancelButton = taxRatePage.formModal.container.getByRole("button", {
        name: "Close",
      });
      await cancelButton.click();
      await taxRatePage.formModal.expectHidden();
    });
  });
});
