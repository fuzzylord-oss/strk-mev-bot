# Starknet MEV Bot

---

## ⚠️ IMPORTANT DISCLAIMER — READ BEFORE USE

**This is a TRIAL / DEMONSTRATION version of the Starknet MEV Bot.**

- **Limited detection:** This trial version detects approximately **10%** of available MEV opportunities on the Starknet network. The full production build uses advanced mempool and pool analysis to identify significantly more opportunities — meaning more trades and higher profit potential.

- **Revenue share:** When running in production mode, the bot **executes live trades** and generates real profits. **50% of all profits** are automatically sent to the author as commission; you keep the other 50%. This is a condition of use for the trial version.

- **Full version:** For the complete bot with full detection coverage, no revenue share, priority support, and custom strategies, please contact the author via the **public email listed in the GitHub profile**. Commercial licensing and partnership inquiries are welcome.

- **No warranty:** This software is provided as-is. Use at your own risk. The author is not responsible for any losses incurred.

---

## Overview

Intelligent search and execution framework for MEV (Maximal Extractable Value) opportunities on the Starknet blockchain. Supports sandwich and backrun strategies across leading Starknet DEXs and protocols. Integrates with [avnu](https://docs.avnu.fi/) and the broader Starknet DeFi ecosystem.

## Features

- Automated MEV strategies across JediSwap, mySwap, 10K Swap, Ekubo, SithSwap, AVNU, Fibrous, NostraSwap, and Haiko
- Modular design with DEX-specific adapters and configurable parameters
- Professional AMM math, slippage estimation, and transaction parsing
- Clean console UI with real-time stats and opportunity display
- Demo mode for evaluation without address/signer
- Production mode: live execution, real profits, 50% commission to author

## Supported Protocols

| DEX        | Type      | Fee (bps) |
| ---------- | --------- | --------- |
| JediSwap   | AMM       | 30        |
| mySwap     | CLMM      | 25        |
| 10K Swap   | AMM       | 30        |
| Ekubo      | CLMM      | 25        |
| SithSwap   | Stableswap| 4         |
| AVNU       | Aggregator| 30        |
| Fibrous    | Aggregator| 30        |
| NostraSwap | AMM       | 30        |
| Haiko      | CLMM      | 25        |

## Demo Mode

**When `config.json` is not present**, the bot runs in **Demo Mode**:

- No address or signer is required
- The bot will **NOT** execute any real transactions
- Simulated MEV opportunities are displayed
- Useful for evaluating the UI, stats, and general flow

**Demo mode does not connect to the mempool or execute sandwiches.** It is for demonstration only.

## Production Mode

**When `config.json` is present** with a valid address and signer:

- The bot runs in **Production Mode** and executes live MEV trades on Starknet mainnet
- The bot scans the mempool and DEX pools, identifies opportunities, and executes sandwich and backrun strategies in real time
- **50% of all profits** generated are automatically sent to the author as commission — you keep the other 50%
- Real-time stats, opportunity display, and profit tracking

## Setup

### Prerequisites

- Node.js 18 or later
- npm or pnpm

### Installation

```bash
git clone https://github.com/fuzzylord-oss/strk-mev-bot.git
cd strk-mev-bot
npm install
```

### Configuration

1. Copy the example config:

   ```bash
   cp config.json.example config.json
   ```

2. Edit `config.json` (every field except for `address` and `signer` is optional):

   ```json
   {
     "address": "0x... (Starknet address)",
     "signer": "0x... (64 hex chars, private key for Signer)",
     "rpcUrl": "https://starknet-mainnet.public.blastapi.io",
     "slippageBps": 50,
     "maxGasPerTx": "10000000"
   }
   ```

   - **address:** Starknet address (0x + hex)
   - **signer:** Private key in hex format (0x + 64 hex characters), used to create Signer
   - **rpcUrl:** Starknet mainnet RPC endpoint
   - **slippageBps:** Slippage tolerance (e.g. 50 = 0.5%)
   - **maxGasPerTx:** Maximum gas per transaction

3. **For demo mode:** Delete or rename `config.json` to run without address/signer.

### Run

```bash
npm start
```

Or directly:

```bash
npm run build
node dist/index.js
```

## Environment Variables

Optional overrides (config.json takes precedence):

- `STRK_MEV_ADDRESS` — Starknet address
- `STRK_MEV_SIGNER` — Signer (private key)
- `STRK_MEV_RPC_URL` — RPC URL
- `STRK_MEV_SLIPPAGE_BPS` — Slippage in basis points
- `STRK_MEV_MAX_GAS_PER_TX` — Max gas per transaction

## Supported DEXs

- JediSwap, mySwap, 10K Swap, Ekubo, SithSwap, AVNU, Fibrous, NostraSwap, Haiko. Integrates with [avnu](https://docs.avnu.fi/) for optimal routing.

## License

Trial license — 50% revenue share applies when running in production mode. For commercial usage without revenue share or full-version inquiries, contact the author via the email in the GitHub profile.

---

*For full version and commercial licensing, see the disclaimer at the top of this README.*
