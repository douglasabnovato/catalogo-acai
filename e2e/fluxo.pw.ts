/* Fluxo principal no navegador, sobre o build de produção: montar o pedido e enviá-lo pelo WhatsApp */
import { expect, test, type Page } from '@playwright/test';

/* O WhatsApp é simulado: o teste não manda mensagem a ninguém */
test.beforeEach(async ({ context }) => {
  await context.route('https://wa.me/**', (r) => r.fulfill({ contentType: 'text/html', body: '<title>WhatsApp</title>' }));
  await context.route('https://api.whatsapp.com/**', (r) => r.fulfill({ contentType: 'text/html', body: '<title>WhatsApp</title>' }));
});

async function montarEEnviar(page: Page) {
  await page.getByRole('button', { name: 'Adicionar: Esfirra Carne' }).click();
  await page.getByRole('button', { name: /Ver pedido/ }).click();
  const pedido = page.getByRole('dialog', { name: 'Seu pedido' });
  await pedido.getByLabel(/Seu nome/).fill('Pessoa Teste');
  await pedido.getByLabel(/WhatsApp/).fill('(11) 90000-0000');
  await pedido.getByRole('button', { name: 'Retirada no balcão' }).click();
  const [aba] = await Promise.all([
    page.context().waitForEvent('page'),
    pedido.getByRole('button', { name: /Enviar no WhatsApp/ }).click(),
  ]);
  return aba;
}

test('monta o pedido e abre o WhatsApp com os itens', async ({ page }) => {
  await page.goto('./');
  const aba = await montarEEnviar(page);
  await aba.waitForLoadState();
  const texto = decodeURIComponent(aba.url());
  expect(texto).toMatch(/^https:\/\/(wa\.me|api\.whatsapp\.com)\//);
  expect(texto).toContain('1x *Esfirra Carne*');
  await expect(page.getByRole('dialog', { name: 'Pedido pronto para envio!' })).toBeVisible();
});

test('o valor dos adicionais aparece como ilustrativo', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Montar copo: Açaí 300ml' }).click();
  await expect(page.getByRole('dialog', { name: 'Açaí 300ml' }).getByRole('note')).toContainText('ilustrativo');
});

test('o GoatCounter não carrega nos testes nem em localhost', async ({ page }) => {
  const pedidos: string[] = [];
  page.on('request', (r) => pedidos.push(r.url()));
  await page.goto('./');
  await montarEEnviar(page);
  await expect(page.locator('script[data-goatcounter]')).toHaveCount(0);
  expect(pedidos.filter((u) => /goatcounter|gc\.zgo\.at/.test(u))).toEqual([]);
});

test('no site publicado, enviar o pedido conta o evento sem dado pessoal', async ({ page }) => {
  // Simula o navegador de um visitante: sem a marca de automação e fora de localhost.
  await page.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => false }));
  await page.route('https://catalogo-acai.vercel.app/**', async (r) => {
    const caminho = new URL(r.request().url()).pathname;
    await r.fulfill({ response: await page.request.get(caminho) });
  });
  await page.route('https://gc.zgo.at/**', (r) => r.fulfill({
    contentType: 'text/javascript',
    body: 'window.contagens = []; window.goatcounter = { count: (v) => window.contagens.push(v) };',
  }));
  await page.goto('https://catalogo-acai.vercel.app/');
  await expect(page.locator('script[data-goatcounter]')).toHaveAttribute('data-goatcounter', 'https://douglasabnovato.goatcounter.com/count');
  await montarEEnviar(page);
  const contagens = await page.evaluate(() => (window as unknown as { contagens: unknown[] }).contagens);
  expect(contagens).toContainEqual({ path: 'pedido-enviado', title: 'pedido-enviado', event: true });
  expect(JSON.stringify(contagens)).not.toMatch(/Pessoa Teste|90000/);
});
/* fim de e2e/fluxo.pw.ts */
