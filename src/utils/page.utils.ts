import type { Page } from '@playwright/test';

export class PageUtils {
  static async waitForPageIdle(page: Page): Promise<void> {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle');
  }
}
