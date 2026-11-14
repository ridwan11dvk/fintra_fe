import { expect, test as setup } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

setup("authenticate as internal user", async ({ page }) => {
  await page.goto("/login");

  // Switch to Internal/Authenticator mode
  const emailInput = page.getByPlaceholder("Enter your email or NIPP");
  await expect(async () => {
    if (!(await emailInput.isVisible())) {
      await page.getByRole("button", { name: "Sign in with Authenticator" }).click();
    }
    await expect(emailInput).toBeVisible({ timeout: 2_000 });
  }).toPass({ timeout: 15_000 });

  // Fill email
  await emailInput.fill(process.env.TEST_USER_EMAIL ?? "");

  // Reveal password field
  await page.getByRole("button", { name: "Sign in with Password" }).click();

  // Fill password
  await page
    .locator("#password-internal")
    .last()
    .fill(process.env.TEST_USER_PASSWORD ?? "");

  // Submit
  await page.locator('button[type="submit"]', { hasText: "Sign in" }).last().click();

  // Post-login redirect depends on the app's onLoginSuccess config:
  // straight to /dashboard, or via /select-module where Core must be picked.
  await page.waitForURL(/\/(dashboard|select-module)/, { timeout: 15_000 });

  if (page.url().includes("/select-module")) {
    await page.getByRole("link", { name: "Core", exact: true }).click();
  }

  await page.waitForURL("**/dashboard", { timeout: 15_000 });
  await expect(page).toHaveURL(/\/dashboard/);

  // Dismiss any post-login modals before saving state
  await page.waitForLoadState("networkidle");

  const remindLater = page.getByRole("button", { name: "Remind me later" });
  if (await remindLater.isVisible()) {
    await remindLater.click();
    await page.waitForLoadState("networkidle");
  }

  const skipForNow = page.getByRole("button", { name: "Skip for Now" });
  if (await skipForNow.isVisible()) {
    await skipForNow.click();
    await page.waitForLoadState("networkidle");
  }

  // Save storage state (captures localStorage JWT + cookies)
  await page.context().storageState({ path: authFile });
});
