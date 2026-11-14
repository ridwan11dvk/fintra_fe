import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";

export class DataTableComponent {
  readonly container: Locator;

  constructor(
    private readonly page: Page,
    containerSelector?: string,
  ) {
    this.container = containerSelector
      ? page.locator(containerSelector)
      : page.locator("table").first();
  }

  get headerRow() {
    return this.container.locator("thead tr");
  }

  get bodyRows() {
    return this.container.locator("tbody tr");
  }

  /** Get a specific row by 0-based index. */
  getRow(index: number): Locator {
    return this.bodyRows.nth(index);
  }

  /** Get a cell in a specific row by column index. */
  getCell(rowIndex: number, colIndex: number): Locator {
    return this.getRow(rowIndex).locator("td").nth(colIndex);
  }

  /** Assert the table has exactly N rows. */
  async expectRowCount(count: number) {
    await expect(this.bodyRows).toHaveCount(count);
  }

  /** Assert the table contains a row with the given text. */
  async expectRowWithText(text: string) {
    await expect(this.bodyRows.filter({ hasText: text }).first()).toBeVisible();
  }

  /** Click a row containing the given text. */
  async clickRowWithText(text: string) {
    await this.bodyRows.filter({ hasText: text }).first().click();
  }
}
