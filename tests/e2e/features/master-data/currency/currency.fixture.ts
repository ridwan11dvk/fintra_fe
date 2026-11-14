import { test as base } from "../../../shared/fixtures/base.fixture";
import { CurrencyPage } from "./currency.page";

type CurrencyFixtures = {
  currencyPage: CurrencyPage;
};

export const test = base.extend<CurrencyFixtures>({
  currencyPage: async ({ page }, use) => {
    const currencyPage = new CurrencyPage(page);
    await use(currencyPage);
  },
});

export { expect } from "@playwright/test";
