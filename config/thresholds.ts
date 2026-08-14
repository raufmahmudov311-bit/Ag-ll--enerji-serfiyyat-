/**
 * Safety and alerting thresholds. Centralised so the simulator, the alert
 * engine, and the dashboard status badges all agree on what "normal" means.
 *
 * IMPORTANT: these are reasonable demo defaults for a 220-240V single-phase
 * residential connection, not certified safety limits. A real deployment
 * must have these values reviewed by a qualified electrician and, for
 * leakage detection specifically, backed by real residual-current hardware.
 */
export const THRESHOLDS = {
  voltage: {
    min: 220,
    max: 240,
    nominal: 230,
  },
  leakage: {
    /** mA — above this, an alert is raised. Standard RCD trip points are
     * typically 10-30 mA for personal protection; this demo uses a
     * conservative dashboard-only warning level, NOT a substitute for a
     * certified RCD. */
    warnAt: 10,
  },
  consumptionSpikePercent: 15,
} as const;
