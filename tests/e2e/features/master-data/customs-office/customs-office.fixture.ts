import { test as base } from "../../../shared/fixtures/base.fixture";
import { CustomsOfficePage } from "./customs-office.page";

type CustomsOfficeFixtures = {
  customsOfficePage: CustomsOfficePage;
};

export const test = base.extend<CustomsOfficeFixtures>({
  customsOfficePage: async ({ page }, use) => {
    const customsOfficePage = new CustomsOfficePage(page);
    await use(customsOfficePage);
  },
});

export { expect } from "@playwright/test";
