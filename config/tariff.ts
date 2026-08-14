/**
 * Energy tariff configuration.
 *
 * Kept isolated from calculation logic (see lib/utils.ts -> calculateCost)
 * so the price can change without touching any component. In Phase 2+ this
 * can be replaced by a value fetched from the backend/settings API per user
 * or per region, without changing the calculation call sites.
 */
export const TARIFF_CONFIG = {
  /** AZN per kWh, current default residential tariff. */
  pricePerKwh: 0.112,
  currency: "AZN",
} as const;
