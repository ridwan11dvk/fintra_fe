import { test as base } from "../../../shared/fixtures/base.fixture";
import { TransactionCategoryPage } from "./transaction-category.page";

type TransactionCategoryFixtures = {
  transactionCategoryPage: TransactionCategoryPage;
};

export const test = base.extend<TransactionCategoryFixtures>({
  transactionCategoryPage: async ({ page }, use) => {
    const transactionCategoryPage = new TransactionCategoryPage(page);
    await use(transactionCategoryPage);
  },
});

export { expect } from "@playwright/test";
