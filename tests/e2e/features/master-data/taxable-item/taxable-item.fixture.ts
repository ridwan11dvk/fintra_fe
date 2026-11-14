import { test as base } from "../../../shared/fixtures/base.fixture";
import { TaxableItemPage } from "./taxable-item.page";

type TaxableItemFixtures = {
  taxableItemPage: TaxableItemPage;
};

export const test = base.extend<TaxableItemFixtures>({
  taxableItemPage: async ({ page }, use) => {
    const taxableItemPage = new TaxableItemPage(page);
    await use(taxableItemPage);
  },
});

export { expect } from "@playwright/test";
