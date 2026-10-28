/**
 * Calcula a porcentagem fotométrica aproximada de iluminação do disco lunar
 * com base no ângulo de fase heliocêntrico (0° a 360°).
 *
 * Fórmula clássica: 50% * (1 - cos(fase em radianos))
 * - Fase Nova (0°): 0% iluminada
 * - Quarto Crescente (90°): 50% iluminada
 * - Cheia (180°): 100% iluminada
 * - Quarto Minguante (270°): 50% iluminada
 *
 * @param faseGraus Ângulo de fase em graus retornado pelo backend astronômico.
 * @returns Número inteiro entre 0 e 100 representando a porcentagem iluminada.
 */
export function calcularIluminacaoLunar(faseGraus: number | undefined): number {
  if (faseGraus === undefined || isNaN(faseGraus)) {
    return 50; // Fallback seguro
  }
  const radianos = (faseGraus * Math.PI) / 180;
  return Math.round(50 * (1 - Math.cos(radianos)));
}
