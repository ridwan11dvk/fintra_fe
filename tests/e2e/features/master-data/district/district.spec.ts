import { expect, test } from "./district.fixture";

test.describe("District Master Data", () => {
  test.beforeEach(async ({ districtPage }) => {
    await districtPage.goto();
    await districtPage.waitForTableLoad();
  });

  test.describe("Page Load", () => {
    test("should display the district page with correct title", async ({
      districtPage,
    }) => {
      await expect(districtPage.pageTitle).toBeVisible();
      await expect(districtPage.pageTitle).toHaveText("District");
    });

    test("should display the data table", async ({ districtPage }) => {
      await expect(districtPage.dataTable.container).toBeVisible();
    });

    test("should display action buttons", async ({ districtPage }) => {
      await expect(districtPage.addButton).toBeVisible();
    });
  });

  test.describe("CRUD Operations", () => {
    test("should open the create form modal", async ({ districtPage }) => {
      await districtPage.openCreateForm();
      await districtPage.formModal.expectTitle("Add District");
    });

    test("should close create modal on cancel", async ({ districtPage }) => {
      await districtPage.openCreateForm();
      const cancelButton = districtPage.formModal.container.getByRole(
        "button",
        { name: "Close" },
      );
      await cancelButton.click();
      await districtPage.formModal.expectHidden();
    });
  });
});
