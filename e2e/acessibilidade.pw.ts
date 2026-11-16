/*
 * Acessibilidade no navegador, sobre o build de produção: axe (WCAG A e AA) em cada estado da tela,
 * no celular e no desktop, e o percurso só com teclado (Tab, Enter, Esc e foco visível).
 * O app tem um tema só, de fundo escuro, sem prefers-color-scheme: não há "modo claro e escuro" a comparar.
 */
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

/* O WhatsApp é simulado: o teste não manda mensagem a ninguém */
test.beforeEach(async ({ context }) => {
  await context.route('https://wa.me/**', (r) => r.fulfill({ contentType: 'text/html', body: '<title>WhatsApp</title>' }));
  await context.route('https://api.whatsapp.com/**', (r) => r.fulfill({ contentType: 'text/html', body: '<title>WhatsApp</title>' }));
});

/* Roda o axe e devolve só a regra e o seletor: o HTML do link da loja não vai para o log. */
async function violacoes(page: Page, escopo?: string) {
  let axe = new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']);
  if (escopo) axe = axe.include(escopo);
  const { violations } = await axe.analyze();
  return violations.map((v) => ({ regra: v.id, alvos: v.nodes.map((n) => n.target.join(' ')) }));
}

const TELAS = [
  { nome: 'celular', viewport: { width: 375, height: 812 } },
  { nome: 'desktop', viewport: { width: 1280, height: 800 } },
];

for (const tela of TELAS) {
  test.describe(`axe no ${tela.nome}`, () => {
    test.use({ viewport: tela.viewport, reducedMotion: 'reduce' });

    test('cardápio sem violações', async ({ page }) => {
      await page.goto('./');
      await expect(page.getByRole('heading', { name: /GARAGEM/ })).toBeVisible();
      expect(await violacoes(page)).toEqual([]);
    });

    test('montador de açaí sem violações', async ({ page }) => {
      await page.goto('./');
      await page.getByRole('button', { name: 'Montar copo: Açaí 300ml' }).click();
      const dialogo = page.getByRole('dialog', { name: 'Açaí 300ml' });
      await dialogo.getByRole('button', { name: 'Leite em Pó', exact: true }).click();
      expect(await violacoes(page, '[role="dialog"]')).toEqual([]);
    });

    test('checkout com erros de validação sem violações', async ({ page }) => {
      await page.goto('./');
      await page.getByRole('button', { name: 'Adicionar: Esfirra Carne' }).click();
      await page.getByRole('button', { name: /Ver pedido/ }).click();
      const pedido = page.getByRole('dialog', { name: 'Seu pedido' });
      await pedido.getByRole('button', { name: /Enviar no WhatsApp/ }).click();
      await expect(pedido.getByLabel(/Seu nome/)).toHaveAttribute('aria-invalid', 'true');
      expect(await violacoes(page, '[role="dialog"]')).toEqual([]);
    });

    test('tela de sucesso sem violações', async ({ page }) => {
      await page.goto('./');
      await page.getByRole('button', { name: 'Adicionar: Esfirra Carne' }).click();
      await page.getByRole('button', { name: /Ver pedido/ }).click();
      const pedido = page.getByRole('dialog', { name: 'Seu pedido' });
      await pedido.getByLabel(/Seu nome/).fill('Pessoa Teste');
      await pedido.getByLabel(/WhatsApp/).fill('(11) 90000-0000');
      await pedido.getByRole('button', { name: 'Retirada no balcão' }).click();
      await Promise.all([
        page.context().waitForEvent('page'),
        pedido.getByRole('button', { name: /Enviar no WhatsApp/ }).click(),
      ]);
      await expect(page.getByRole('dialog', { name: 'Pedido pronto para envio!' })).toBeVisible();
      expect(await violacoes(page, '[role="dialog"]')).toEqual([]);
    });
  });
}

/* Aperta Tab até o foco chegar ao elemento com o nome pedido. */
async function tabAte(page: Page, nome: string, limite = 60) {
  for (let i = 0; i < limite; i += 1) {
    await page.keyboard.press('Tab');
    const atual = await page.evaluate(() => document.activeElement?.getAttribute('aria-label') ?? document.activeElement?.textContent?.trim() ?? '');
    if (atual === nome) return;
  }
  throw new Error(`O foco não chegou a "${nome}" com ${limite} Tabs`);
}

test('só com teclado: abre o montador, Esc fecha e o foco volta, com contorno visível', async ({ page }) => {
  await page.goto('./');
  await tabAte(page, 'Montar copo: Açaí 300ml');
  const botao = page.getByRole('button', { name: 'Montar copo: Açaí 300ml' });
  await expect(botao).toBeFocused();
  // Contorno definido pelo app (index.css), não o padrão do navegador.
  // O botão tem transition-all: espera a transição do contorno terminar.
  // O build converte #ffc72c e pode arredondar um canal em 1.
  await expect.poll(() => botao.evaluate((el) => {
    const s = getComputedStyle(el);
    return `${s.outlineStyle} ${s.outlineWidth} ${s.outlineColor}`;
  })).toMatch(/^solid 3px rgb\(255, (198|199|200), (43|44|45)\)$/);

  await page.keyboard.press('Enter');
  const dialogo = page.getByRole('dialog', { name: 'Açaí 300ml' });
  await expect(dialogo).toBeVisible();
  await expect(dialogo.getByRole('button', { name: 'Fechar' })).toBeFocused();
  // O Tab fica preso no montador: dar a volta completa (17 controles) não sai dele.
  for (let i = 0; i < 20; i += 1) {
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => Boolean(document.activeElement?.closest('[role="dialog"]')))).toBe(true);
  }

  await page.keyboard.press('Escape');
  await expect(dialogo).toBeHidden();
  await expect(botao).toBeFocused();
});

test('só com teclado: monta o pedido e chega ao formulário', async ({ page }) => {
  await page.goto('./');
  await tabAte(page, 'Adicionar: Esfirra Carne');
  await page.keyboard.press('Enter');
  await tabAte(page, 'Ver pedido');
  await page.keyboard.press('Enter');
  const pedido = page.getByRole('dialog', { name: 'Seu pedido' });
  await expect(pedido).toBeVisible();
  await expect(pedido.getByRole('button', { name: 'Diminuir Esfirra Carne' })).toBeFocused();
  // O Tab fica preso no diálogo: dar a volta completa não sai dele.
  for (let i = 0; i < 25; i += 1) {
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => Boolean(document.activeElement?.closest('[role="dialog"]')))).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(pedido).toBeHidden();
});
