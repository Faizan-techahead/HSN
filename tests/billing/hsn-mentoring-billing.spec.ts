import { expect, test } from '../fixtures/test';
import { AuthUtils } from '../../src/utils/auth.utils';
import {
  ACTIVE_SUBSCRIPTIONS_COLUMNS,
  BILLING_OPTIONS,
  CANCELLED_SUBSCRIPTIONS_COLUMNS,
  FAILED_PAYMENTS_COLUMNS,
  HSN_MENTORING_BILLING_OPTION,
  HSN_MENTORING_PAYMENT_DATE_FILTERS,
  HSN_MENTORING_PAYMENT_STATUS_FILTERS,
  HSN_MENTORING_PAYMENTS_COLUMNS,
  HSN_MENTORING_PLANS_HEADINGS,
  HSN_MENTORING_PLANS_SUB_TABS,
  HSN_MENTORING_METRIC_CARDS,
  HSN_MENTORING_SECTIONS,
  NEW_ORDERS_COLUMNS,
  PENDING_CANCEL_SUBSCRIPTION_COLUMNS,
  PENDING_CANCELLATIONS_COLUMNS,
} from '../../src/constants';

test.describe('HSN Mentoring Billing', { tag: '@regression' }, () => {
  // Separate scenarios; serial avoids concurrent admin OTP collisions.
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ loginPage, dashboardPage, billingPage, page, screenshotStep }, testInfo) => {
    test.setTimeout(180_000);

    await screenshotStep('Login to the application using Admin Cred', async () => {
      await loginPage.goto();
      await expect(loginPage.heading).toBeVisible();
      const { email, password } = AuthUtils.adminCredentials();
      await loginPage.signIn(email, password);
      await AuthUtils.completeAdminSignIn(page);
      await expect(page).not.toHaveURL(/\/login/);
    });

    await screenshotStep('Validate user able to see Platform Dashboard', async () => {
      await dashboardPage.expectLoaded();
      await expect(dashboardPage.heading).toHaveText('Platform Dashboard');
    });

    await screenshotStep('Validate user able to click on Billing and see 3 options', async () => {
      await expect(dashboardPage.billingNavButton).toBeVisible();
      await dashboardPage.openBillingMenu();
      const options = await dashboardPage.expectBillingOptions([...BILLING_OPTIONS]);
      expect(options).toHaveLength(BILLING_OPTIONS.length);
      await testInfo.attach('Billing options', {
        body: options.join('\n'),
        contentType: 'text/plain',
      });
      console.log('Billing options:', options);
    });

    await screenshotStep(`Validate user able to select ${HSN_MENTORING_BILLING_OPTION}`, async () => {
      await dashboardPage.selectBillingOption(HSN_MENTORING_BILLING_OPTION);
      await billingPage.expectHsnMentoringBillingScreen();
      await expect(billingPage.heading).toHaveText('Billing & Subscriptions');
      await expect(billingPage.mentoringSubtitle).toHaveText('HSN Mentoring');
    });

    await screenshotStep(
      'Validate Overview, Plans and Payments tabs on HSN Mentoring Billing Screen',
      async () => {
        await billingPage.expectMentoringTabs();
        await expect(billingPage.overviewTab).toHaveText('Overview');
        await expect(billingPage.plansTab).toHaveText('Plans');
      },
    );
  });

  test('Validate HSN Mentoring Billing Screen', async ({ billingPage, screenshotStep }) => {
    await screenshotStep('Validate HSN Mentoring Billing screen remains loaded', async () => {
      await billingPage.expectHsnMentoringBillingScreen();
      await billingPage.expectMentoringTabs();
      await expect(billingPage.heading).toHaveText('Billing & Subscriptions');
      await expect(billingPage.mentoringSubtitle).toHaveText('HSN Mentoring');
    });
  });

  test('Validate HSN Mentoring Billing Overview Screen', async ({ billingPage, screenshotStep }, testInfo) => {
    await screenshotStep('Validate user is on Overview tab', async () => {
      await billingPage.expectOverviewTabSelected();
    });

    for (const cardTitle of HSN_MENTORING_METRIC_CARDS) {
      await screenshotStep(`Validate ${cardTitle} card`, async () => {
        await billingPage.expectMetricCard(cardTitle);
      });
    }

    await screenshotStep(`Validate ${HSN_MENTORING_SECTIONS.newOrders} label`, async () => {
      await billingPage.expectSectionLabel(HSN_MENTORING_SECTIONS.newOrders);
    });

    await screenshotStep(`Validate ${HSN_MENTORING_SECTIONS.newOrders} table columns`, async () => {
      const columns = await billingPage.expectTableColumns(
        HSN_MENTORING_SECTIONS.newOrders,
        NEW_ORDERS_COLUMNS,
      );
      await testInfo.attach('New Orders columns', {
        body: columns.join('\n'),
        contentType: 'text/plain',
      });
    });

    await screenshotStep(`Validate ${HSN_MENTORING_SECTIONS.pendingCancellations} label`, async () => {
      await billingPage.expectSectionLabel(HSN_MENTORING_SECTIONS.pendingCancellations);
    });

    await screenshotStep(
      `Validate ${HSN_MENTORING_SECTIONS.pendingCancellations} table columns`,
      async () => {
        const columns = await billingPage.expectTableColumns(
          HSN_MENTORING_SECTIONS.pendingCancellations,
          PENDING_CANCELLATIONS_COLUMNS,
        );
        await testInfo.attach('Pending Cancellations columns', {
          body: columns.join('\n'),
          contentType: 'text/plain',
        });
      },
    );

    await screenshotStep(`Validate ${HSN_MENTORING_SECTIONS.failedPayments} label`, async () => {
      await billingPage.expectSectionLabel(HSN_MENTORING_SECTIONS.failedPayments);
    });

    await screenshotStep(
      `Validate ${HSN_MENTORING_SECTIONS.failedPayments} table columns`,
      async () => {
        const columns = await billingPage.expectTableColumns(
          HSN_MENTORING_SECTIONS.failedPayments,
          FAILED_PAYMENTS_COLUMNS,
        );
        await testInfo.attach('Failed Payments columns', {
          body: columns.join('\n'),
          contentType: 'text/plain',
        });
      },
    );
  });

  test('Validate HSN Mentoring Billing Plans Screen', async ({ billingPage, screenshotStep }, testInfo) => {
    await screenshotStep('Validate user is on Plans tab', async () => {
      await billingPage.plansTab.click();
      await billingPage.expectPlansTabSelected();
    });

    await screenshotStep('Validate user able to see Manage Plans label on Plans tab', async () => {
      await billingPage.expectManagePlansVisible();
    });

    await screenshotStep('Validate Plans sub-navigation options', async () => {
      await billingPage.expectPlansSubTabs();
      await billingPage.expectCreatePlanButtonVisible();
      await testInfo.attach('Plans sub-tabs', {
        body: [...HSN_MENTORING_PLANS_SUB_TABS].join('\n'),
        contentType: 'text/plain',
      });
    });

    await screenshotStep('Validate Active Plans default view', async () => {
      await billingPage.expectActivePlansContent();
    });

    await screenshotStep('Validate Active Subscriptions table', async () => {
      await billingPage.selectPlansSubTab('Active Subscriptions');
      await billingPage.expectPlansSubTabSelected('Active Subscriptions');
      await billingPage.expectPlansContentHeading(HSN_MENTORING_PLANS_HEADINGS.plansList);
      await billingPage.expectPlansSearchAndCategoryFilter();
      const columns = await billingPage.expectPlansTableColumns(ACTIVE_SUBSCRIPTIONS_COLUMNS);
      await testInfo.attach('Active Subscriptions columns', {
        body: columns.join('\n'),
        contentType: 'text/plain',
      });
    });

    await screenshotStep('Validate Pending Cancel subscriptions table', async () => {
      await billingPage.selectPlansSubTab('Pending Cancel');
      await billingPage.expectPlansSubTabSelected('Pending Cancel');
      await billingPage.expectPlansContentHeading(HSN_MENTORING_PLANS_HEADINGS.plansList);
      await billingPage.expectPlansSearchAndCategoryFilter();
      const columns = await billingPage.expectPlansTableColumns(PENDING_CANCEL_SUBSCRIPTION_COLUMNS);
      await testInfo.attach('Pending Cancel columns', {
        body: columns.join('\n'),
        contentType: 'text/plain',
      });
    });

    await screenshotStep('Validate Cancelled Subscriptions table', async () => {
      await billingPage.selectPlansSubTab('Cancelled Subscriptions');
      await billingPage.expectPlansSubTabSelected('Cancelled Subscriptions');
      await billingPage.expectPlansContentHeading(HSN_MENTORING_PLANS_HEADINGS.plansList);
      await billingPage.expectPlansSearchAndCategoryFilter();
      const columns = await billingPage.expectPlansTableColumns(CANCELLED_SUBSCRIPTIONS_COLUMNS);
      await testInfo.attach('Cancelled Subscriptions columns', {
        body: columns.join('\n'),
        contentType: 'text/plain',
      });
    });

    await screenshotStep('Validate Inactive Plans view', async () => {
      await billingPage.selectPlansSubTab('Inactive Plans');
      await billingPage.expectPlansSubTabSelected('Inactive Plans');
      await billingPage.expectPlansContentHeading(HSN_MENTORING_PLANS_HEADINGS.plansList);
      await billingPage.expectPlansSearchAndCategoryFilter();
    });

    await screenshotStep('Validate Plan Categories view', async () => {
      await billingPage.selectPlansSubTab('Plan Categories');
      await billingPage.expectPlansSubTabSelected('Plan Categories');
      await billingPage.expectPlanCategoriesContent();
    });
  });

  test('Validate HSN Mentoring Billing Payments Screen', async ({ billingPage, screenshotStep }, testInfo) => {
    await screenshotStep('Validate user is on Payments tab', async () => {
      await billingPage.paymentsTab.click();
      await billingPage.expectPaymentsTabSelected();
      await expect(billingPage.paymentsTab).toHaveText(/^Payments(?:\s*\(\d+\))?$/);
    });

    await screenshotStep('Validate All Plan Payments heading and controls', async () => {
      await billingPage.expectPaymentsContent();
      await testInfo.attach('Payments status filters', {
        body: [...HSN_MENTORING_PAYMENT_STATUS_FILTERS].join('\n'),
        contentType: 'text/plain',
      });
      await testInfo.attach('Payments date filters', {
        body: [...HSN_MENTORING_PAYMENT_DATE_FILTERS].join('\n'),
        contentType: 'text/plain',
      });
    });

    await screenshotStep('Validate Payments table columns', async () => {
      const columns = await billingPage.expectPlansTableColumns(HSN_MENTORING_PAYMENTS_COLUMNS);
      await testInfo.attach('Payments columns', {
        body: columns.join('\n'),
        contentType: 'text/plain',
      });
      console.log('Payments columns:', columns);
    });
  });
});
