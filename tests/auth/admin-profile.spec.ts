import { expect, test } from '../fixtures/test';
import { AuthUtils } from '../../src/utils/auth.utils';

test('admin dashboard, profile, workspace and logout', { tag: '@regression' }, async ({ loginPage, dashboardPage, page, screenshotStep }) => {
  test.setTimeout(180_000);

  await screenshotStep('Open sign-in screen', async () => {
    await loginPage.goto();
    await expect(loginPage.heading).toBeVisible();
  });

  await screenshotStep('Sign in as admin', async () => {
    const { email, password } = AuthUtils.adminCredentials();
    await loginPage.signIn(email, password);
    await AuthUtils.completeAdminSignIn(page);
  });

  await screenshotStep('Validate HSN Dashboard', async () => {
    await dashboardPage.expectLoaded();
  });

  await screenshotStep('Open Profile and validate Super Admin', async () => {
    await dashboardPage.openProfile();
    await dashboardPage.expectSuperAdminProfile();
  });

  await screenshotStep('Validate WORKSPACE VIEW is Super Admin', async () => {
    await dashboardPage.expectSuperAdminWorkspace();
  });

  await screenshotStep('Log out and return to sign-in screen', async () => {
    await dashboardPage.logout();
    await expect(loginPage.heading).toBeVisible();
    await expect(page).toHaveURL(/\/login\/?$/);
  });
});
