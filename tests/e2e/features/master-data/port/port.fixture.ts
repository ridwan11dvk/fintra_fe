import { test as base } from "../../../shared/fixtures/base.fixture";
import { PortPage } from "./port.page";

type PortFixtures = {
  portPage: PortPage;
};

export const test = base.extend<PortFixtures>({
  portPage: async ({ page }, use) => {
    const portPage = new PortPage(page);
    await use(portPage);
  },
});

export { expect } from "@playwright/test";
