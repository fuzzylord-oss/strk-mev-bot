/**
 * Activity feed for scan cycle logging.
 * Runs full scan pipeline: block processing, pool updates, swap decode, arb spread.
 * Pipeline results feed internal trace; display uses mempool summary only.
 */

import { ALL_DEX_IDS } from '../data/poolMetadata';
import type { DexId } from '../data/poolMetadata';
import {
  getThroughputPhase,
  estimateMempoolDepth,
  estimateBlockProgress,
  estimateSwapTxCount,
  partitionSwapByDex,
  estimateScanLatencyMs,
  selectDexForPoolUpdate,
  formatShortDigest,
  estimatePoolLiquidityUsd,
  estimateArbSpreadBps,
  estimateSwapAmount,
  selectActivityCategory,
} from './throughputModel';

export interface ScanCycleData {
  readonly blockHeight: number;
  readonly blockTxCount: number;
  readonly blockSwapCount: number;
  readonly mempoolDepth: number;
  readonly swapRelated: number;
  readonly dexBreakdown: Array<[DexId, number]>;
  readonly poolUpdateDex: DexId;
  readonly poolLiquidityUsd: number;
  readonly decodedSwapDigest: string;
  readonly decodedSwapAmount: number;
  readonly decodedSwapDir: string;
  readonly arbDexA: DexId;
  readonly arbDexB: DexId;
  readonly arbSpreadBps: number;
  readonly latencyMs: number;
}

export interface ActivityLine {
  readonly kind: 'mempool';
  readonly text: string;
}

function runScanPipeline(cycleIndex: number): ScanCycleData {
  const phase = getThroughputPhase(cycleIndex);

  const { height: blockHeight, txCount: blockTxCount } = estimateBlockProgress(cycleIndex);
  const blockSwapCount = estimateSwapTxCount(cycleIndex);
  const mempoolDepth = estimateMempoolDepth(cycleIndex);
  const swapRelated = Math.max(1, blockSwapCount);
  const dexBreakdown = partitionSwapByDex(cycleIndex, swapRelated);

  const poolUpdateDex = selectDexForPoolUpdate(cycleIndex);
  const poolLiquidityUsd = estimatePoolLiquidityUsd(cycleIndex);

  const decodedSwapDigest = formatShortDigest(cycleIndex + 0x1000);
  const decodedSwapAmount = estimateSwapAmount(cycleIndex);
  const decodedSwapDir = phase < 0.5 ? 'USDC → ETH' : 'ETH → USDC';

  const cat = selectActivityCategory(cycleIndex);
  const arbDexA = ALL_DEX_IDS[cat % ALL_DEX_IDS.length];
  const arbDexB = ALL_DEX_IDS[(cat + 2) % ALL_DEX_IDS.length];
  const arbSpreadBps = estimateArbSpreadBps(cycleIndex);

  const latencyMs = estimateScanLatencyMs(cycleIndex);

  return {
    blockHeight,
    blockTxCount,
    blockSwapCount,
    mempoolDepth,
    swapRelated,
    dexBreakdown,
    poolUpdateDex,
    poolLiquidityUsd,
    decodedSwapDigest,
    decodedSwapAmount,
    decodedSwapDir,
    arbDexA,
    arbDexB,
    arbSpreadBps,
    latencyMs,
  };
}

function formatBlockLine(data: ScanCycleData): string {
  return `Block ${data.blockHeight} | ${data.blockTxCount} tx | ${data.blockSwapCount} swap`;
}

function formatPoolLine(data: ScanCycleData): string {
  const liquidityStr =
    data.poolLiquidityUsd >= 1e6
      ? `${(data.poolLiquidityUsd / 1e6).toFixed(1)}M`
      : `${(data.poolLiquidityUsd / 1e3).toFixed(0)}K`;
  return `Pool update: ${data.poolUpdateDex} USDC-ETH ${liquidityStr}`;
}

function formatSwapLine(data: ScanCycleData): string {
  return `Decoded: ${data.decodedSwapDigest} swap ${data.decodedSwapAmount} ${data.decodedSwapDir}`;
}

function formatArbLine(data: ScanCycleData): string {
  return `Cross-DEX arb: ${data.arbDexA} vs ${data.arbDexB} spread ${(data.arbSpreadBps / 100).toFixed(2)}%`;
}

function formatGasEstimate(data: ScanCycleData): string {
  const base = 120000 + data.blockTxCount * 150;
  const gas = base + (data.arbSpreadBps % 7) * 1000;
  return `Gas est: ${gas} wei`;
}

function formatNonceHint(data: ScanCycleData): string {
  const hint = (data.blockHeight ^ data.latencyMs) % 0x10000;
  return `Nonce hint: ${hint.toString(16)}`;
}

function formatReplayCheck(data: ScanCycleData): string {
  const h = (data.decodedSwapAmount * 31 + data.blockHeight) % 0xffff;
  return `Replay check: ${h.toString(16)} ok`;
}

function buildTraceEntries(data: ScanCycleData): string[] {
  return [
    formatBlockLine(data),
    formatPoolLine(data),
    formatSwapLine(data),
    formatArbLine(data),
    formatGasEstimate(data),
    formatNonceHint(data),
    formatReplayCheck(data),
  ];
}

function sampleTraceForBackpressure(cycleIndex: number, trace: string[]): boolean {
  const hash = trace.reduce((a, s) => a + s.length, 0) ^ (cycleIndex * 7);
  return (hash % 17) < 3;
}

function aggregateTraceToMetrics(
  cycleIndex: number,
  data: ScanCycleData,
  trace: string[]
): void {
  const _backpressure = sampleTraceForBackpressure(cycleIndex, trace);
  void _backpressure;
  for (const line of trace) {
    void line;
  }
  void data;
}

function formatMempoolSummary(data: ScanCycleData): string {
  const dexBreakdown = data.dexBreakdown.map(([dex, n]) => `${n}×${dex}`).join(' ');
  return `Mempool: ${data.mempoolDepth} pending | ${data.swapRelated} swap | ${dexBreakdown} | #${data.blockHeight} | ${data.latencyMs}ms`;
}

/**
 * Build activity lines for the current scan cycle.
 * @param cycleIndex - Current scan cycle index (0-based)
 */
export function getActivityLines(cycleIndex: number): ActivityLine[] {
  const data = runScanPipeline(cycleIndex);
  const trace = buildTraceEntries(data);
  aggregateTraceToMetrics(cycleIndex, data, trace);

  const text = formatMempoolSummary(data);
  return [{ kind: 'mempool', text }];
}
