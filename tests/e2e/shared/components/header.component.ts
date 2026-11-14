import type { Locator, Page } from "@playwright/test";

export class HeaderComponent {
  readonly container: Locator;

  constructor(private readonly page: Page) {
    this.container = page.locator("header");
  }

  get breadcrumb() {
    return this.container.getByRole("navigation", { name: "breadcrumb" });
  }

  get userMenuButton() {
    return this.container.getByRole("button", { name: /avatar/i });
  }

  async openUserMenu() {
    await this.userMenuButton.click();
  }
}
