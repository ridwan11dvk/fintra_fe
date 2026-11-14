import { test as base } from "../../../shared/fixtures/base.fixture";
import { PartnerCategoryPage } from "./partner-category.page";

type PartnerCategoryFixtures = {
  partnerCategoryPage: PartnerCategoryPage;
};

export const test = base.extend<PartnerCategoryFixtures>({
  partnerCategoryPage: async ({ page }, use) => {
    const partnerCategoryPage = new PartnerCategoryPage(page);
    await use(partnerCategoryPage);
  },
});

export { expect } from "@playwright/test";
