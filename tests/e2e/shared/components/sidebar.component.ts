import type { Locator, Page } from "@playwright/test";

export class SidebarComponent {
  readonly container: Locator;

  constructor(private readonly page: Page) {
    this.container = page.locator('[data-sidebar="sidebar"]');
  }

  get logo() {
    return this.container.locator("img").first();
  }

  /** Navigate to a menu item by visible text. */
  async navigateTo(menuText: string) {
    await this.container.getByRole("link", { name: menuText }).click();
  }

  /** Expand a collapsible nav group by its label text. */
  async expandGroup(groupText: string) {
    const trigger = this.container.getByRole("button", { name: groupText });
    const isExpanded = await trigger.getAttribute("data-state");
    if (isExpanded !== "open") {
      await trigger.click();
    }
  }

  /** Navigate through a nested menu: expand group then click item. */
  async navigateNested(groupText: string, itemText: string) {
    await this.expandGroup(groupText);
    await this.navigateTo(itemText);
  }
}
