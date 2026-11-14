import {
  HOUSE_BANK_LIST_PAGE_TITLE,
  HOUSE_BANK_URL,
} from "@/features/master-data/house-bank/data/house-bank.utils";
import type { Locator, Page } from "@playwright/test";
import { DataTableComponent } from "../../../shared/components/data-table.component";
import { ModalComponent } from "../../../shared/components/modal.component";
import { BasePage } from "../../../shared/pages/base.page";

export class HouseBankPage extends BasePage {
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
    await this.page.goto(HOUSE_BANK_URL);
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

  get pageTitle(): Locator {
    return this.page.getByRole("heading", {
      name: HOUSE_BANK_LIST_PAGE_TITLE,
      level: 1,
    });
  }

  get addButton(): Locator {
    return this.page.getByRole("button", { name: "Add" });
  }

  get exportButton(): Locator {
    return this.page.getByRole("button", { name: "Export" });
  }

  get importButton(): Locator {
    return this.page.getByRole("button", { name: "Import" });
  }

  get searchInput(): Locator {
    return this.page.getByPlaceholder(/search/i);
  }

  async search(text: string) {
    await this.searchInput.fill(text);
  }
}
