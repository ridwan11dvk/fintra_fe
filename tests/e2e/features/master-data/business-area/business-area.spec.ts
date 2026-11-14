import { expect, test } from "./business-area.fixture";
import { createBusinessAreaData } from "./business-area.test-data";

test.describe("Business Area Master Data", () => {
  test.beforeEach(async ({ businessAreaPage }) => {
    await businessAreaPage.goto();
    await businessAreaPage.waitForTableLoad();
  });

  test.describe("Page Load", () => {
    test("should display the business area page with correct title", async ({
      businessAreaPage,
    }) => {
      await expect(businessAreaPage.pageTitle).toBeVisible();
      await expect(businessAreaPage.pageTitle).toHaveText("Business Area");
    });

    test("should display the data table", async ({ businessAreaPage }) => {
      await expect(businessAreaPage.dataTable.container).toBeVisible();
    });

    test("should display action buttons", async ({ businessAreaPage }) => {
      await expect(businessAreaPage.addButton).toBeVisible();
      await expect(businessAreaPage.exportButton).toBeVisible();
      await expect(businessAreaPage.importButton).toBeVisible();
    });

    test("should display search input", async ({ businessAreaPage }) => {
      await expect(businessAreaPage.searchInput).toBeVisible();
    });
  });

  test.describe("Search", () => {
    test("should filter table results when searching", async ({
      businessAreaPage,
    }) => {
      const firstRowText = await businessAreaPage.dataTable
        .getRow(0)
        .locator("td")
        .nth(1)
        .textContent();

      if (firstRowText) {
        await businessAreaPage.search(firstRowText);
        await businessAreaPage.waitForPageLoad();
        await businessAreaPage.dataTable.expectRowWithText(firstRowText);
      }
    });

    test("should show empty state for non-matching search", async ({
      businessAreaPage,
    }) => {
      await businessAreaPage.search("ZZZZNONEXISTENT99999");
      await businessAreaPage.waitForPageLoad();

      await expect(
        businessAreaPage.dataTable.container.getByText("No results."),
      ).toBeVisible();
    });
  });

  test.describe("Create Business Area", () => {
    test("should open the create form modal", async ({
      businessAreaPage,
    }) => {
      await businessAreaPage.openCreateForm();
      await businessAreaPage.formModal.expectTitle("Add Business Area");
      await expect(businessAreaPage.nameInput).toBeVisible();
      await expect(businessAreaPage.baCodeInput).toBeVisible();
    });

    test("should show validation errors when submitting empty form", async ({
      businessAreaPage,
    }) => {
      await businessAreaPage.openCreateForm();
      await businessAreaPage.nameInput.clear();
      await businessAreaPage.baCodeInput.clear();
      await businessAreaPage.formConfirmButton.click();

      await expect(
        businessAreaPage.formModal.container.getByText(
          "Business area name is required"
        ),
      ).toBeVisible();
      await expect(
        businessAreaPage.formModal.container.getByText(
          "Business area code is required"
        ),
      ).toBeVisible();
    });

    test("should create a new business area successfully", async ({
      businessAreaPage,
    }) => {
      const businessAreaData = createBusinessAreaData();

      await businessAreaPage.openCreateForm();
      await businessAreaPage.fillBusinessAreaForm({
        name: businessAreaData.name,
        baCode: businessAreaData.baCode,
        branchCode: businessAreaData.branchCode,
        email: businessAreaData.email,
        taxEmail: businessAreaData.taxEmail,
        nitku: businessAreaData.nitku,
        npwp: businessAreaData.npwp,
        clientId: businessAreaData.clientId,
        clientSecret: businessAreaData.clientSecret,
      });

      await businessAreaPage.formConfirmButton.click();
      await businessAreaPage.formModal.expectHidden();
    });

    test("should close create modal on cancel", async ({
      businessAreaPage,
    }) => {
      await businessAreaPage.openCreateForm();
      await businessAreaPage.formCancelButton.click();
      await businessAreaPage.formModal.expectHidden();
    });
  });

  test.describe("Edit Business Area", () => {
    test("should open edit form with pre-filled data", async ({
      businessAreaPage,
    }) => {
      const firstRowName = await businessAreaPage.dataTable
        .getRow(0)
        .locator("td")
        .nth(1)
        .textContent();

      if (!firstRowName) {
        test.skip();
        return;
      }

      await businessAreaPage.openEditForm(firstRowName);
      await businessAreaPage.formModal.expectTitle("Edit Business Area");

      // Name should be pre-filled
      await expect(businessAreaPage.nameInput).not.toHaveValue("");
    });

    test("should update a business area successfully", async ({
      businessAreaPage,
    }) => {
      const firstRowName = await businessAreaPage.dataTable
        .getRow(0)
        .locator("td")
        .nth(1)
        .textContent();

      if (!firstRowName) {
        test.skip();
        return;
      }

      await businessAreaPage.openEditForm(firstRowName);

      const updatedName = `Updated ${firstRowName}`;
      await businessAreaPage.nameInput.fill(updatedName);
      await businessAreaPage.formConfirmButton.click();

      await businessAreaPage.formModal.expectHidden();
      await businessAreaPage.waitForPageLoad();
    });
  });

  test.describe("Delete Business Area", () => {
    test("should open delete confirmation modal", async ({
      businessAreaPage,
    }) => {
      const firstRowName = await businessAreaPage.dataTable
        .getRow(0)
        .locator("td")
        .nth(1)
        .textContent();

      if (!firstRowName) {
        test.skip();
        return;
      }

      await businessAreaPage.deleteRow(firstRowName);
      await businessAreaPage.deleteModal.expectVisible();
      await businessAreaPage.deleteModal.expectTitle("Delete Business Area");
    });

    test("should cancel delete operation", async ({ businessAreaPage }) => {
      const firstRowName = await businessAreaPage.dataTable
        .getRow(0)
        .locator("td")
        .nth(1)
        .textContent();

      if (!firstRowName) {
        test.skip();
        return;
      }

      await businessAreaPage.deleteRow(firstRowName);
      await businessAreaPage.deleteModal.expectVisible();
      await businessAreaPage.deleteCancelButton.click();
      await businessAreaPage.deleteModal.expectHidden();
    });
  });
});
