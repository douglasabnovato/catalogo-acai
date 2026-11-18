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

/*
 * Mede o contraste que o axe deixa como "incomplete" (#34). Compõe as camadas de fundo do elemento para fora,
 * até uma cor opaca, e testa cada cor de um degradê. O canvas converte qualquer cor CSS (o Tailwind 4 usa oklch).
 * Mínimo da WCAG 1.4.3: 4,5:1, ou 3:1 em texto grande (24 px, ou 18,66 px em negrito).
 */
async function contrasteMedido(page: Page, seletores: string[]) {
  return page.evaluate((lista) => {
    const tela = document.createElement('canvas');
    tela.width = 1;
    tela.height = 1;
    const ctx = tela.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Sem canvas para medir o contraste');
    const rgba = (cor: string) => {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = '#000';
      ctx.fillStyle = cor;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
      return [r, g, b, a / 255];
    };
    const sobre = (cima: number[], baixo: number[]) => [0, 1, 2].map((i) => cima[i] * cima[3] + baixo[i] * (1 - cima[3])).concat(1);
    const luminancia = (c: number[]) => {
      const [r, g, b] = c.slice(0, 3).map((v) => (v / 255 <= 0.04045 ? v / 255 / 12.92 : ((v / 255 + 0.055) / 1.055) ** 2.4));
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const razao = (a: number[], b: number[]) => {
      const [claro, escuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
      return (claro + 0.05) / (escuro + 0.05);
    };
    const CORES = /(oklch|oklab|rgba?|hsla?|lab|lch|color)\([^()]*\)|#[0-9a-f]{3,8}\b/gi;

    return lista.map((sel) => {
      const el = document.querySelector(sel);
      if (!el) return { sel, razao: 0, minimo: 4.5 };
      const camadas: { cor: number[]; degrade: number[][] }[] = [];
      for (let no: Element | null = el; no; no = no.parentElement) {
        const estilo = getComputedStyle(no);
        const cor = rgba(estilo.backgroundColor);
        const degrade = (estilo.backgroundImage.match(CORES) ?? []).map(rgba);
        camadas.push({ cor, degrade });
        if (cor[3] >= 0.999 || (degrade.length > 0 && degrade.every((d) => d[3] >= 0.999))) break;
      }
      let fundos = [[255, 255, 255, 1]];
      for (const { cor, degrade } of camadas.reverse()) {
        fundos = fundos.map((f) => sobre(cor, f));
        if (degrade.length > 0) fundos = fundos.flatMap((f) => degrade.map((d) => sobre(d, f)));
      }
      const estilo = getComputedStyle(el);
      const texto = rgba(estilo.color);
      const tamanho = parseFloat(estilo.fontSize);
      const minimo = tamanho >= 24 || (Number(estilo.fontWeight) >= 700 && tamanho >= 18.66) ? 3 : 4.5;
      const menor = Math.min(...fundos.map((f) => razao(sobre(texto, f), f)));
      return { sel, razao: Math.round(menor * 100) / 100, minimo };
    });
  }, seletores);
}

/*
 * Roda o axe e devolve só a regra e o seletor: o HTML do link da loja não vai para o log.
 * Os itens "incomplete" também contam (#34). Decisões:
 * - aria-prohibited-attr (aria-label no span da quantidade do carrinho): corrigido com um texto sr-only.
 * - color-contrast: o axe não acha o fundo em camadas translúcidas (bg-zinc-900/80, backdrop-blur), em botões
 *   cobertos por outra camada (categorias fora da tela, rodapé fixo) nem no logo "G" (texto curto, degradê).
 *   Aceito só com a medição acima no mínimo da WCAG. Qualquer outra regra incompleta falha o teste.
 */
async function violacoes(page: Page, escopo?: string) {
  let axe = new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']);
  if (escopo) axe = axe.include(escopo);
  const { violations, incomplete } = await axe.analyze();
  const lista = violations.map((v) => ({ regra: v.id, alvos: v.nodes.map((n) => n.target.join(' ')) }));
  for (const item of incomplete) {
    const alvos = item.nodes.map((n) => n.target.join(' '));
    if (item.id !== 'color-contrast') {
      lista.push({ regra: `incompleto: ${item.id}`, alvos });
      continue;
    }
    const baixos = (await contrasteMedido(page, alvos)).filter((m) => m.razao < m.minimo);
    if (baixos.length > 0) lista.push({ regra: 'incompleto: color-contrast abaixo do mínimo', alvos: baixos.map((m) => `${m.sel} (${m.razao}:1)`) });
  }
  return lista;
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

    test('página inteira com o checkout aberto sem violações', async ({ page }) => {
      await page.goto('./');
      await page.getByRole('button', { name: 'Adicionar: Esfirra Carne' }).click();
      await page.getByRole('button', { name: /Ver pedido/ }).click();
      await expect(page.getByRole('dialog', { name: 'Seu pedido' })).toBeVisible();
      expect(await violacoes(page)).toEqual([]);
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

test('com o diálogo aberto, o fundo fica inerte: sem foco e fora da árvore de acessibilidade', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Adicionar: Esfirra Carne' }).click();
  await page.getByRole('button', { name: /Ver pedido/ }).click();
  const pedido = page.getByRole('dialog', { name: 'Seu pedido' });
  await expect(pedido).toBeVisible();

  // Nenhum botão do fundo recebe foco, nem por script.
  const focoNoFundo = await page.evaluate(() => {
    const botoes = Array.from(document.querySelectorAll<HTMLElement>('header a, nav button, main button'));
    return botoes.filter((b) => { b.focus(); return document.activeElement === b; }).length;
  });
  expect(focoNoFundo).toBe(0);
  // Shift+Tab a partir do primeiro controle não sai do diálogo.
  for (let i = 0; i < 5; i += 1) {
    await page.keyboard.press('Shift+Tab');
    expect(await page.evaluate(() => Boolean(document.activeElement?.closest('[role="dialog"]')))).toBe(true);
  }
  // A árvore de acessibilidade do Chromium (a que o leitor de tela lê) mostra o diálogo e esconde o cardápio atrás dele.
  // O ariaSnapshot do Playwright não considera o inert; por isso a leitura vem do protocolo do navegador.
  const cdp = await page.context().newCDPSession(page);
  const { nodes } = (await cdp.send('Accessibility.getFullAXTree')) as { nodes: { ignored: boolean; name?: { value?: unknown } }[] };
  const visiveis = (texto: string) => nodes.filter((n) => !n.ignored && String(n.name?.value ?? '').includes(texto)).length;
  expect(visiveis('Seu pedido')).toBeGreaterThan(0);
  expect(visiveis('Categorias do cardápio')).toBe(0);
  expect(visiveis('Montar copo')).toBe(0);
  await cdp.detach();

  // Ao fechar, o fundo volta a valer.
  await page.keyboard.press('Escape');
  await expect(pedido).toBeHidden();
  await expect(page.getByRole('button', { name: 'Montar copo: Açaí 300ml' })).toBeVisible();
  expect(await page.locator('[inert]').count()).toBe(0);
});
