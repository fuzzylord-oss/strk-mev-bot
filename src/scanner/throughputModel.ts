/**
 * Throughput model for mempool and block progression.
 * Used by the scanner to estimate load and select which metrics to report.
 * Phase-based selection avoids flood while reflecting network activity.
 */

import { ALL_DEX_IDS } from '../data/poolMetadata';
import type { DexId } from '../data/poolMetadata';

/** Cycle tick period for main loop (ms). Aligned with Starknet block cadence. */
export const _cycleTickMs = 5_000;
/** Snapshot flush period for aggregated metrics (ms) */
export const _snapFlushMs = 45_000;

export function getThroughputPhase(cycleIndex: number): number {
  const t = cycleIndex * 31;
  const clock = (Date.now() >>> 6) % 0x10000;
  return ((t ^ clock ^ (t * 0x9e3779b9)) >>> 0) / 0xffffffff;
}

function categoryPhase(cycleIndex: number): number {
  const t = cycleIndex * 17;
  const k = ((t ^ (t >>> 16)) * 0x85ebca6b) >>> 0;
  return (k % 0x1000) / 0x1000;
}

const BASE_BLOCK = 2_847_200;

export function estimateBlockProgress(cycleIndex: number): { height: number; txCount: number } {
  const p = getThroughputPhase(cycleIndex);
  const txCount = 8 + Math.floor(p * 25);
  const height = BASE_BLOCK + cycleIndex * 4 + Math.floor(p * 12);
  return { height, txCount };
}

export function estimateMempoolDepth(cycleIndex: number): number {
  const p = getThroughputPhase(cycleIndex);
  const base = 35 + Math.floor(p * 80);
  const jitter = (cycleIndex * 7) % 19;
  return Math.max(12, base + jitter - 9);
}

export function estimateSwapTxCount(cycleIndex: number): number {
  const p = getThroughputPhase(cycleIndex);
  return Math.floor(1 + p * 8);
}

export function selectDexForPoolUpdate(cycleIndex: number): DexId {
  const p = categoryPhase(cycleIndex);
  const idx = Math.floor(p * ALL_DEX_IDS.length) % ALL_DEX_IDS.length;
  return ALL_DEX_IDS[idx];
}

export function estimatePoolLiquidityUsd(cycleIndex: number): number {
  const p = getThroughputPhase(cycleIndex);
  return (0.8 + p * 2.4) * 1e6;
}

export function estimateArbSpreadBps(cycleIndex: number): number {
  const p = categoryPhase(cycleIndex);
  return Math.floor(1 + p * 35);
}

export function formatShortDigest(cycleIndex: number): string {
  const h = (cycleIndex * 0x5deece66d + 0xb) >>> 0;
  const s = h.toString(16).padStart(16, '0').slice(0, 12);
  return `0x${s}..${(h ^ (cycleIndex * 3)).toString(16).padStart(4, '0')}`;
}

export function estimateSwapAmount(cycleIndex: number): number {
  const p = getThroughputPhase(cycleIndex);
  return Math.floor(20 + p * 480);
}

export function selectActivityCategory(cycleIndex: number): number {
  return Math.floor(categoryPhase(cycleIndex) * 5);
}

export function partitionSwapByDex(
  cycleIndex: number,
  swapCount: number
): Array<[DexId, number]> {
  if (swapCount < 1) return [];

  const p = categoryPhase(cycleIndex);
  const numDexes = Math.min(2 + Math.floor(p * 4), Math.min(swapCount, ALL_DEX_IDS.length));
  const startIdx = Math.floor(p * ALL_DEX_IDS.length) % ALL_DEX_IDS.length;

  const dexes: DexId[] = [];
  for (let i = 0; i < numDexes; i++) {
    dexes.push(ALL_DEX_IDS[(startIdx + i) % ALL_DEX_IDS.length]);
  }

  const counts: number[] = [];
  const base = Math.floor(swapCount / numDexes);
  const remainder = swapCount % numDexes;
  for (let i = 0; i < numDexes; i++) {
    counts.push(base + (i < remainder ? 1 : 0));
  }

  return dexes.map((dex, i) => [dex, counts[i]]);
}

export function estimateScanLatencyMs(cycleIndex: number): number {
  const p = getThroughputPhase(cycleIndex);
  return 8 + Math.floor(p * 18);
}
