import { expect, type Locator, type Page } from '@playwright/test';
import {
  HSN_MENTORING_PAYMENT_DATE_FILTERS,
  HSN_MENTORING_PAYMENT_STATUS_FILTERS,
  HSN_MENTORING_PLANS_HEADINGS,
  HSN_MENTORING_PLANS_SUB_TABS,
} from '../constants/billing.constants';

export class BillingPage {
  constructor(private readonly page: Page) {}

  get main() {
    return this.page.getByRole('main');
  }

  get heading() {
    return this.page.getByRole('heading', { name: 'Billing & Subscriptions', exact: true });
  }

  get mentoringSubtitle() {
    return this.main.getByText('HSN Mentoring', { exact: true });
  }

  get overviewTab() {
    return this.page.getByRole('button', { name: 'Overview', exact: true });
  }

  get plansTab() {
    return this.page.getByRole('button', { name: 'Plans', exact: true });
  }

  get paymentsTab() {
    return this.page.getByRole('button', { name: /^Payments/ });
  }

  metricCard(title: string): Locator {
    return this.main.locator('article').filter({
      has: this.page.getByText(title, { exact: true }),
    });
  }

  section(name: string): Locator {
    return this.main.locator('section').filter({
      has: this.page.getByRole('heading', { name, exact: true, level: 2 }),
    });
  }

  sectionHeading(name: string): Locator {
    return this.section(name).getByRole('heading', { name, exact: true, level: 2 });
  }

  sectionTable(sectionName: string): Locator {
    return this.section(sectionName).locator('table').first();
  }

  get managePlansHeading() {
    return this.main.getByRole('heading', {
      name: HSN_MENTORING_PLANS_HEADINGS.managePlans,
      exact: true,
      level: 2,
    });
  }

  get createPlanButton() {
    return this.main.getByRole('button', { name: 'Create Plan', exact: true });
  }

  plansSubTab(name: (typeof HSN_MENTORING_PLANS_SUB_TABS)[number] | string): Locator {
    return this.main.getByRole('button', { name, exact: true });
  }

  plansContentHeading(name: string): Locator {
    return this.main.getByRole('heading', { name, exact: true, level: 2 });
  }

  get plansContentTable(): Locator {
    return this.main.locator('table').first();
  }

  async expectHsnMentoringBillingScreen(): Promise<void> {
    await expect(this.page).toHaveURL(/\/admin\/subscriptions\?billingView=hsn-mentoring/);
    await expect(this.heading).toBeVisible();
    await expect(this.mentoringSubtitle).toBeVisible();
  }

  async expectMentoringTabs(): Promise<void> {
    await expect(this.overviewTab).toBeVisible();
    await expect(this.overviewTab).toBeEnabled();
    await expect(this.plansTab).toBeVisible();
    await expect(this.plansTab).toBeEnabled();
    await expect(this.paymentsTab).toBeVisible();
    await expect(this.paymentsTab).toBeEnabled();
    await expect(this.paymentsTab).toHaveText(/^Payments(?:\s*\(\d+\))?$/);
  }

  async expectOverviewTabSelected(): Promise<void> {
    await expect(this.overviewTab).toBeVisible();
    // UI exposes selection via styling only (no aria-selected / data-state).
    await expect(this.overviewTab).toHaveClass(/bg-\[#272725\]/);
    await expect(this.plansTab).not.toHaveClass(/bg-\[#272725\]/);
    await expect(this.metricCard('Monthly Revenue To Date')).toBeVisible();
  }

  async expectPlansTabSelected(): Promise<void> {
    await expect(this.plansTab).toBeVisible();
    await expect(this.plansTab).toHaveClass(/bg-\[#272725\]/);
    await expect(this.overviewTab).not.toHaveClass(/bg-\[#272725\]/);
    await expect(this.managePlansHeading).toBeVisible();
  }

  async expectPaymentsTabSelected(): Promise<void> {
    await expect(this.paymentsTab).toBeVisible();
    await expect(this.paymentsTab).toHaveClass(/bg-\[#272725\]/);
    await expect(this.plansTab).not.toHaveClass(/bg-\[#272725\]/);
    await expect(this.plansContentHeading(HSN_MENTORING_PLANS_HEADINGS.allPlanPayments)).toBeVisible();
  }

  async expectPaymentsContent(): Promise<void> {
    await this.expectPaymentsTabSelected();
    await this.expectPlansContentHeading(HSN_MENTORING_PLANS_HEADINGS.allPlanPayments);
    await expect(this.main.getByRole('textbox', { name: 'Search payments', exact: true })).toBeVisible();
    await expect(this.main.getByRole('button', { name: 'Category filter' })).toBeVisible();
    await expect(this.main.getByText(/^Total:\s*\$[\d,]+(?:\.\d{2})?$/)).toBeVisible();

    for (const name of HSN_MENTORING_PAYMENT_STATUS_FILTERS) {
      await expect(this.main.getByRole('button', { name: new RegExp(`^${name}(?:\\s*\\(\\d+\\))?$`) })).toBeVisible();
    }

    for (const name of HSN_MENTORING_PAYMENT_DATE_FILTERS) {
      await expect(this.main.getByRole('button', { name, exact: true })).toBeVisible();
    }

    await expect(this.main.getByRole('button', { name: 'Results per page' })).toBeVisible();
    await expect(this.main.getByRole('textbox', { name: 'Go to page', exact: true })).toBeVisible();
  }

  async expectManagePlansVisible(): Promise<void> {
    await expect(this.managePlansHeading).toBeVisible();
  }

  async expectPlansSubTabs(): Promise<void> {
    for (const name of HSN_MENTORING_PLANS_SUB_TABS) {
      const tab = this.plansSubTab(name);
      await expect(tab).toBeVisible();
      await expect(tab).toBeEnabled();
    }
  }

  async expectCreatePlanButtonVisible(): Promise<void> {
    await expect(this.createPlanButton).toBeVisible();
    await expect(this.createPlanButton).toBeEnabled();
  }

  async expectPlansSubTabSelected(name: (typeof HSN_MENTORING_PLANS_SUB_TABS)[number]): Promise<void> {
    await expect(this.plansSubTab(name)).toHaveClass(/bg-\[#272725\]/);
  }

  async selectPlansSubTab(name: (typeof HSN_MENTORING_PLANS_SUB_TABS)[number]): Promise<void> {
    const tab = this.plansSubTab(name);
    await expect(tab).toBeVisible();
    await tab.click();
  }

  async expectPlansContentHeading(name: string): Promise<void> {
    await expect(this.plansContentHeading(name)).toBeVisible();
  }

  async expectPlansSearchAndCategoryFilter(): Promise<void> {
    await expect(this.main.getByRole('searchbox')).toBeVisible();
    await expect(this.main.getByRole('combobox').filter({ hasText: 'All Category' })).toBeVisible();
  }

  async expectActivePlansContent(): Promise<void> {
    await this.expectPlansSubTabSelected('Active Plans');
    await this.expectManagePlansVisible();
    await this.expectCreatePlanButtonVisible();
    await expect(this.main.getByText(/\$\d+/).first()).toBeVisible();
    await expect(this.main.getByText(/\d+\s+active/i).first()).toBeVisible();
  }

  async expectPlanCategoriesContent(): Promise<void> {
    await this.expectPlansContentHeading(HSN_MENTORING_PLANS_HEADINGS.categories);
    await expect(this.main.getByRole('textbox', { name: 'Go to page', exact: true })).toBeVisible();
    await expect(this.main.getByRole('button', { name: 'Results per page' })).toBeVisible();
  }

  async expectMetricCard(title: string): Promise<void> {
    const card = this.metricCard(title);
    await expect(card).toBeVisible();
    await expect(card.getByText(title, { exact: true })).toBeVisible();
  }

  async expectSectionLabel(name: string): Promise<void> {
    await expect(this.sectionHeading(name)).toBeVisible();
  }

  async expectTableColumns(sectionName: string, expectedColumns: readonly string[]): Promise<string[]> {
    const table = this.sectionTable(sectionName);
    await expect(table).toBeVisible();

    const headers = table.locator('thead th');
    await expect(headers).toHaveCount(expectedColumns.length);

    const columns = (await headers.allTextContents()).map((text) => text.replace(/\s+/g, ' ').trim());
    expect(columns).toEqual([...expectedColumns]);

    for (const column of expectedColumns) {
      await expect(table.getByRole('columnheader', { name: column, exact: true })).toBeVisible();
    }

    return columns;
  }

  async expectPlansTableColumns(expectedColumns: readonly string[]): Promise<string[]> {
    const table = this.plansContentTable;
    await expect(table).toBeVisible();

    const headers = table.locator('thead th');
    await expect(headers).toHaveCount(expectedColumns.length);

    const columns = (await headers.allTextContents()).map((text) => text.replace(/\s+/g, ' ').trim());
    expect(columns).toEqual([...expectedColumns]);

    for (const column of expectedColumns) {
      await expect(table.getByRole('columnheader', { name: column, exact: true })).toBeVisible();
    }

    return columns;
  }
}
