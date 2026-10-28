/**
 * Utilitários astronômicos locais
 */

export function getAzimuthDirection(deg: number): string {
  const normalized = ((deg % 360) + 360) % 360;
  if (normalized >= 337.5 || normalized < 22.5) return "Norte (N)";
  if (normalized >= 22.5 && normalized < 67.5) return "Nordeste (NE)";
  if (normalized >= 67.5 && normalized < 112.5) return "Leste (L)";
  if (normalized >= 112.5 && normalized < 157.5) return "Sudeste (SE)";
  if (normalized >= 157.5 && normalized < 202.5) return "Sul (S)";
  if (normalized >= 202.5 && normalized < 247.5) return "Sudoeste (SO)";
  if (normalized >= 247.5 && normalized < 292.5) return "Oeste (O)";
  return "Noroeste (NO)";
}

export function isVisible(altitudeDegrees: number): boolean {
  return altitudeDegrees > 0;
}
