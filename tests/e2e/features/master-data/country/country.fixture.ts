import { test as base } from "../../../shared/fixtures/base.fixture";
import { CountryPage } from "./country.page";

type CountryFixtures = {
  countryPage: CountryPage;
};

export const test = base.extend<CountryFixtures>({
  countryPage: async ({ page }, use) => {
    const countryPage = new CountryPage(page);
    await use(countryPage);
  },
});

export { expect } from "@playwright/test";
