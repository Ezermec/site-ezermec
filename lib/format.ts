/**
 * Arredonda a contagem de itens do catálogo para baixo, para exibir como
 * "+N" no hero sem prometer um número exato:
 *  - a partir de 100: arredonda para a centena (254 -> 200)
 *  - de 50 a 99: arredonda para a dezena de 50 (54 -> 50)
 *  - abaixo de 50: arredonda para a dezena mais próxima (14 -> 10)
 */
export function roundedItemCountLabel(count: number): string {
  if (count <= 0) return '0';
  let step: number;
  if (count >= 100) step = 100;
  else if (count >= 50) step = 50;
  else step = 10;
  const rounded = Math.floor(count / step) * step;
  return '+' + (rounded || count);
}
