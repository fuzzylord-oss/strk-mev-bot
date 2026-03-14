/**
 * Sampling utilities for probabilistic parameters.
 * Weighted choice, distribution sampling, address generation.
 */

export function uniform(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function uniformInt(min: number, max: number): number {
  return Math.floor(uniform(min, max + 0.999999));
}

export function weightedChoice<T>(items: readonly T[], weights: readonly number[]): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

export function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomHex(bytes: number): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return '0x' + Array.from(arr)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Random Starknet address (0x + 64 hex chars). Used for tx and pool ID generation. */
export function randomStarknetAddress(): string {
  return randomHex(32);
}
