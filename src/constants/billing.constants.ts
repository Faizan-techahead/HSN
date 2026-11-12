/** Shared Billing UI labels and expected table columns for automation. */

export const BILLING_OPTIONS = [
  'HSN Mentoring Billing',
  'Ambassador Billing',
  'Referral Subscriber',
] as const;

export type BillingOption = (typeof BILLING_OPTIONS)[number];

export const HSN_MENTORING_BILLING_OPTION = BILLING_OPTIONS[0];

export const HSN_MENTORING_METRIC_CARDS = [
  'Monthly Revenue To Date',
  'Monthly Recurring Revenue',
  'App Overage Revenue',
  'Revenue Forecast',
] as const;

export const HSN_MENTORING_SECTIONS = {
  newOrders: 'New Orders',
  pendingCancellations: 'Pending Cancellations',
  failedPayments: 'Failed Payments',
} as const;

export const NEW_ORDERS_COLUMNS = [
  'Date',
  'Contact',
  'Business',
  'Plan',
  'Category',
  'Amount',
  'Actions',
] as const;

export const PENDING_CANCELLATIONS_COLUMNS = [
  'Cancel Date',
  'Contact',
  'Business',
  'Plan',
  'Amount',
  'Last Payment',
  'Request Date',
  'Actions',
] as const;

export const FAILED_PAYMENTS_COLUMNS = [
  'Business',
  'Owner',
  'Plan',
  'Amount',
  'Retries',
  'Status',
  'Actions',
] as const;

export const HSN_MENTORING_PLANS_SUB_TABS = [
  'Active Plans',
  'Active Subscriptions',
  'Pending Cancel',
  'Cancelled Subscriptions',
  'Inactive Plans',
  'Plan Categories',
] as const;

export const HSN_MENTORING_PLANS_HEADINGS = {
  managePlans: 'Manage Plans',
  plansList: 'Plans',
  categories: 'Categories',
  allPlanPayments: 'All Plan Payments',
} as const;

export const ACTIVE_SUBSCRIPTIONS_COLUMNS = [
  'Name',
  'Business Name',
  'Plan',
  'Amount',
  'Start Date',
  'Last Payment',
  'Next Payment',
  'Category',
  'Actions',
] as const;

export const PENDING_CANCEL_SUBSCRIPTION_COLUMNS = [
  'Name',
  'Business Name',
  'Plan',
  'Amount',
  'Start Date',
  'Last Payment',
  'Cancellation Requested',
  'End Date',
  'Actions',
] as const;

export const CANCELLED_SUBSCRIPTIONS_COLUMNS = [
  'Name',
  'Business Name',
  'Plan',
  'Amount',
  'Start Date',
  'Last Payment',
  'Status',
  'Actions',
] as const;

export const HSN_MENTORING_PAYMENTS_COLUMNS = [
  'Transaction',
  'Date',
  'Business',
  'Owner',
  'Plan',
  'Amount',
  'Next Payment',
  'Category',
  'Actions',
] as const;
