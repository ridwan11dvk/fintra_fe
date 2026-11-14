import type { Page } from "@playwright/test";

interface MockOptions {
  status?: number;
  delay?: number;
}

/**
 * Mock an API endpoint with a JSON response.
 * Matches any request whose URL contains the given endpoint path.
 */
export async function mockApiResponse(
  page: Page,
  endpoint: string,
  data: unknown,
  options: MockOptions = {},
) {
  const { status = 200, delay } = options;

  await page.route(`**/api${endpoint}`, async (route) => {
    if (delay) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    await route.fulfill({ status, json: data });
  });
}

/**
 * Mock an API endpoint to return an error.
 */
export async function mockApiError(
  page: Page,
  endpoint: string,
  status = 500,
  message = "Internal Server Error",
) {
  await page.route(`**/api${endpoint}`, (route) =>
    route.fulfill({
      status,
      json: { status: "ERROR", message, data: null },
    }),
  );
}

/**
 * Intercept and wait for an API call to complete.
 * Useful for asserting that a mutation was triggered.
 */
export async function waitForApiCall(page: Page, endpoint: string) {
  return page.waitForResponse(
    (response) => response.url().includes(endpoint) && response.status() < 400,
  );
}
