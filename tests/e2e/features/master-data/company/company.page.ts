import {
  COMPANY_LIST_PAGE_TITLE,
  COMPANY_URL,
} from "@/features/master-data/company/data/company.utils";
import type { Locator, Page } from "@playwright/test";
import { DataTableComponent } from "../../../shared/components/data-table.component";
import { ModalComponent } from "../../../shared/components/modal.component";
import { BasePage } from "../../../shared/pages/base.page";

export class CompanyPage extends BasePage {
  readonly dataTable: DataTableComponent;
  readonly deleteModal: ModalComponent;

  constructor(page: Page) {
    super(page);
    this.dataTable = new DataTableComponent(page);
    this.deleteModal = new ModalComponent(page);
  }

  async goto() {
    await this.page.goto(COMPANY_URL);
  }

  async waitForTableLoad() {
    await this.page.waitForLoadState("domcontentloaded");
    await this.dismissPostLoginModals();
    await this.pageTitle.waitFor({ state: "visible", timeout: 15_000 });
    await this.dataTable.container.waitFor({
      state: "visible",
      timeout: 15_000,
    });
  }

  // --- Page Header ---

  get pageTitle(): Locator {
    return this.page.getByRole("heading", {
      name: COMPANY_LIST_PAGE_TITLE,
      level: 1,
    });
  }

  // --- Action Buttons ---

  get addButton(): Locator {
    // Get the first 'Add' button (action button appears before table header buttons)
    return this.page.getByRole("button", { name: "Add" }).first();
  }

  get exportButton(): Locator {
    return this.page.getByRole("button", { name: "Export" });
  }

  get importButton(): Locator {
    return this.page.getByRole("button", { name: "Import" });
  }

  // --- Search ---

  get searchInput(): Locator {
    // Search input in data table toolbar - more resilient than placeholder matching
    return this.page.locator('input[placeholder*="Search"]').first();
  }

  async search(text: string) {
    await this.searchInput.fill(text);
  }

  // --- Form Fields (Full-page form, not modal) ---

  get codeInput(): Locator {
    return this.page.locator("#code");
  }

  get nameInput(): Locator {
    return this.page.locator("#name");
  }

  get addressInput(): Locator {
    return this.page.locator("#address");
  }

  get isActiveCheckbox(): Locator {
    return this.page.locator("#isActive");
  }

  get formConfirmButton(): Locator {
    return this.page.getByRole("button", {
      name: /save|create|update/i,
    });
  }

  get formCancelButton(): Locator {
    return this.page.getByRole("button", { name: "Back" });
  }

  // --- Delete Confirmation ---

  get deleteConfirmButton(): Locator {
    return this.deleteModal.container.getByRole("button", { name: "Delete" });
  }

  get deleteCancelButton(): Locator {
    return this.deleteModal.container.getByRole("button", { name: "Close" });
  }

  // --- Table Row Actions ---

  getShowButton(row: Locator): Locator {
    // The last cell contains 3 action buttons: Show (0), Edit (1), Delete (2)
    return row.locator("td").last().getByRole("button").nth(0);
  }
  getEditButton(row: Locator): Locator {
    // The last cell contains 3 action buttons: Show (0), Edit (1), Delete (2)
    return row.locator("td").last().getByRole("button").nth(1);
  }

  getDeleteButton(row: Locator): Locator {
    // The last cell contains 3 action buttons: Show (0), Edit (1), Delete (2)
    return row.locator("td").last().getByRole("button").nth(2);
  }

  // --- Helpers ---

  async fillCompanyForm(data: {
    code?: string;
    name?: string;
    address?: string;
    isActive?: boolean;
  }) {
    if (data.code !== undefined) {
      await this.codeInput.fill(data.code);
    }
    if (data.name !== undefined) {
      await this.nameInput.fill(data.name);
    }
    if (data.address !== undefined) {
      await this.addressInput.fill(data.address);
    }
    if (data.isActive !== undefined) {
      const isChecked = await this.isActiveCheckbox.isChecked();
      if (isChecked !== data.isActive) {
        await this.isActiveCheckbox.click();
      }
    }
  }

  async openCreateForm() {
    await this.addButton.click();
    // Wait for the create form page to load (full-page form, not modal)
    await this.page
      .getByRole("heading", { name: "Create New Company", level: 1 })
      .waitFor({ state: "visible", timeout: 15_000 });
  }

  async openEditForm(companyName: string) {
    const row = this.dataTable.bodyRows
      .filter({ hasText: companyName })
      .first();
    await this.getShowButton(row).click();
    // Wait for the detail/show page to load
    await this.page.waitForLoadState("domcontentloaded");
    // Click the Edit button on the detail page to go to edit form
    await this.page.getByRole("button", { name: "Edit" }).click();
    // Wait for the edit form page to load (full-page form, not modal)
    await this.page
      .getByRole("heading", { name: "Edit Company", level: 1 })
      .waitFor({ state: "visible", timeout: 15_000 });
  }

  async deleteRow(companyName: string) {
    const row = this.dataTable.bodyRows
      .filter({ hasText: companyName })
      .first();
    await this.getDeleteButton(row).click();
  }
}
