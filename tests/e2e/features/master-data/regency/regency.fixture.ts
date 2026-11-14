import { test as base } from "../../../shared/fixtures/base.fixture";
import { RegencyPage } from "./regency.page";

type RegencyFixtures = {
  regencyPage: RegencyPage;
};

export const test = base.extend<RegencyFixtures>({
  regencyPage: async ({ page }, use) => {
    const regencyPage = new RegencyPage(page);
    await use(regencyPage);
  },
});

export { expect } from "@playwright/test";
