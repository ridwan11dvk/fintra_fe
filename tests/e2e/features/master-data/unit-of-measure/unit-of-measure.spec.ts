import { expect, test } from "./unit-of-measure.fixture";

test.describe("Unit of Measure Master Data", () => {
  test.beforeEach(async ({ unitOfMeasurePage }) => {
    await unitOfMeasurePage.goto();
    await unitOfMeasurePage.waitForTableLoad();
  });

  test.describe("Page Load", () => {
    test("should display the unit of measure page with correct title", async ({
      unitOfMeasurePage,
    }) => {
      await expect(unitOfMeasurePage.pageTitle).toBeVisible();
    });

    test("should display the data table", async ({ unitOfMeasurePage }) => {
      await expect(unitOfMeasurePage.dataTable.container).toBeVisible();
    });

    test("should display action buttons", async ({ unitOfMeasurePage }) => {
      await expect(unitOfMeasurePage.addButton).toBeVisible();
    });

    test("should display search input", async ({ unitOfMeasurePage }) => {
      await expect(unitOfMeasurePage.searchInput).toBeVisible();
    });
  });

  test.describe("Columns", () => {
    test("should display the Unit (EN) and Alias column headers", async ({
      unitOfMeasurePage,
    }) => {
      await expect(
        unitOfMeasurePage.dataTable.container.getByText("Unit (EN)"),
      ).toBeVisible();
      await expect(
        unitOfMeasurePage.dataTable.container.getByText("Alias", {
          exact: true,
        }),
      ).toBeVisible();
    });
  });

  test.describe("Search", () => {
    test("should filter table results when searching", async ({
      unitOfMeasurePage,
    }) => {
      const firstRowText = await unitOfMeasurePage.dataTable
        .getRow(0)
        .locator("td")
        .nth(1)
        .textContent();

      if (firstRowText) {
        await unitOfMeasurePage.search(firstRowText);
        await unitOfMeasurePage.waitForPageLoad();
        await unitOfMeasurePage.dataTable.expectRowWithText(firstRowText);
      }
    });

    test("should show empty state for non-matching search", async ({
      unitOfMeasurePage,
    }) => {
      await unitOfMeasurePage.search("ZZZZNONEXISTENT99999");
      await unitOfMeasurePage.waitForPageLoad();

      await expect(
        unitOfMeasurePage.dataTable.container.getByText("No results."),
      ).toBeVisible();
    });
  });

  test.describe("CRUD Operations", () => {
    test("should open the create form modal", async ({ unitOfMeasurePage }) => {
      await unitOfMeasurePage.openCreateForm();
      await unitOfMeasurePage.formModal.expectVisible();
    });

    test("should accept Unit (EN) and required Alias input in create form", async ({
      unitOfMeasurePage,
    }) => {
      await unitOfMeasurePage.openCreateForm();

      await unitOfMeasurePage.fillUnitEn("Kilogram");
      await unitOfMeasurePage.fillAlias("KG");

      await expect(unitOfMeasurePage.unitEnInput).toHaveValue("Kilogram");
      await expect(unitOfMeasurePage.aliasInput).toHaveValue("KG");

      const cancelButton = unitOfMeasurePage.formModal.container.getByRole(
        "button",
        { name: "Close" },
      );
      await cancelButton.click();
      await unitOfMeasurePage.formModal.expectHidden();
    });

    test("should close create modal on cancel", async ({
      unitOfMeasurePage,
    }) => {
      await unitOfMeasurePage.openCreateForm();
      const cancelButton = unitOfMeasurePage.formModal.container.getByRole(
        "button",
        { name: "Close" },
      );
      await cancelButton.click();
      await unitOfMeasurePage.formModal.expectHidden();
    });
  });
});
