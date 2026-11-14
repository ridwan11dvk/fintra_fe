import { expect, test } from "./bank.fixture";
import { createBankData } from "./bank.test-data";

test.describe("Bank Master Data", () => {
  test.beforeEach(async ({ bankPage }) => {
    await bankPage.goto();
    await bankPage.waitForTableLoad();
  });

  test.describe("Page Load", () => {
    test("should display the bank page with correct title", async ({
      bankPage,
    }) => {
      await expect(bankPage.pageTitle).toBeVisible();
      await expect(bankPage.pageTitle).toHaveText("Bank");
    });

    test("should display the data table", async ({ bankPage }) => {
      await expect(bankPage.dataTable.container).toBeVisible();
    });

    test("should display action buttons", async ({ bankPage }) => {
      await expect(bankPage.addButton).toBeVisible();
      await expect(bankPage.exportButton).toBeVisible();
      await expect(bankPage.importButton).toBeVisible();
    });

    test("should display search input", async ({ bankPage }) => {
      await expect(bankPage.searchInput).toBeVisible();
    });
  });

  test.describe("Search", () => {
    test("should filter table results when searching", async ({ bankPage }) => {
      const firstRowText = await bankPage.dataTable
        .getRow(0)
        .locator("td")
        .nth(1)
        .textContent();

      if (firstRowText) {
        await bankPage.search(firstRowText);
        await bankPage.waitForPageLoad();
        await bankPage.dataTable.expectRowWithText(firstRowText);
      }
    });

    test("should show empty state for non-matching search", async ({
      bankPage,
    }) => {
      await bankPage.search("ZZZZNONEXISTENT99999");
      await bankPage.waitForPageLoad();

      await expect(
        bankPage.dataTable.container.getByText("No results."),
      ).toBeVisible();
    });
  });

  test.describe("Create Bank", () => {
    test("should open the create form modal", async ({ bankPage }) => {
      await bankPage.openCreateForm();
      await bankPage.formModal.expectTitle("Add Bank");
      await expect(bankPage.nameInput).toBeVisible();
      await expect(bankPage.codeInput).toBeVisible();
      await expect(bankPage.codeInput).toBeEnabled();
    });

    test("should show validation errors when submitting empty form", async ({
      bankPage,
    }) => {
      await bankPage.openCreateForm();
      await bankPage.nameInput.clear();
      await bankPage.codeInput.clear();
      await bankPage.formConfirmButton.click();

      await expect(
        bankPage.formModal.container.getByText("Bank name is required"),
      ).toBeVisible();
      await expect(
        bankPage.formModal.container.getByText("Bank code is required"),
      ).toBeVisible();
    });

    test("should create a new bank successfully", async ({ bankPage }) => {
      const bankData = createBankData();

      await bankPage.openCreateForm();
      await bankPage.fillBankForm({
        name: bankData.name,
        code: bankData.code,
        rtgsCode: bankData.rtgsCode,
        onlineCode: bankData.onlineCode,
        bifastCode: bankData.bifastCode,
        sknCode: bankData.sknCode,
      });
      await bankPage.formConfirmButton.click();

      await bankPage.formModal.expectHidden();
      await bankPage.waitForPageLoad();
    });

    test("should close create modal on cancel", async ({ bankPage }) => {
      await bankPage.openCreateForm();
      await bankPage.formCancelButton.click();
      await bankPage.formModal.expectHidden();
    });
  });

  test.describe("Edit Bank", () => {
    test("should open edit form with pre-filled data", async ({ bankPage }) => {
      const firstRowName = await bankPage.dataTable
        .getRow(0)
        .locator("td")
        .nth(1)
        .textContent();

      if (!firstRowName) {
        test.skip();
        return;
      }

      await bankPage.openEditForm(firstRowName);
      await bankPage.formModal.expectTitle("Edit Bank");

      // Code field should be disabled in edit mode
      await expect(bankPage.codeInput).toBeDisabled();

      // Name should be pre-filled
      await expect(bankPage.nameInput).not.toHaveValue("");
    });

    test("should update a bank successfully", async ({ bankPage }) => {
      const firstRowName = await bankPage.dataTable
        .getRow(0)
        .locator("td")
        .nth(1)
        .textContent();

      if (!firstRowName) {
        test.skip();
        return;
      }

      await bankPage.openEditForm(firstRowName);

      const updatedName = `Updated ${firstRowName}`;
      await bankPage.nameInput.fill(updatedName);
      await bankPage.formConfirmButton.click();

      await bankPage.formModal.expectHidden();
      await bankPage.waitForPageLoad();
    });
  });

  test.describe("Delete Bank", () => {
    test("should open delete confirmation modal", async ({ bankPage }) => {
      const firstRowName = await bankPage.dataTable
        .getRow(0)
        .locator("td")
        .nth(1)
        .textContent();

      if (!firstRowName) {
        test.skip();
        return;
      }

      await bankPage.deleteRow(firstRowName);
      await bankPage.deleteModal.expectVisible();
      await bankPage.deleteModal.expectTitle("Delete Bank");
    });

    test("should cancel delete operation", async ({ bankPage }) => {
      const firstRowName = await bankPage.dataTable
        .getRow(0)
        .locator("td")
        .nth(1)
        .textContent();

      if (!firstRowName) {
        test.skip();
        return;
      }

      await bankPage.deleteRow(firstRowName);
      await bankPage.deleteModal.expectVisible();
      await bankPage.deleteCancelButton.click();
      await bankPage.deleteModal.expectHidden();
    });
  });
});
