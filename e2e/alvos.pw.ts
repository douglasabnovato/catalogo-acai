/*
 * Alvos de toque no celular (375×812): os botões do carrinho e o fechar do montador
 * têm pelo menos 44×44 px (WCAG 2.2, 2.5.5). Proposto no roteiro do vídeo 11 (#31).
 */
import { expect, test, type Locator } from '@playwright/test';

test.use({ viewport: { width: 375, height: 812 }, reducedMotion: 'reduce' });

const MINIMO = 44;

/* Mede o botão na tela, como o dedo o encontra. */
async function tamanho(alvo: Locator) {
  const caixa = await alvo.boundingBox();
  if (!caixa) throw new Error('O botão não está na tela');
  return { largura: Math.round(caixa.width), altura: Math.round(caixa.height) };
}

test('botões de quantidade e remover do carrinho com 44×44 px', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Adicionar: Esfirra Carne' }).click();
  await page.getByRole('button', { name: /Ver pedido/ }).click();
  const pedido = page.getByRole('dialog', { name: 'Seu pedido' });
  for (const nome of ['Diminuir Esfirra Carne', 'Aumentar Esfirra Carne', 'Remover Esfirra Carne']) {
    const { largura, altura } = await tamanho(pedido.getByRole('button', { name: nome }));
    expect(largura, nome).toBeGreaterThanOrEqual(MINIMO);
    expect(altura, nome).toBeGreaterThanOrEqual(MINIMO);
  }
  // Os botões cabem no diálogo, sem rolagem horizontal.
  const rolaDeLado = await pedido.evaluate((el) => el.scrollWidth > el.clientWidth);
  expect(rolaDeLado).toBe(false);
});

test('botão de fechar o montador com 44×44 px', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Montar copo: Açaí 300ml' }).click();
  const { largura, altura } = await tamanho(page.getByRole('dialog', { name: 'Açaí 300ml' }).getByRole('button', { name: 'Fechar' }));
  expect(largura).toBeGreaterThanOrEqual(MINIMO);
  expect(altura).toBeGreaterThanOrEqual(MINIMO);
});
