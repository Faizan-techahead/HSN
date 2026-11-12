import { expect, type Page } from '@playwright/test';

export class DashboardPage {
  constructor(private readonly page: Page) {}

  get heading() {
    return this.page.getByRole('heading', { name: 'Platform Dashboard', exact: true });
  }

  get profileButton() {
    return this.page.getByRole('button', { name: 'Profile menu', exact: true });
  }

  get profileMenu() {
    return this.page.getByRole('menu');
  }

  get sideNav() {
    return this.page.getByRole('navigation');
  }

  get billingNavButton() {
    return this.sideNav.getByRole('button', { name: 'Billing', exact: true });
  }

  billingOptionLink(optionName: string) {
    return this.sideNav.getByRole('link', { name: optionName, exact: true });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/admin\/dashboard\/?$/);
    await expect(this.heading).toBeVisible();
  }

  async openProfile(): Promise<void> {
    await this.profileButton.click();
  }

  async expectSuperAdminProfile(): Promise<void> {
    await expect(
      this.profileMenu.getByRole('paragraph').filter({ hasText: /^Super Admin$/ }),
    ).toBeVisible();
  }

  async expectSuperAdminWorkspace(): Promise<void> {
    await expect(this.profileMenu.getByText('Workspace view', { exact: true })).toBeVisible();
    await expect(
      this.profileMenu.getByRole('menuitem', { name: 'Super Admin', exact: true }),
    ).toBeVisible();
  }

  async openBillingMenu(): Promise<void> {
    await expect(this.billingNavButton).toBeVisible();
    await expect(this.billingNavButton).toBeEnabled();
    await this.billingNavButton.click();
  }

  async getBillingOptions(): Promise<string[]> {
    const billingItem = this.sideNav.getByRole('listitem').filter({
      has: this.page.getByRole('button', { name: 'Billing', exact: true }),
    });
    const optionLinks = billingItem.getByRole('link');
    await expect(optionLinks.first()).toBeVisible();
    const labels = (await optionLinks.allTextContents()).map((text) =>
      text.replace(/\s+/g, ' ').trim(),
    );
    return labels.filter(Boolean);
  }

  async expectBillingOptions(expectedOptions: readonly string[]): Promise<string[]> {
    const options = await this.getBillingOptions();
    expect(options).toHaveLength(expectedOptions.length);
    expect(options).toEqual(expectedOptions);
    for (const optionName of expectedOptions) {
      const option = this.billingOptionLink(optionName);
      await expect(option).toBeVisible();
      await expect(option).toBeEnabled();
    }
    return options;
  }

  async selectBillingOption(optionName: string): Promise<void> {
    const option = this.billingOptionLink(optionName);
    if (!(await option.isVisible().catch(() => false))) {
      await this.openBillingMenu();
    }
    await expect(option).toBeVisible();
    await expect(option).toBeEnabled();
    await option.click();
  }

  async logout(): Promise<void> {
    await this.profileMenu.getByRole('menuitem', { name: 'Logout', exact: true }).click();
    const logoutDialog = this.page.getByRole('dialog', { name: 'Logout' });
    await expect(logoutDialog).toBeVisible();
    await logoutDialog.getByRole('button', { name: 'Yes, Logout', exact: true }).click();
  }
}
