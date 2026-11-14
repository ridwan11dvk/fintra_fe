import { test as base } from "../../../shared/fixtures/base.fixture";
import { TransactionTypePage } from "./transaction-type.page";

type TransactionTypeFixtures = {
  transactionTypePage: TransactionTypePage;
};

export const test = base.extend<TransactionTypeFixtures>({
  transactionTypePage: async ({ page }, use) => {
    const transactionTypePage = new TransactionTypePage(page);
    await use(transactionTypePage);
  },
});

export { expect } from "@playwright/test";
