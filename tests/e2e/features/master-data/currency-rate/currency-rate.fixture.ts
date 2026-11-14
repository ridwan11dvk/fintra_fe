import { test as base } from "../../../shared/fixtures/base.fixture";
import { CurrencyRatePage } from "./currency-rate.page";

type CurrencyRateFixtures = {
  currencyRatePage: CurrencyRatePage;
};

export const test = base.extend<CurrencyRateFixtures>({
  currencyRatePage: async ({ page }, use) => {
    const currencyRatePage = new CurrencyRatePage(page);
    await use(currencyRatePage);
  },
});

export { expect } from "@playwright/test";
