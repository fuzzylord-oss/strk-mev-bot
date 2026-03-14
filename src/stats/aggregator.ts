/**
 * Stats aggregator.
 * Collects metrics and produces display-ready stats for console UI.
 */

import type { Metrics } from './metrics';
import { formatUptime, POOLS_MONITORED, DEXS_ACTIVE } from './metrics';

export interface StatsSnapshot {
  readonly uptimeFormatted: string;
  readonly scanCycles: number;
  readonly blocksAnalyzed: number;
  readonly transactionsEvaluated: number;
  readonly poolsMonitored: number;
  readonly dexsActive: number;
  readonly opportunitiesSeen: number;
  readonly profitPotential: string | null;
  readonly lastScanLatencyMs: number;
  readonly mempoolDepth: number;
}

export function buildStatsSnapshot(m: Metrics, isProduction: boolean): StatsSnapshot {
  return {
    uptimeFormatted: formatUptime(Date.now() - m.startTime),
    scanCycles: m.scanCycles,
    blocksAnalyzed: m.blocksAnalyzed,
    transactionsEvaluated: m.transactionsEvaluated,
    poolsMonitored: POOLS_MONITORED,
    dexsActive: DEXS_ACTIVE,
    opportunitiesSeen: m.opportunitiesSeen,
    profitPotential:
      m.profitPotentialUsd > 0
        ? `$${m.profitPotentialUsd.toFixed(2)}`
        : isProduction
          ? 'N/A'
          : null,
    lastScanLatencyMs: m.lastCycleLatencyMs,
    mempoolDepth: m.mempoolDepth,
  };
}
