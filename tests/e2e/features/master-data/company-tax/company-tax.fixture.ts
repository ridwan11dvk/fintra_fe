import { test as base } from "../../../shared/fixtures/base.fixture";
import { CompanyTaxPage } from "./company-tax.page";

type CompanyTaxFixtures = {
  companyTaxPage: CompanyTaxPage;
};

export const test = base.extend<CompanyTaxFixtures>({
  companyTaxPage: async ({ page }, use) => {
    const companyTaxPage = new CompanyTaxPage(page);
    await use(companyTaxPage);
  },
});

export { expect } from "@playwright/test";
