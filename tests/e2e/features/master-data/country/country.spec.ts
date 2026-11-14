import { expect, test } from "./country.fixture";

test.describe("Country Master Data", () => {
  test.beforeEach(async ({ countryPage }) => {
    await countryPage.goto();
    await countryPage.waitForTableLoad();
  });

  test.describe("Page Load", () => {
    test("should display the country page with correct title", async ({
      countryPage,
    }) => {
      await expect(countryPage.pageTitle).toBeVisible();
      await expect(countryPage.pageTitle).toHaveText("Country");
    });

    test("should display the data table", async ({ countryPage }) => {
      await expect(countryPage.dataTable.container).toBeVisible();
    });

    test("should display action buttons", async ({ countryPage }) => {
      await expect(countryPage.addButton).toBeVisible();
    });

    test("should display search input", async ({ countryPage }) => {
      await expect(countryPage.searchInput).toBeVisible();
    });
  });

  test.describe("Search", () => {
    test("should filter table results when searching", async ({
      countryPage,
    }) => {
      const firstRowText = await countryPage.dataTable
        .getRow(0)
        .locator("td")
        .nth(1)
        .textContent();

      if (firstRowText) {
        await countryPage.search(firstRowText);
        await countryPage.waitForPageLoad();
        await countryPage.dataTable.expectRowWithText(firstRowText);
      }
    });

    test("should show empty state for non-matching search", async ({
      countryPage,
    }) => {
      await countryPage.search("ZZZZNONEXISTENT99999");
      await countryPage.waitForPageLoad();

      await expect(
        countryPage.dataTable.container.getByText("No results."),
      ).toBeVisible();
    });
  });

  test.describe("CRUD Operations", () => {
    test("should open the create form modal", async ({ countryPage }) => {
      await countryPage.openCreateForm();
      await countryPage.formModal.expectTitle("Add Country");
    });

    test("should close create modal on cancel", async ({ countryPage }) => {
      await countryPage.openCreateForm();
      const cancelButton = countryPage.formModal.container.getByRole("button", {
        name: "Close",
      });
      await cancelButton.click();
      await countryPage.formModal.expectHidden();
    });

    test("should open edit form with pre-filled data", async ({
      countryPage,
    }) => {
      const firstRowName = await countryPage.dataTable
        .getRow(0)
        .locator("td")
        .nth(1)
        .textContent();

      if (!firstRowName) {
        test.skip();
        return;
      }

      await countryPage.openEditForm(firstRowName);
      await countryPage.formModal.expectTitle("Edit Country");
    });

    test("should open delete confirmation modal", async ({ countryPage }) => {
      const firstRowName = await countryPage.dataTable
        .getRow(0)
        .locator("td")
        .nth(1)
        .textContent();

      if (!firstRowName) {
        test.skip();
        return;
      }

      await countryPage.deleteRow(firstRowName);
      await countryPage.deleteModal.expectVisible();
      await countryPage.deleteModal.expectTitle("Delete Country");
    });

    test("should cancel delete operation", async ({ countryPage }) => {
      const firstRowName = await countryPage.dataTable
        .getRow(0)
        .locator("td")
        .nth(1)
        .textContent();

      if (!firstRowName) {
        test.skip();
        return;
      }

      await countryPage.deleteRow(firstRowName);
      await countryPage.deleteModal.expectVisible();
      const cancelButton = countryPage.deleteModal.container.getByRole(
        "button",
        { name: "Close" },
      );
      await cancelButton.click();
      await countryPage.deleteModal.expectHidden();
    });
  });
});
