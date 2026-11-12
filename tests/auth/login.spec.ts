import { expect, test } from '../fixtures/test';

test.describe('Sign in page', { tag: '@regression' }, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('shows the sign-in form', async ({ loginPage, page }) => {
    await expect(page).toHaveTitle('HSN Sign In');
    await expect(loginPage.heading).toBeVisible();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });
});
