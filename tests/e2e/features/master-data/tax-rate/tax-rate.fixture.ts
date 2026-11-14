import { test as base } from "../../../shared/fixtures/base.fixture";
import { TaxRatePage } from "./tax-rate.page";

type TaxRateFixtures = {
  taxRatePage: TaxRatePage;
};

export const test = base.extend<TaxRateFixtures>({
  taxRatePage: async ({ page }, use) => {
    const taxRatePage = new TaxRatePage(page);
    await use(taxRatePage);
  },
});

export { expect } from "@playwright/test";
