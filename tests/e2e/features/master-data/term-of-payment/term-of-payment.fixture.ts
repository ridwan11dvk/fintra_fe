import { test as base } from "../../../shared/fixtures/base.fixture";
import { TermOfPaymentPage } from "./term-of-payment.page";

type TermOfPaymentFixtures = {
  termOfPaymentPage: TermOfPaymentPage;
};

export const test = base.extend<TermOfPaymentFixtures>({
  termOfPaymentPage: async ({ page }, use) => {
    const termOfPaymentPage = new TermOfPaymentPage(page);
    await use(termOfPaymentPage);
  },
});

export { expect } from "@playwright/test";
