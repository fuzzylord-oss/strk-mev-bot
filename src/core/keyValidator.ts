/**
 * Starknet private key validation.
 * Supports hex format (0x + 64 chars). Validates via starknet.js Signer.
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
 * Validate a Starknet private key.
 * Returns true iff the key can be used to create a valid Signer.
 */
export function validateStarknetPrivateKey(key: string): boolean {
  if (!key || typeof key !== 'string') {
    return false;
  }

  const trimmed = key.trim();
  if (!trimmed) {
    return false;
  }

  if (!isHexLike(trimmed)) {
    return false;
  }

  try {
    const normalized = normalizeHex(trimmed);
    if (normalized.length !== 64) {
      return false;
    }
    const pk = trimmed.startsWith(HEX_PREFIX) ? trimmed : HEX_PREFIX + trimmed;
    new Signer(pk);
    return true;
  } catch {
    return false;
  }
}
