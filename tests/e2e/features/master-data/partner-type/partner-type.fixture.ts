import { test as base } from "../../../shared/fixtures/base.fixture";
import { PartnerTypePage } from "./partner-type.page";

type PartnerTypeFixtures = {
  partnerTypePage: PartnerTypePage;
};

export const test = base.extend<PartnerTypeFixtures>({
  partnerTypePage: async ({ page }, use) => {
    const partnerTypePage = new PartnerTypePage(page);
    await use(partnerTypePage);
  },
});

export { expect } from "@playwright/test";
