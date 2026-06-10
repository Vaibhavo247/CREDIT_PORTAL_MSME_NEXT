/**
 * Application Constants
 * Single source of truth for global configuration, roles, and static data.
 */

export const APP_ROLES = {
  ADMIN: "admin",
  CREDIT: "CREDIT",
  AUDIT: "AUDIT",
  USERACCESS: "USERACCESS",
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
};

export const FILTER_OPTIONS = {
  LOAN_AMOUNT_RANGES: [
    { label: "All Amounts", value: "all" },
    { label: "0 - 1 Lakh", value: "0-100000" },
    { label: "1 Lakh - 5 Lakhs", value: "100000-500000" },
    { label: "5 Lakhs - 10 Lakhs", value: "500000-1000000" },
    { label: "10+ Lakhs", value: "1000000-999999999" },
  ],
};
