/*
 * money.ts · dinheiro em centavos inteiros (evita erro de ponto flutuante) e formato pt-BR.
 */
const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

/* Converte reais (17.9) em centavos (1790), arredondando corretamente. */
export function toCents(reais: number): number {
  return Math.round(reais * 100);
}

/* Formata centavos como "R$ 17,90". */
export function formatBRL(cents: number): string {
  return brl.format(cents / 100);
}
/* fim de money.ts */
