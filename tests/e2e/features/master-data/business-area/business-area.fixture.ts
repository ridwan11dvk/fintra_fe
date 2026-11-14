import { test as base } from "../../../shared/fixtures/base.fixture";
import { BusinessAreaPage } from "./business-area.page";

type BusinessAreaFixtures = {
  businessAreaPage: BusinessAreaPage;
};

export const test = base.extend<BusinessAreaFixtures>({
  businessAreaPage: async ({ page }, use) => {
    const businessAreaPage = new BusinessAreaPage(page);
    await use(businessAreaPage);
  },
});

export { expect } from "@playwright/test";

