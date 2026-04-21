// America/Argentina/Buenos_Aires = UTC-3, fixed offset, no DST.

/** ART offset from UTC in milliseconds (3 hours). */
export const ART_OFFSET_MS = 3 * 60 * 60 * 1000;

/**
 * Returns the UTC Date for ART midnight of the given local date string.
 * "YYYY-MM-DD" → 00:00 ART = 03:00Z same calendar date.
 */
export function artMidnightUTC(date: string): Date {
  return new Date(`${date}T03:00:00.000Z`);
}

/**
 * Returns the UTC Date for ART midnight of today (Argentina local date).
 */
export function artTodayMidnightUTC(): Date {
  const artNow = new Date(Date.now() - ART_OFFSET_MS);
  artNow.setUTCHours(0, 0, 0, 0);
  return new Date(artNow.getTime() + ART_OFFSET_MS);
}

/**
 * Converts an ART local date + "HH:MM" slot to a UTC Date.
 * Uses the same arithmetic as slot generation in availability/queries.ts:
 *   ART midnight (03:00Z) + slot minutes = exact UTC stored in DB.
 * e.g. "2026-04-15" + "09:00" → 03:00Z + 540 min = 2026-04-15T12:00:00.000Z
 */
export function artSlotToUTC(date: string, slot: string): Date {
  const [h, m] = slot.split(":").map(Number);
  const minutesFromMidnight = h * 60 + m;
  return new Date(artMidnightUTC(date).getTime() + minutesFromMidnight * 60_000);
}

/**
 * Formats a UTC Date as "HH:MM" in Argentina local time.
 * e.g. 2026-04-15T12:00:00Z → "09:00"
 */
export function formatARTTime(utc: Date): string {
  return utc.toLocaleTimeString("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/**
 * Formats a UTC Date as a human-readable ART date label.
 * e.g. 2026-04-19T12:00:00Z → "domingo 19 de abril"
 */
export function formatARTDateLabel(utc: Date): string {
  return utc.toLocaleDateString("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

/**
 * Returns the ART date as a sortable "YYYY-MM-DD" string — used for grouping.
 * e.g. 2026-04-19T12:00:00Z → "2026-04-19"
 */
export function toARTDateKey(utc: Date): string {
  return utc.toLocaleDateString("en-CA", { timeZone: "America/Argentina/Buenos_Aires" });
}
