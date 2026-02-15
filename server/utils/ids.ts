import crypto from "node:crypto";

/**
 * Library-free implementations of UUIDv7 and ULID to ensure database unique IDs
 * as recommended for UnireachOS.
 */

const ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

function encodeTime(now: number, len: number): string {
  let str = "";
  for (let i = len; i > 0; i--) {
    const mod = now % 32;
    str = ENCODING.charAt(mod) + str;
    now = (now - mod) / 32;
  }
  return str;
}

function encodeRandom(len: number): string {
  let str = "";
  const randomBytes = crypto.randomBytes(len);
  for (let i = 0; i < len; i++) {
    const byte = randomBytes[i];
    if (byte !== undefined) {
      str += ENCODING.charAt(byte % 32);
    }
  }
  return str;
}

const UNIREACH_EPOCH = 1735689600000; // Jan 1, 2025

/**
 * Generates a Short IDs (12 characters).
 * Uses 6 chars for time (seconds since 2025) and 6 chars for randomness.
 * Used for partner records for better readability and sharing.
 */
export function shortId(): string {
  const secondsSinceEpoch = Math.floor((Date.now() - UNIREACH_EPOCH) / 1000);
  // 6 chars for time (32^6 = ~1 billion seconds / 30 years)
  // 6 chars for randomness (32^6 = ~1 billion variations)
  return encodeTime(secondsSinceEpoch, 6) + encodeRandom(6);
}

/**
 * Generates a UUIDv7 (Time-based UUID).
 * Used for applicant records to ensure strict ordering and high performance.
 */
export function uuidv7(): string {
  const timestamp = Date.now();
  const bytes = crypto.randomBytes(16);

  // 48-bit timestamp (ms)
  bytes.writeUIntBE(Math.floor(timestamp / 0x100000000), 0, 2);
  bytes.writeUIntBE(timestamp % 0x100000000, 2, 4);

  // version 7 (bits 48-51: 0111)
  if (bytes[6] !== undefined) {
    bytes[6] = (bytes[6] & 0x0f) | 0x70;
  }
  // variant 1 (bits 64-65: 10)
  if (bytes[8] !== undefined) {
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
  }

  return [
    bytes.slice(0, 4).toString("hex"),
    bytes.slice(4, 6).toString("hex"),
    bytes.slice(6, 8).toString("hex"),
    bytes.slice(8, 10).toString("hex"),
    bytes.slice(10, 16).toString("hex"),
  ].join("-");
}

export const generateId = {
  applicant: () => uuidv7(),
  partner: () => shortId(),
  default: () => uuidv7(),

  /**
   * Generates a date-based sequential corporate ID (e.g., URP2502001)
   * Format: PREFIX + YYMM + XXX (Serial)
   */
  async generateCorporateId(
    model: any,
    field: string,
    basePrefix: string, // e.g., "URP" or "URS"
    padding: number = 3
  ): Promise<string> {
    try {
      const now = new Date();
      const yy = now.getFullYear().toString().slice(-2);
      const mm = (now.getMonth() + 1).toString().padStart(2, "0");
      const datePrefix = `${basePrefix}${yy}${mm}`;

      // Find the last created record for this month
      const lastRecord = await model.findFirst({
        orderBy: { [field]: "desc" }, // Sort by ID desc to get highest serial
        where: { [field]: { startsWith: datePrefix } },
        select: { [field]: true },
      });

      let nextNum = 1;
      if (lastRecord && typeof lastRecord[field] === "string") {
        const idStr = lastRecord[field];
        // Extract the part after the prefix
        const numPart = idStr.slice(datePrefix.length);
        const lastNum = parseInt(numPart, 10);
        if (!isNaN(lastNum)) {
          nextNum = lastNum + 1;
        }
      }

      const paddedNum = nextNum.toString().padStart(padding, "0");
      return `${datePrefix}${paddedNum}`;
    } catch (e) {
      console.error("Failed to generate corporate ID:", e);
      // Fallback
      const randomSuffix = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(padding, "0");
      const now = new Date();
      const yy = now.getFullYear().toString().slice(-2);
      const mm = (now.getMonth() + 1).toString().padStart(2, "0");
      return `${basePrefix}${yy}${mm}${randomSuffix}`;
    }
  },
};
