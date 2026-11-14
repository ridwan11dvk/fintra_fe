import {
  BANK_LIST_PAGE_TITLE,
  BANK_URL,
} from "@/features/master-data/bank/data/bank.utils";
import type { Locator, Page } from "@playwright/test";
import { DataTableComponent } from "../../../shared/components/data-table.component";
import { ModalComponent } from "../../../shared/components/modal.component";
import { BasePage } from "../../../shared/pages/base.page";

export class BankPage extends BasePage {
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
    await this.page.goto(BANK_URL);
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
      name: BANK_LIST_PAGE_TITLE,
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
    return this.page.getByPlaceholder("Search by bank name or code");
  }

  async search(text: string) {
    await this.searchInput.fill(text);
  }

  // --- Form Modal Fields ---

  get nameInput(): Locator {
    return this.formModal.container.locator("#name");
  }

  get codeInput(): Locator {
    return this.formModal.container.locator("#code");
  }

  get colorInput(): Locator {
    return this.formModal.container.locator("#color");
  }

  get rtgsCodeInput(): Locator {
    return this.formModal.container.locator("#rtgsCode");
  }

  get onlineCodeInput(): Locator {
    return this.formModal.container.locator("#onlineCode");
  }

  get bifastCodeInput(): Locator {
    return this.formModal.container.locator("#bifastCode");
  }

  get sknCodeInput(): Locator {
    return this.formModal.container.locator("#sknCode");
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

  async fillBankForm(data: {
    name: string;
    code?: string;
    color?: string;
    rtgsCode?: string;
    onlineCode?: string;
    bifastCode?: string;
    sknCode?: string;
    isActive?: boolean;
  }) {
    await this.nameInput.fill(data.name);
    if (data.code !== undefined) {
      await this.codeInput.fill(data.code);
    }
    if (data.color) {
      await this.colorInput.fill(data.color);
    }
    if (data.rtgsCode) {
      await this.rtgsCodeInput.fill(data.rtgsCode);
    }
    if (data.onlineCode) {
      await this.onlineCodeInput.fill(data.onlineCode);
    }
    if (data.bifastCode) {
      await this.bifastCodeInput.fill(data.bifastCode);
    }
    if (data.sknCode) {
      await this.sknCodeInput.fill(data.sknCode);
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
