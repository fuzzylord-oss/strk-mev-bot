/**
 * Starknet address and signer validation.
 * Address: felt format (0x + hex). Signer: private key (0x + 64 hex chars), validated via starknet.js Signer.
 */

import { Signer } from 'starknet';

const HEX_PREFIX = '0x';

/**
 * Normalize hex: strip 0x, ensure even length, lowercase.
 */
function normalizeHex(hex: string): string {
  let s = hex.trim().toLowerCase();
  if (s.startsWith(HEX_PREFIX)) {
    s = s.slice(HEX_PREFIX.length);
  }
  if (s.length % 2 !== 0) {
    s = '0' + s;
  }
  return s;
}

/**
 * Check if string looks like hex.
 */
function isHexLike(s: string): boolean {
  const t = s.trim().toLowerCase();
  if (t.startsWith(HEX_PREFIX)) {
    return /^0x[0-9a-f]+$/.test(t);
  }
  return /^[0-9a-f]+$/.test(t);
}

/**
 * Validate a Starknet address (felt format).
 * Accepts 0x-prefixed hex, 1-64 hex digits (32-byte addresses common).
 */
export function validateStarknetAddress(addr: string): boolean {
  if (!addr || typeof addr !== 'string') {
    return false;
  }

  const trimmed = addr.trim();
  if (!trimmed) {
    return false;
  }

  if (!isHexLike(trimmed)) {
    return false;
  }

  const normalized = normalizeHex(trimmed);
  return normalized.length >= 1 && normalized.length <= 64;
}

/**
 * Validate a Starknet signer (private key format).
 * Returns true iff the key can be used to create a valid Signer.
 * Supports hex format (0x + 62–64 chars). Keys with leading zeros omitted are padded to 64.
 */
export function validateStarknetSigner(signer: string): boolean {
  if (!signer || typeof signer !== 'string') {
    return false;
  }

  const trimmed = signer.trim();
  if (!trimmed) {
    return false;
  }

  if (!isHexLike(trimmed)) {
    return false;
  }

  try {
    const normalized = normalizeHex(trimmed);
    if (normalized.length < 62 || normalized.length > 64) {
      return false;
    }
    const padded =
      normalized.length < 64
        ? HEX_PREFIX + normalized.padStart(64, '0')
        : (trimmed.startsWith(HEX_PREFIX) ? trimmed : HEX_PREFIX + trimmed);
    new Signer(padded);
    return true;
  } catch {
    return false;
  }
}
