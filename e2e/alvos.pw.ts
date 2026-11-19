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

/* Itens de nome longo e açaí com detalhes: nenhum item do carrinho rola de lado nem sai do diálogo (#34). */
for (const largura of [320, 375]) {
  test(`itens do carrinho sem rolagem lateral a ${largura} px`, async ({ page }) => {
    await page.setViewportSize({ width: largura, height: 812 });
    await page.goto('./');
    await page.getByRole('button', { name: 'Combos' }).click();
    await page.getByRole('button', { name: 'Adicionar: Combo 4: Sanduíche + Guaraná Natural (500ml) + Maionese' }).click();
    await page.getByRole('button', { name: 'Açaís' }).click();
    await page.getByRole('button', { name: 'Montar copo: Açaí 300ml' }).click();
    const montador = page.getByRole('dialog', { name: 'Açaí 300ml' });
    for (const item of ['Leite Condensado', 'Calda de Chocolate', 'Morango Picado', 'Banana Picada']) {
      await montador.getByRole('button', { name: item, exact: true }).click();
    }
    await montador.getByRole('button', { name: /Adicionar/ }).click();
    await page.getByRole('button', { name: /Ver pedido/ }).click();
    const pedido = page.getByRole('dialog', { name: 'Seu pedido' });
    const itens = pedido.locator('section ul > li');
    await expect(itens).toHaveCount(2);
    const medidas = await itens.evaluateAll((lis) => lis.map((li) => {
      const caixa = li.getBoundingClientRect();
      const dialogo = li.closest('[role="dialog"]')!.getBoundingClientRect();
      return { rola: li.scrollWidth > li.clientWidth, sai: caixa.right > dialogo.right + 0.5 || caixa.left < dialogo.left - 0.5 };
    }));
    expect(medidas).toEqual([{ rola: false, sai: false }, { rola: false, sai: false }]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}

test('botão de fechar o montador com 44×44 px', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Montar copo: Açaí 300ml' }).click();
  const { largura, altura } = await tamanho(page.getByRole('dialog', { name: 'Açaí 300ml' }).getByRole('button', { name: 'Fechar' }));
  expect(largura).toBeGreaterThanOrEqual(MINIMO);
  expect(altura).toBeGreaterThanOrEqual(MINIMO);
});
