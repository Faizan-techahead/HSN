import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page';
import { DashboardPage } from '../../src/pages/dashboard.page';
import { BillingPage } from '../../src/pages/billing.page';

type TestFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  billingPage: BillingPage;
  screenshotStep: (title: string, body: () => Promise<void>) => Promise<void>;
};

export const test = base.extend<TestFixtures>({
  screenshotStep: async ({ page }, use, testInfo) => {
    await use(async (title, body) => {
      await base.step(title, async () => {
        try {
          await body();
        } finally {
          if (!page.isClosed()) {
            try {
              await testInfo.attach(title, {
                body: await page.screenshot({ fullPage: true, timeout: 5_000 }),
                contentType: 'image/png',
              });
            } catch (error) {
              // Keep the original assertion error if screenshot capture fails.
              console.warn(`Could not capture screenshot for "${title}":`, error);
            }
          }
        }
      });
    });
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  billingPage: async ({ page }, use) => {
    await use(new BillingPage(page));
  },
});

export { expect };
