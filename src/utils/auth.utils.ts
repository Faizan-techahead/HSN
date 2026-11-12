import { expect, type Page } from '@playwright/test';
import { PageUtils } from './page.utils';

export class AuthUtils {
  static adminCredentials(): { email: string; password: string } {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) {
      throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env or your shell before running admin tests.');
    }
    return { email, password };
  }

  static async completeAdminSignIn(page: Page): Promise<void> {
    await expect(page).not.toHaveURL(/\/login\/?(?:[?#].*)?$/);
    if (!new URL(page.url()).pathname.startsWith('/login/verify-otp')) return;

    const otp = process.env.ADMIN_OTP ?? '123456';
    if (!/^\d{6}$/.test(otp)) {
      throw new Error(
        'ADMIN_OTP must contain exactly six digits.',
      );
    }
    for (const [index, digit] of [...otp].entries()) {
      await page.getByRole('textbox', { name: `Digit ${index + 1} of 6`, exact: true }).fill(digit);
    }
    await page.getByRole('button', { name: 'Verify', exact: true }).click();
    await expect(page).not.toHaveURL(/\/login\/verify-otp/);
    await PageUtils.waitForPageIdle(page);
  }
}
