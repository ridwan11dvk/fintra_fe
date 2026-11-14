import { test as base } from "../../../shared/fixtures/base.fixture";
import { CompanyPage } from "./company.page";

type CompanyFixtures = {
  companyPage: CompanyPage;
};

export const test = base.extend<CompanyFixtures>({
  companyPage: async ({ page }, use) => {
    const companyPage = new CompanyPage(page);
    await use(companyPage);
  },
});

export { expect } from "@playwright/test";
