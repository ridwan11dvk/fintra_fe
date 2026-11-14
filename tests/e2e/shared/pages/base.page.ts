import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  abstract goto(): Promise<void>;

  /** Wait for the page to finish loading (network idle). */
  async waitForPageLoad() {
    await this.page.waitForLoadState("networkidle");
  }

  /** Get a visible Sonner toast notification. */
  get toast(): Locator {
    return this.page.locator('[data-sonner-toast][data-visible="true"]');
  }

  /** Assert a toast with specific text is visible. */
  async expectToast(text: string) {
    await expect(this.toast.filter({ hasText: text })).toBeVisible();
  }

  /** Get the page heading (first h1). */
  get heading(): Locator {
    return this.page.getByRole("heading", { level: 1 });
  }

  /** Dismiss any post-login modals (Security Setup, Request Access) if present. */
  async dismissPostLoginModals() {
    await this.page.waitForLoadState("networkidle");

    const remindLater = this.page.getByRole("button", {
      name: "Remind me later",
    });
    if (await remindLater.isVisible()) {
      await remindLater.click();
      await this.page.waitForLoadState("networkidle");
    }

    const skipForNow = this.page.getByRole("button", { name: "Skip for Now" });
    if (await skipForNow.isVisible()) {
      await skipForNow.click();
      await this.page.waitForLoadState("networkidle");
    }
  }
}
