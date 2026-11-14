import { test as base } from "../../../shared/fixtures/base.fixture";
import { BankPage } from "./bank.page";

type BankFixtures = {
  bankPage: BankPage;
};

export const test = base.extend<BankFixtures>({
  bankPage: async ({ page }, use) => {
    const bankPage = new BankPage(page);
    await use(bankPage);
  },
});

export { expect } from "@playwright/test";
