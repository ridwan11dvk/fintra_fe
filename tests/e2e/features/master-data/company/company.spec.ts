import { COMPANY_DETAIL_PAGE_TITLE } from "@/features/master-data/company/data/company.utils";
import { expect, test } from "./company.fixture";
import { createCompanyData } from "./company.test-data";

test.describe("Company Master Data", () => {
  test.beforeEach(async ({ companyPage }) => {
    await companyPage.goto();
    await companyPage.waitForTableLoad();
  });

  test.describe("Page Load", () => {
    test("should display the company page with correct title", async ({
      companyPage,
    }) => {
      await expect(companyPage.pageTitle).toBeVisible();
      await expect(companyPage.pageTitle).toHaveText("Companies");
    });

    test("should display the data table", async ({ companyPage }) => {
      await expect(companyPage.dataTable.container).toBeVisible();
    });

    test("should display action buttons", async ({ companyPage }) => {
      await expect(companyPage.addButton).toBeVisible();
      await expect(companyPage.exportButton).toBeVisible();
      await expect(companyPage.importButton).toBeVisible();
    });

    test("should display search input", async ({ companyPage }) => {
      await expect(companyPage.searchInput).toBeVisible();
    });
  });

  test.describe("Search", () => {
    test("should filter table results when searching", async ({
      companyPage,
    }) => {
      const firstRowText = await companyPage.dataTable
        .getRow(0)
        .locator("td")
        .nth(1)
        .textContent();

      if (firstRowText) {
        await companyPage.search(firstRowText);
        await companyPage.waitForPageLoad();
        await companyPage.dataTable.expectRowWithText(firstRowText);
      }
    });

    test("should show empty state for non-matching search", async ({
      companyPage,
    }) => {
      await companyPage.search("ZZZZNONEXISTENT99999");
      await companyPage.waitForPageLoad();

      await expect(
        companyPage.dataTable.container.getByText("No results."),
      ).toBeVisible();
    });
  });

  test.describe("Create Company", () => {
    test("should open the create form", async ({ companyPage }) => {
      await companyPage.openCreateForm();
      // openCreateForm() already waits for the "Create New Company" heading
      await expect(companyPage.codeInput).toBeVisible();
      await expect(companyPage.nameInput).toBeVisible();
      await expect(companyPage.codeInput).toBeEnabled();
    });

    test("should show validation errors when submitting empty form", async ({
      companyPage,
    }) => {
      await companyPage.openCreateForm();
      await companyPage.codeInput.clear();
      await companyPage.nameInput.clear();
      await companyPage.formConfirmButton.click();
      await companyPage.page.waitForLoadState("networkidle");

      // Check validation error messages on the form
      await expect(
        companyPage.page.getByText("Company code is required"),
      ).toBeVisible();
      await expect(
        companyPage.page.getByText("Company name is required"),
      ).toBeVisible();
    });

    test("should create a new company successfully", async ({
      companyPage,
    }) => {
      const companyData = createCompanyData();

      await companyPage.openCreateForm();
      await companyPage.fillCompanyForm({
        code: companyData.code,
        name: companyData.name,
        address: companyData.address,
        isActive: companyData.isActive,
      });
      await companyPage.formConfirmButton.click();

      // After save, navigate back to company list
      await companyPage.waitForPageLoad();
      await expect(companyPage.pageTitle).toBeVisible();
    });

    test("should close create form on cancel", async ({ companyPage }) => {
      await companyPage.openCreateForm();
      await companyPage.formCancelButton.click();
      // After cancel (Back button), should return to company list
      await companyPage.waitForPageLoad();
      await expect(companyPage.pageTitle).toBeVisible();
    });
  });

  test.describe("Edit Company", () => {
    test("should open edit form with pre-filled data", async ({
      companyPage,
    }) => {
      const firstRowName = await companyPage.dataTable
        .getRow(0)
        .locator("td")
        .nth(1)
        .textContent();

      if (!firstRowName) {
        test.skip();
        return;
      }

      await companyPage.openEditForm(firstRowName);
      // openEditForm() already waits for the "Edit Company" heading
      // Code field is enabled in edit mode (can be edited)
      await expect(companyPage.codeInput).toBeEnabled();

      // Name should be pre-filled
      await expect(companyPage.nameInput).not.toHaveValue("");
    });

    test("should update a company successfully", async ({ companyPage }) => {
      const firstRowName = await companyPage.dataTable
        .getRow(0)
        .locator("td")
        .nth(1)
        .textContent();

      if (!firstRowName) {
        test.skip();
        return;
      }

      await companyPage.openEditForm(firstRowName);

      const updatedName = `Updated ${firstRowName}`;
      await companyPage.nameInput.fill(updatedName);
      await companyPage.formConfirmButton.click();

      // After update, navigate to the company detail page
      await companyPage.waitForPageLoad();
      await expect(
        companyPage.page.getByRole("heading", {
          name: COMPANY_DETAIL_PAGE_TITLE,
          level: 1,
        }),
      ).toBeVisible();
    });
  });

  test.describe("Delete Company", () => {
    test("should open delete confirmation modal", async ({ companyPage }) => {
      // Ensure we're on the company list page
      await companyPage.goto();
      await companyPage.waitForTableLoad();

      const firstRowName = await companyPage.dataTable
        .getRow(0)
        .locator("td")
        .nth(1)
        .textContent();

      if (!firstRowName) {
        test.skip();
        return;
      }

      await companyPage.deleteRow(firstRowName);
      await companyPage.deleteModal.expectVisible();
      await companyPage.deleteModal.expectTitle("Delete Company");
    });

    test("should cancel delete operation", async ({ companyPage }) => {
      // Ensure we're on the company list page
      await companyPage.goto();
      await companyPage.waitForTableLoad();

      const firstRowName = await companyPage.dataTable
        .getRow(0)
        .locator("td")
        .nth(1)
        .textContent();

      if (!firstRowName) {
        test.skip();
        return;
      }

      await companyPage.deleteRow(firstRowName);
      await companyPage.deleteModal.expectVisible();
      await companyPage.deleteCancelButton.click();
      await companyPage.deleteModal.expectHidden();
    });

    test("should delete a company successfully", async ({ companyPage }) => {
      // Ensure we're on the company list page
      await companyPage.goto();
      await companyPage.waitForTableLoad();

      const firstRowName = await companyPage.dataTable
        .getRow(0)
        .locator("td")
        .nth(1)
        .textContent();

      if (!firstRowName) {
        test.skip();
        return;
      }

      await companyPage.deleteRow(firstRowName);
      await companyPage.deleteModal.expectVisible();
      await companyPage.deleteConfirmButton.click();
      await companyPage.deleteModal.expectHidden();
      // Wait for data to reload and verify deletion
      await companyPage.waitForPageLoad();
      await expect(
        companyPage.dataTable.bodyRows.filter({ hasText: firstRowName }),
      ).toHaveCount(0);
    });
  });
});
