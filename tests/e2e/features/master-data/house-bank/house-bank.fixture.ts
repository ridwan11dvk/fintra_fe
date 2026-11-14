import { test as base } from "../../../shared/fixtures/base.fixture";
import { HouseBankPage } from "./house-bank.page";

type HouseBankFixtures = {
  houseBankPage: HouseBankPage;
};

export const test = base.extend<HouseBankFixtures>({
  houseBankPage: async ({ page }, use) => {
    const houseBankPage = new HouseBankPage(page);
    await use(houseBankPage);
  },
});

export { expect } from "@playwright/test";
