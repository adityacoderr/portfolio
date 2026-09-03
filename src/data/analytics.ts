/**
 * Central config for portfolio analytics.
 * Update usernames here — components fetch live data client-side.
 * No secrets / tokens required. Set `enabled` to false to hide a provider.
 */
export const analyticsConfig = {
  github: {
    username: "adityacoderr",
    enabled: true,
    // Optional: show ghchart contribution graph (no auth)
    showContributionChart: true,
    // repos to highlight (by name) — falls back to most recently updated
    pinnedRepos: ["GCB-Backend", "GCB-Frontend", "yukti"] as string[],
  },
  leetcode: {
    username: "adityacoderrr",
    enabled: true,
    // Primary API (alfa) + fallback rendered via leetcard image
    // Profile: https://leetcode.com/u/adityacoderrr/
    apiBase: "https://alfa-leetcode-api.onrender.com",
    showCardImage: true,
  },
} as const;

export type AnalyticsConfig = typeof analyticsConfig;
