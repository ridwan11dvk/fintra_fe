import { test as base } from "../../../shared/fixtures/base.fixture";
import { ProvincePage } from "./province.page";

type ProvinceFixtures = {
  provincePage: ProvincePage;
};

export const test = base.extend<ProvinceFixtures>({
  provincePage: async ({ page }, use) => {
    const provincePage = new ProvincePage(page);
    await use(provincePage);
  },
});

export { expect } from "@playwright/test";
