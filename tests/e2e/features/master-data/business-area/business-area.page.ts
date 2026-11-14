import {
  BUSINESS_AREA_LIST_PAGE_TITLE,
  BUSINESS_AREA_URL,
} from "@/features/master-data/business-area/data/business-area.utils";
import type { Locator, Page } from "@playwright/test";
import { DataTableComponent } from "../../../shared/components/data-table.component";
import { ModalComponent } from "../../../shared/components/modal.component";
import { BasePage } from "../../../shared/pages/base.page";

export class BusinessAreaPage extends BasePage {
  readonly dataTable: DataTableComponent;
  readonly formModal: ModalComponent;
  readonly deleteModal: ModalComponent;

  constructor(page: Page) {
    super(page);
    this.dataTable = new DataTableComponent(page);
    this.formModal = new ModalComponent(page);
    this.deleteModal = new ModalComponent(page);
  }

  async goto() {
    await this.page.goto(BUSINESS_AREA_URL);
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
      name: BUSINESS_AREA_LIST_PAGE_TITLE,
      level: 1,
    });
  }

  // --- Action Buttons ---

  get addButton(): Locator {
    return this.page.getByRole("button", { name: "Add" });
  }

  get exportButton(): Locator {
    return this.page.getByRole("button", { name: "Export" });
  }

  get importButton(): Locator {
    return this.page.getByRole("button", { name: "Import" });
  }

  // --- Search ---

  get searchInput(): Locator {
    return this.page.getByPlaceholder(
      "Search by name, code, company code, email, or client ID"
    );
  }

  async search(text: string) {
    await this.searchInput.fill(text);
  }

  // --- Form Modal Fields ---

  get companyCodeCombobox(): Locator {
    return this.formModal.container.getByRole("combobox", {
      name: /select company/i,
    });
  }

  get nameInput(): Locator {
    return this.formModal.container.locator("#name");
  }

  get baCodeInput(): Locator {
    return this.formModal.container.locator("#baCode");
  }

  get branchCodeInput(): Locator {
    return this.formModal.container.locator("#branchCode");
  }

  get emailInput(): Locator {
    return this.formModal.container.locator("#email");
  }

  get taxEmailInput(): Locator {
    return this.formModal.container.locator("#taxEmail");
  }

  get nitkuInput(): Locator {
    return this.formModal.container.locator("#nitku");
  }

  get npwpInput(): Locator {
    return this.formModal.container.locator("#npwp");
  }

  get clientIdInput(): Locator {
    return this.formModal.container.locator("#clientId");
  }

  get clientSecretInput(): Locator {
    return this.formModal.container.locator("#clientSecret");
  }

  get isActiveCheckbox(): Locator {
    return this.formModal.container.locator("#isActive");
  }

  get formConfirmButton(): Locator {
    return this.formModal.container.getByRole("button", {
      name: /create|update/i,
    });
  }

  get formCancelButton(): Locator {
    return this.formModal.container.getByRole("button", { name: "Close" });
  }

  // --- Delete Confirmation ---

  get deleteConfirmButton(): Locator {
    return this.deleteModal.container.getByRole("button", { name: "Delete" });
  }

  get deleteCancelButton(): Locator {
    return this.deleteModal.container.getByRole("button", { name: "Close" });
  }

  // --- Table Row Actions ---

  getEditButton(row: Locator): Locator {
    return row.locator("td").last().getByRole("button").first();
  }

  getDeleteButton(row: Locator): Locator {
    return row.locator("td").last().getByRole("button").nth(1);
  }

  // --- Helpers ---

  async selectCompanyCode() {
    // Open combobox and select first available option
    await this.companyCodeCombobox.click();
    await this.page.waitForTimeout(300); // Allow dropdown to open
    const firstOption = this.page.getByRole("option").first();
    await firstOption.click();
  }

  async fillBusinessAreaForm(data: {
    name: string;
    baCode: string;
    branchCode?: string;
    email?: string;
    taxEmail?: string;
    nitku?: string;
    npwp?: string;
    clientId?: string;
    clientSecret?: string;
    isActive?: boolean;
  }) {
    // Required: Select company code first
    await this.selectCompanyCode();
    await this.nameInput.fill(data.name);
    await this.baCodeInput.fill(data.baCode);
    if (data.branchCode) {
      await this.branchCodeInput.fill(data.branchCode);
    }
    if (data.email) {
      await this.emailInput.fill(data.email);
    }
    if (data.taxEmail) {
      await this.taxEmailInput.fill(data.taxEmail);
    }
    if (data.nitku) {
      await this.nitkuInput.fill(data.nitku);
    }
    if (data.npwp) {
      await this.npwpInput.fill(data.npwp);
    }
    if (data.clientId) {
      await this.clientIdInput.fill(data.clientId);
    }
    if (data.clientSecret) {
      await this.clientSecretInput.fill(data.clientSecret);
    }
    if (data.isActive === false) {
      await this.isActiveCheckbox.uncheck();
    }
  }

  async openCreateForm() {
    await this.addButton.click();
    await this.formModal.expectVisible();
  }

  async openEditForm(rowText: string) {
    const row = this.dataTable.bodyRows.filter({ hasText: rowText }).first();
    await this.getEditButton(row).click();
    await this.formModal.expectVisible();
  }

  async deleteRow(rowText: string) {
    const row = this.dataTable.bodyRows.filter({ hasText: rowText }).first();
    await this.getDeleteButton(row).click();
  }
}
