import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";

export class ModalComponent {
  readonly container: Locator;

  constructor(private readonly page: Page) {
    this.container = page.getByRole("dialog");
  }

  get title() {
    return this.container.getByRole("heading").first();
  }

  get closeButton() {
    return this.container.getByRole("button", { name: /close/i });
  }

  async expectTitle(text: string) {
    await expect(this.title).toContainText(text);
  }

  async close() {
    await this.closeButton.click();
    await expect(this.container).toBeHidden();
  }

  async expectVisible() {
    await expect(this.container).toBeVisible();
  }

  async expectHidden() {
    await expect(this.container).toBeHidden();
  }
}
