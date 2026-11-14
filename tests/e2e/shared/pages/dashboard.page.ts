import type { Page } from "@playwright/test";
import { HeaderComponent } from "../components/header.component";
import { SidebarComponent } from "../components/sidebar.component";
import { BasePage } from "./base.page";

export class DashboardPage extends BasePage {
  readonly sidebar: SidebarComponent;
  readonly header: HeaderComponent;

  constructor(page: Page) {
    super(page);
    this.sidebar = new SidebarComponent(page);
    this.header = new HeaderComponent(page);
  }

  async goto() {
    await this.page.goto("/dashboard");
  }
}
