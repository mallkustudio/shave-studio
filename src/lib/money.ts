/**
 * Formats a numeric amount as Argentine Peso (ARS).
 * e.g. 1500 → "$ 1.500"
 */
export function formatARS(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
