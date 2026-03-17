/**
 * STRK balance check for production mode.
 * Fetches balance from STRK ERC20 contract and validates against thresholds.
 */

import { RpcProvider } from 'starknet';

/** STRK token contract on Starknet mainnet */
const STRK_ADDRESS = '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d';

/** STRK has 18 decimals */
const STRK_DECIMALS = 18;
const STRK_ONE = 10n ** BigInt(STRK_DECIMALS);

/** Balance thresholds in STRK (human-readable) */
export const BALANCE_MIN = 25_000;
export const BALANCE_RECOMMENDED = 100_000;
export const BALANCE_IDEAL = 250_000;

export interface BalanceCheckResult {
  balanceStrk: number;
  belowMin: boolean;
  belowRecommended: boolean;
  belowIdeal: boolean;
}

/**
 * Fetch STRK balance for the given address via RPC.
 * Returns balance in human-readable STRK (not raw units).
 */
export async function fetchStrkBalance(
  rpcUrl: string,
  accountAddress: string
): Promise<number> {
  const provider = new RpcProvider({ nodeUrl: rpcUrl });

  const result = await provider.callContract({
    contractAddress: STRK_ADDRESS,
    entrypoint: 'balanceOf',
    calldata: [accountAddress],
  });

  // ERC20 balanceOf returns u256: (low, high) or single felt
  let raw: bigint;
  if (result.length >= 2) {
    const low = BigInt(result[0]);
    const high = BigInt(result[1]);
    raw = low + high * (2n ** 128n);
  } else {
    raw = BigInt(result[0] ?? '0');
  }

  return Number(raw) / Number(STRK_ONE);
}

/**
 * Check balance against thresholds. Returns structured result for error/warning logic.
 */
export function checkBalanceThresholds(balanceStrk: number): BalanceCheckResult {
  return {
    balanceStrk,
    belowMin: balanceStrk < BALANCE_MIN,
    belowRecommended: balanceStrk < BALANCE_RECOMMENDED,
    belowIdeal: balanceStrk < BALANCE_IDEAL,
  };
}
