import { expect, unauthenticatedTest as test } from "./auth.fixture";

test.describe("Login Page", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test("should display base mode with ESA and Authenticator buttons", async ({
    loginPage,
  }) => {
    await expect(loginPage.esaButton).toBeVisible();
    await expect(loginPage.authenticatorButton).toBeVisible();
  });

  test("should switch to Internal/Authenticator mode", async ({
    loginPage,
  }) => {
    await loginPage.goToInternalMode();
    await expect(loginPage.emailOrNippInput).toBeVisible();
    await expect(loginPage.showPasswordButton).toBeVisible();
    await expect(loginPage.passkeyButton).toBeVisible();
    await expect(loginPage.magicLinkButton).toBeVisible();
    await expect(loginPage.esaButton).toBeVisible();
  });

  test("should switch to ESA mode", async ({ loginPage }) => {
    await loginPage.goToEsaMode();
    await expect(loginPage.esaNippInput).toBeVisible();
    await expect(loginPage.esaPasswordInput).toBeVisible();
    await expect(loginPage.captchaInput).toBeVisible();
    await expect(loginPage.signInButton).toBeVisible();
    await expect(loginPage.authenticatorButton).toBeVisible();
  });

  test("should reveal password field when clicking Sign in with Password", async ({
    loginPage,
  }) => {
    await loginPage.goToInternalMode();
    await expect(loginPage.showPasswordButton).toBeVisible();
    await expect(loginPage.internalPasswordInput).not.toBeVisible();

    await loginPage.clickShowPassword();

    await expect(loginPage.showPasswordButton).not.toBeVisible();
    await expect(loginPage.internalPasswordInput).toBeVisible();
    await expect(loginPage.signInButton).toBeVisible();
    await expect(loginPage.forgotPasswordLink).toBeVisible();
  });

  test("should show validation errors on empty submit (Internal)", async ({
    loginPage,
  }) => {
    await loginPage.goToInternalMode();
    await loginPage.clickShowPassword();
    await loginPage.signInButton.click();
    await loginPage.expectValidationError("Email or username is required");
    await loginPage.expectValidationError("Password is required");
  });

  test("should show error on invalid internal credentials", async ({
    loginPage,
  }) => {
    await loginPage.loginInternal("invalid@test.com", "wrongpassword");
    await expect(loginPage.errorAlert).toBeVisible();
  });

  test("should login successfully with valid internal credentials", async ({
    loginPage,
  }) => {
    await loginPage.loginInternal(
      process.env.TEST_USER_EMAIL ?? "",
      process.env.TEST_USER_PASSWORD ?? "",
    );
    await loginPage.expectRedirectToDashboard();
  });

  test("should reach dashboard via select-module after choosing Core", async ({
    loginPage,
  }) => {
    await loginPage.loginInternal(
      process.env.TEST_USER_EMAIL ?? "",
      process.env.TEST_USER_PASSWORD ?? "",
    );
    await loginPage.expectRedirectToSelectModule();
    await loginPage.selectModule("Core");
    await expect(loginPage.page).toHaveURL(/\/dashboard/);
  });
});

test.describe("Login - Sign-in Methods", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test("should display all sign-in method buttons in Authenticator mode", async ({
    loginPage,
  }) => {
    await loginPage.goToInternalMode();
    await expect(loginPage.showPasswordButton).toBeVisible();
    await expect(loginPage.passkeyButton).toBeVisible();
    await expect(loginPage.magicLinkButton).toBeVisible();
    await expect(loginPage.esaButton).toBeVisible();
  });

  test("should disable Passkey and Magic Link buttons when email is empty", async ({
    loginPage,
  }) => {
    await loginPage.goToInternalMode();
    await expect(loginPage.passkeyButton).toBeDisabled();
    await expect(loginPage.magicLinkButton).toBeDisabled();
  });

  test("should enable Passkey and Magic Link buttons when email is entered", async ({
    loginPage,
  }) => {
    await loginPage.goToInternalMode();
    await loginPage.emailOrNippInput.fill("user@test.com");
    await expect(loginPage.passkeyButton).toBeEnabled();
    await expect(loginPage.magicLinkButton).toBeEnabled();
  });
});

test.describe("Login - Already Authenticated", () => {
  test.use({ storageState: "playwright/.auth/user.json" });

  test("should redirect to dashboard when already logged in", async ({
    page,
  }) => {
    await page.goto("/login");
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
