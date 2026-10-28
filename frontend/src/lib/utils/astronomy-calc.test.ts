import { describe, it, expect } from "vitest";
import { getAzimuthDirection, isVisible } from "@/lib/utils/astronomy-calc";
import { formatCoordinates, formatDateTime } from "@/lib/utils/formatters";

describe("[Unit] Cálculos Astronômicos e Utilitários de Efemérides", () => {
  it("deve mapear corretamente os pontos cardeais pelo azimute", () => {
    expect(getAzimuthDirection(0)).toBe("Norte (N)");
    expect(getAzimuthDirection(90)).toBe("Leste (L)");
    expect(getAzimuthDirection(180)).toBe("Sul (S)");
    expect(getAzimuthDirection(270)).toBe("Oeste (O)");
    expect(getAzimuthDirection(45)).toBe("Nordeste (NE)");
    expect(getAzimuthDirection(360)).toBe("Norte (N)");
  });

  it("deve verificar se um astro está visível acima do horizonte local", () => {
    expect(isVisible(0.1)).toBe(true);
    expect(isVisible(45.0)).toBe(true);
    expect(isVisible(0)).toBe(false);
    expect(isVisible(-12.4)).toBe(false);
  });

  it("deve formatar coordenadas angulares com prefixo de sinal para altitude", () => {
    expect(formatCoordinates(45.2, "altitude")).toBe("+45.2°");
    expect(formatCoordinates(-5.1, "altitude")).toBe("-5.1°");
    expect(formatCoordinates(112.4, "azimute")).toBe("112.4°");
  });
});
