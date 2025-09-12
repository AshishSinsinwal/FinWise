// src/utils/index.js

/**
 * Utility to generate page URLs for navigation.
 * This ensures that if you change routes in one place,
 * all navigation stays consistent.
 */
export function createPageUrl(pageName) {
  switch (pageName) {
    case "Dashboard":
      return "/dashboard";
    case "AddTransaction":
      return "/transactions/add";
    case "Categories":
      return "/categories";
    case "Analytics":
      return "/analytics";
    default:
      return "/";
  }
}
