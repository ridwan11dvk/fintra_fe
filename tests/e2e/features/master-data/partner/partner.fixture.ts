import { test as base } from "../../../shared/fixtures/base.fixture";
import { PartnerPage } from "./partner.page";

type PartnerFixtures = {
  partnerPage: PartnerPage;
};

export const test = base.extend<PartnerFixtures>({
  partnerPage: async ({ page }, use) => {
    const partnerPage = new PartnerPage(page);
    await use(partnerPage);
  },
});

export { expect } from "@playwright/test";
