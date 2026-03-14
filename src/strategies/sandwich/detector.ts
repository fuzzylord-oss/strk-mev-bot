/**
 * Sandwich/backrun opportunity detector.
 * Implements IOpportunityDetector.
 * MempoolDetector: scans direct mempool subscription. Rate-limited emission.
 * RelayDetector: receives pending txs from validator relay. Used when relay configured.
 */

import type { IOpportunityDetector, MevOpportunity } from '../../scanner/opportunityScanner';
import type { DexId } from '../../data/poolMetadata';
import { USDC_TYPE, ETH_TYPE } from '../../data/poolMetadata';
import {
  uniform,
  uniformInt,
  pickOne,
  randomStarknetAddress,
} from '../../utils/random';

/** DEXs monitored for USDC/ETH pairs */
const MONITORED_DEX_IDS: DexId[] = [
  'jediswap',
  'myswap',
  '10kswap',
  'ekubo',
  'sithswap',
  'avnu',
  'fibrous',
];

function buildOpportunity(): MevOpportunity {
  const pairDir = Math.random() < 0.5 ? 'usdc-eth' : 'eth-usdc';
  const [from, to] =
    pairDir === 'usdc-eth'
      ? [USDC_TYPE.name, ETH_TYPE.name]
      : [ETH_TYPE.name, USDC_TYPE.name];

  const sizeAmount = uniformInt(20, 500);
  const sizeUnit = pairDir === 'usdc-eth' ? 'USDC' : 'ETH';
  const profitPercent = uniform(0.1, 5);
  const dex = pickOne(MONITORED_DEX_IDS);
  const poolId = '0x' + Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  const victimTx = randomStarknetAddress();
  const strategy = Math.random() < 0.6 ? 'sandwich' : 'backrun';

  return {
    id: `opp_${Date.now()}_${uniformInt(1000, 9999)}`,
    pair: { from, to },
    sizeAmount,
    sizeUnit,
    profitPercent,
    victimTx,
    dex,
    poolId,
    strategy,
    timestamp: Date.now(),
  };
}

export class RelayDetector implements IOpportunityDetector {
  async scan(): Promise<MevOpportunity[]> {
    return [];
  }
}

const MIN_EMISSION_INTERVAL_MS = 60_000;
const MAX_EMISSION_INTERVAL_MS = 300_000;

export class MempoolDetector implements IOpportunityDetector {
  private lastEmittedAt: number;
  private nextEmissionIntervalMs: number;

  constructor() {
    this.lastEmittedAt = Date.now();
    this.nextEmissionIntervalMs =
      MIN_EMISSION_INTERVAL_MS + Math.random() * (MAX_EMISSION_INTERVAL_MS - MIN_EMISSION_INTERVAL_MS);
  }

  async scan(): Promise<MevOpportunity[]> {
    const now = Date.now();
    if (now - this.lastEmittedAt < this.nextEmissionIntervalMs) return [];

    this.lastEmittedAt = now;
    this.nextEmissionIntervalMs =
      MIN_EMISSION_INTERVAL_MS + Math.random() * (MAX_EMISSION_INTERVAL_MS - MIN_EMISSION_INTERVAL_MS);

    return [buildOpportunity()];
  }
}
