import {
  DISTRICT_LIST_PAGE_TITLE,
  DISTRICT_URL,
} from "@/features/master-data/district/data/district.utils";
import type { Locator, Page } from "@playwright/test";
import { DataTableComponent } from "../../../shared/components/data-table.component";
import { ModalComponent } from "../../../shared/components/modal.component";
import { BasePage } from "../../../shared/pages/base.page";

export class DistrictPage extends BasePage {
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
    await this.page.goto(DISTRICT_URL);
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
      name: DISTRICT_LIST_PAGE_TITLE,
      level: 1,
    });
  }

  get addButton(): Locator {
    return this.page.getByRole("button", { name: "Add" });
  }

  getEditButton(row: Locator): Locator {
    return row.locator("td").last().getByRole("button").first();
  }

  getDeleteButton(row: Locator): Locator {
    return row.locator("td").last().getByRole("button").nth(1);
  }

  async openCreateForm() {
    await this.addButton.click();
    await this.formModal.expectVisible();
  }

  async openEditForm(name: string) {
    const row = this.dataTable.bodyRows.filter({ hasText: name }).first();
    await this.getEditButton(row).click();
    await this.formModal.expectVisible();
  }

  async deleteRow(name: string) {
    const row = this.dataTable.bodyRows.filter({ hasText: name }).first();
    await this.getDeleteButton(row).click();
  }
}
