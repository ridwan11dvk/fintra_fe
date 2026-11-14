import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { BasePage } from "../../shared/pages/base.page";

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // --- Locators: Base Mode ---

  get esaButton() {
    return this.page.getByRole("button", { name: "Sign in with ESA" });
  }

  get authenticatorButton() {
    return this.page.getByRole("button", { name: "Sign in with Authenticator" });
  }

  // --- Locators: Internal / Authenticator Form ---

  get emailOrNippInput() {
    return this.page.getByPlaceholder("Enter your email or NIPP");
  }

  get internalPasswordInput() {
    return this.page.locator("#password-internal").last();
  }

  get signInButton() {
    return this.page.locator('button[type="submit"]', { hasText: "Sign in" }).last();
  }

  get showPasswordButton() {
    return this.page.getByRole("button", { name: "Sign in with Password" });
  }

  get passkeyButton() {
    return this.page.getByRole("button", { name: "Sign in with Passkey" });
  }

  get magicLinkButton() {
    return this.page.getByRole("button", { name: "Sign in with Magic Link" });
  }

  get forgotPasswordLink() {
    return this.page.getByText("Forgot your password?").last();
  }

  // --- Locators: ESA Form ---

  get esaNippInput() {
    return this.page.getByPlaceholder("Enter your NIPP");
  }

  get esaPasswordInput() {
    return this.page.locator("#password-internal").last();
  }

  get captchaInput() {
    return this.page.locator("#captcha-internal");
  }

  // --- Locators: Alerts ---

  get errorAlert() {
    return this.page.getByRole("alert");
  }

  // --- Locators: Two-Factor Challenge ---

  get totpVerifyButton() {
    return this.page.getByRole("button", { name: "Verify" });
  }

  get twoFactorCancelButton() {
    return this.page.getByRole("button", { name: "Cancel" });
  }

  get recoveryCodeLink() {
    return this.page.getByText("Use a recovery code instead");
  }

  get recoveryCodeInput() {
    return this.page.locator("#recovery-code");
  }

  get recoveryBackButton() {
    return this.page.getByRole("button", { name: "Back" });
  }

  // --- Locators: Select Module ---

  get selectModuleHeading() {
    return this.page.getByText("Choose your module");
  }

  moduleCard(name: string) {
    return this.page.getByRole("link", { name, exact: true });
  }

  // --- Locators: Magic Link Dialog ---

  get magicLinkDialog() {
    return this.page.getByRole("dialog");
  }

  get sendMagicLinkButton() {
    return this.page.getByRole("button", { name: "Send Magic Link" });
  }

  get cancelMagicLinkButton() {
    return this.magicLinkDialog.getByRole("button", { name: "Cancel" });
  }

  // --- Actions ---

  async goto() {
    await this.page.goto("/login");
    await expect(this.authenticatorButton).toBeVisible();
  }

  async goToInternalMode() {
    await expect(async () => {
      if (!(await this.emailOrNippInput.isVisible())) {
        await this.authenticatorButton.click();
      }
      await expect(this.emailOrNippInput).toBeVisible({ timeout: 2_000 });
    }).toPass({ timeout: 15_000 });
  }

  async goToEsaMode() {
    await expect(async () => {
      if (!(await this.esaNippInput.isVisible())) {
        await this.esaButton.click();
      }
      await expect(this.esaNippInput).toBeVisible({ timeout: 2_000 });
    }).toPass({ timeout: 15_000 });
  }

  async clickShowPassword() {
    await this.showPasswordButton.click();
  }

  async loginInternal(emailOrNipp: string, password: string) {
    await this.goToInternalMode();
    await this.emailOrNippInput.fill(emailOrNipp);
    await this.clickShowPassword();
    await this.internalPasswordInput.fill(password);
    await this.signInButton.click();
  }

  async loginEsa(nipp: string, password: string, captchaAnswer: number) {
    await this.goToEsaMode();
    await this.esaNippInput.fill(nipp);
    await this.esaPasswordInput.fill(password);
    await this.captchaInput.fill(String(captchaAnswer));
    await this.signInButton.click();
  }

  // --- Assertions ---

  async expectError(message: string) {
    await expect(this.errorAlert).toContainText(message);
  }

  async expectValidationError(text: string) {
    await expect(this.page.getByText(text)).toBeVisible();
  }

  async selectModule(name: string) {
    await this.moduleCard(name).click();
  }

  async expectRedirectToSelectModule() {
    await this.page.waitForURL("**/select-module", { timeout: 15_000 });
    await expect(this.page).toHaveURL(/\/select-module/);
    await expect(this.selectModuleHeading).toBeVisible();
  }

  async expectRedirectToDashboard() {
    await this.page.waitForURL(/\/(dashboard|select-module)/, {
      timeout: 15_000,
    });

    // When onLoginSuccess redirects to /select-module, the Core module
    // must be picked before reaching the dashboard.
    if (this.page.url().includes("/select-module")) {
      await this.selectModule("Core");
    }

    await this.page.waitForURL("**/dashboard", { timeout: 15_000 });
    await expect(this.page).toHaveURL(/\/dashboard/);
    await this.dismissPostLoginModals();
  }
}
