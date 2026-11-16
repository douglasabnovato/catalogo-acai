/*
 * Falhas tratadas no navegador, sobre o build de produção: formulário com erro,
 * carrinho que fica vazio e pop-up do WhatsApp bloqueado.
 */
import { expect, test, type Page } from '@playwright/test';

test.beforeEach(async ({ context }) => {
  await context.route('https://wa.me/**', (r) => r.fulfill({ contentType: 'text/html', body: '<title>WhatsApp</title>' }));
  await context.route('https://api.whatsapp.com/**', (r) => r.fulfill({ contentType: 'text/html', body: '<title>WhatsApp</title>' }));
});

async function abrirPedido(page: Page) {
  await page.goto('./');
  await page.getByRole('button', { name: 'Adicionar: Esfirra Carne' }).click();
  await page.getByRole('button', { name: /Ver pedido/ }).click();
  return page.getByRole('dialog', { name: 'Seu pedido' });
}

test('formulário vazio: mostra o erro e põe o foco no primeiro campo', async ({ page }) => {
  const pedido = await abrirPedido(page);
  await pedido.getByRole('button', { name: /Enviar no WhatsApp/ }).click();
  const nome = pedido.getByLabel(/Seu nome/);
  await expect(nome).toBeFocused();
  await expect(nome).toHaveAttribute('aria-invalid', 'true');
  await expect(pedido.locator('#checkout-name-error')).toBeVisible();
  await expect(pedido).toBeVisible();
});

test('carrinho que fica vazio: avisa e não deixa enviar', async ({ page }) => {
  const pedido = await abrirPedido(page);
  await pedido.getByRole('button', { name: 'Remover Esfirra Carne' }).click();
  await expect(pedido.getByText('Seu pedido está vazio.')).toBeVisible();
  await expect(pedido.getByRole('button', { name: /Enviar no WhatsApp/ })).toBeDisabled();
});

/*
 * Com 'noopener', window.open devolve null mesmo quando abre: o app não sabe se houve bloqueio.
 * Por isso a tela de sucesso traz sempre o link de reserva. O teste confere o link com a aba bloqueada.
 */
test('pop-up bloqueado: a tela de sucesso sempre oferece o link de reserva', async ({ page }) => {
  // Simula o navegador que não abre a nova aba.
  await page.addInitScript(() => { window.open = () => null; });
  const pedido = await abrirPedido(page);
  await pedido.getByLabel(/Seu nome/).fill('Pessoa Teste');
  await pedido.getByLabel(/WhatsApp/).fill('(11) 90000-0000');
  await pedido.getByRole('button', { name: 'Retirada no balcão' }).click();
  await pedido.getByRole('button', { name: /Enviar no WhatsApp/ }).click();
  const sucesso = page.getByRole('dialog', { name: 'Pedido pronto para envio!' });
  const reserva = sucesso.getByRole('link', { name: 'O WhatsApp não abriu? Toque aqui.' });
  await expect(reserva).toBeVisible();
  // Confere só o começo do link e o item: o número da loja não vai para o log.
  const href = decodeURIComponent((await reserva.getAttribute('href')) ?? '');
  expect(/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)).toBe(true);
  expect(href.includes('1x *Esfirra Carne*')).toBe(true);
});
