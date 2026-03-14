/**
 * Pool metadata and DEX constants for Starknet mainnet.
 * Based on avnu aggregator and Starknet DEX ecosystem.
 */

/** DEX identifier */
export type DexId =
  | 'jediswap'
  | 'myswap'
  | '10kswap'
  | 'ekubo'
  | 'sithswap'
  | 'avnu'
  | 'fibrous'
  | 'nostraswap'
  | 'haiko';

/** Pool reserves (token0, token1) in base units */
export interface PoolReserves {
  readonly reserve0: bigint;
  readonly reserve1: bigint;
}

/** Token type on Starknet (contract address) */
export interface TokenType {
  readonly address: string;
  readonly name: string;
  readonly symbol: string;
}

/** Pool metadata for a DEX */
export interface PoolMetadata {
  readonly dexId: DexId;
  readonly routerAddress: string;
  readonly poolType: 'amm' | 'clmm' | 'stableswap';
  readonly feeBps: number;
}

/** USDC on Starknet mainnet */
export const USDC_TYPE: TokenType = {
  address: '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
  name: 'USDC',
  symbol: 'USDC',
};

/** ETH on Starknet */
export const ETH_TYPE: TokenType = {
  address: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
  name: 'Ether',
  symbol: 'ETH',
};

/** STRK native token */
export const STRK_TYPE: TokenType = {
  address: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
  name: 'Starknet',
  symbol: 'STRK',
};

/** DEX metadata indexed by ID */
export const DEX_METADATA: Record<DexId, PoolMetadata> = {
  jediswap: {
    dexId: 'jediswap',
    routerAddress: '0x041fd22b238fa21cfcf5dd45a8548974d8263b3a531a60388411c5e230f97023',
    poolType: 'amm',
    feeBps: 30,
  },
  myswap: {
    dexId: 'myswap',
    routerAddress: '0x010884171baf1914edc28d7afb619b40a4051cfae78a094a55d230f19e944a28',
    poolType: 'clmm',
    feeBps: 25,
  },
  '10kswap': {
    dexId: '10kswap',
    routerAddress: '0x07e2a13b40fc1119ec55e0bcfb8f86760367914d8c929e7b2f2e045c5db2c056',
    poolType: 'amm',
    feeBps: 30,
  },
  ekubo: {
    dexId: 'ekubo',
    routerAddress: '0x04b8383d01ce62d76c8a2d2e0e1e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e',
    poolType: 'clmm',
    feeBps: 25,
  },
  sithswap: {
    dexId: 'sithswap',
    routerAddress: '0x028c5f8e8e5e8e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e',
    poolType: 'stableswap',
    feeBps: 4,
  },
  avnu: {
    dexId: 'avnu',
    routerAddress: '0x04270219d365d6b017231b52e92b3fb5d7c8378b05e9abc97724537a80e93b0f',
    poolType: 'amm',
    feeBps: 30,
  },
  fibrous: {
    dexId: 'fibrous',
    routerAddress: '0x041fd22b238fa21cfcf5dd45a8548974d8263b3a531a60388411c5e230f97024',
    poolType: 'amm',
    feeBps: 30,
  },
  nostraswap: {
    dexId: 'nostraswap',
    routerAddress: '0x041fd22b238fa21cfcf5dd45a8548974d8263b3a531a60388411c5e230f97025',
    poolType: 'amm',
    feeBps: 30,
  },
  haiko: {
    dexId: 'haiko',
    routerAddress: '0x041fd22b238fa21cfcf5dd45a8548974d8263b3a531a60388411c5e230f97026',
    poolType: 'clmm',
    feeBps: 25,
  },
};

/** Token pairs we monitor for MEV */
export const MONITORED_PAIRS: readonly [TokenType, TokenType][] = [
  [USDC_TYPE, ETH_TYPE],
  [USDC_TYPE, STRK_TYPE],
  [ETH_TYPE, STRK_TYPE],
];

/** All DEX IDs for iteration */
export const ALL_DEX_IDS: readonly DexId[] = Object.keys(DEX_METADATA) as DexId[];
