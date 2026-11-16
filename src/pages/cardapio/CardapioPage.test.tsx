/*
 * CardapioPage.test.tsx · fluxo principal: adicionar, editar o carrinho, validar e enviar pelo WhatsApp.
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CardapioPage } from './CardapioPage';

describe('CardapioPage', () => {
  beforeEach(() => {
    vi.spyOn(window, 'open').mockReturnValue(null);
  });

  it('mantém o pedido ao recarregar a página e limpa depois do envio', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<CardapioPage />);
    await user.click(screen.getByRole('button', { name: 'Adicionar: Esfirra Carne' }));
    unmount();

    render(<CardapioPage />);
    expect(screen.getByText('1 item no pedido')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Ver pedido/ }));
    const dialog = screen.getByRole('dialog', { name: 'Seu pedido' });
    await user.type(within(dialog).getByLabelText(/Seu nome/), 'Ana Lima');
    await user.type(within(dialog).getByLabelText(/WhatsApp/), '(32) 99999-0000');
    await user.click(within(dialog).getByRole('button', { name: 'Retirada no balcão' }));
    await user.click(within(dialog).getByRole('button', { name: /Enviar no WhatsApp/ }));
    expect(localStorage.getItem('garagem-carrinho')).toBeNull();
  });

  it('adiciona itens, ajusta quantidade e envia o pedido validado', async () => {
    const user = userEvent.setup();
    const count = vi.fn();
    window.goatcounter = { count };
    render(<CardapioPage />);
    await user.click(screen.getByRole('button', { name: 'Adicionar: Esfirra Carne' }));
    await user.click(screen.getByRole('button', { name: 'Adicionar: Esfirra Carne' }));
    expect(screen.getByText('2 itens no pedido')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Ver pedido/ }));
    const dialog = screen.getByRole('dialog', { name: 'Seu pedido' });
    await user.click(within(dialog).getByRole('button', { name: 'Diminuir Esfirra Carne' }));
    expect(within(dialog).getByLabelText('Quantidade: 1')).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: /Enviar no WhatsApp/ }));
    expect(within(dialog).getByText('Informe seu nome.')).toBeInTheDocument();
    expect(window.open).not.toHaveBeenCalled();

    await user.type(within(dialog).getByLabelText(/Seu nome/), 'Ana Lima');
    await user.type(within(dialog).getByLabelText(/WhatsApp/), '(32) 99999-0000');
    await user.click(within(dialog).getByRole('button', { name: 'Retirada no balcão' }));
    await user.click(within(dialog).getByRole('button', { name: /Enviar no WhatsApp/ }));

    expect(window.open).toHaveBeenCalledTimes(1);
    expect(count).toHaveBeenCalledWith({ path: 'pedido-enviado', title: 'pedido-enviado', event: true });
    const url = decodeURIComponent(String(vi.mocked(window.open).mock.calls[0][0]));
    expect(url).toContain('1x *Esfirra Carne*');
    expect(screen.getByRole('dialog', { name: 'Pedido pronto para envio!' })).toBeInTheDocument();
  });

  it('monta o açaí mostrando o custo dos adicionais', async () => {
    const user = userEvent.setup();
    render(<CardapioPage />);
    await user.click(screen.getByRole('button', { name: 'Montar copo: Açaí 300ml' }));
    const dialog = screen.getByRole('dialog', { name: 'Açaí 300ml' });
    for (const topping of ['Granola', 'Paçoca', 'Mel', 'Chantily']) {
      await user.click(within(dialog).getByRole('button', { name: topping }));
    }
    expect(within(dialog).getByText(/19,90/)).toBeInTheDocument();
    expect(within(dialog).getByText('inclui 1 adicional(is)')).toBeInTheDocument();
    expect(within(dialog).getByRole('note')).toHaveTextContent('Valor dos adicionais ilustrativo');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('pede troco válido no dinheiro e leva pagamento e observação ao WhatsApp', async () => {
    const user = userEvent.setup();
    render(<CardapioPage />);
    await user.click(screen.getByRole('button', { name: 'Adicionar: Esfirra Carne' }));
    await user.click(screen.getByRole('button', { name: /Ver pedido/ }));
    const dialog = screen.getByRole('dialog', { name: 'Seu pedido' });
    await user.type(within(dialog).getByLabelText(/Seu nome/), 'Ana Lima');
    await user.type(within(dialog).getByLabelText(/WhatsApp/), '(32) 99999-0000');
    await user.click(within(dialog).getByRole('button', { name: 'Retirada no balcão' }));
    expect(within(dialog).getByRole('button', { name: 'Pix' })).toHaveAttribute('aria-pressed', 'true');
    expect(within(dialog).queryByLabelText(/Troco para/)).not.toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: 'Dinheiro' }));
    await user.type(within(dialog).getByLabelText(/Troco para/), '5');
    await user.click(within(dialog).getByRole('button', { name: /Enviar no WhatsApp/ }));
    expect(window.open).not.toHaveBeenCalled();
    expect(within(dialog).getByLabelText(/Troco para/)).toHaveFocus();
    expect(within(dialog).getByText(/O troco precisa ser para R\$\s9,50 ou mais/)).toBeInTheDocument();

    await user.clear(within(dialog).getByLabelText(/Troco para/));
    await user.type(within(dialog).getByLabelText(/Troco para/), '20');
    await user.type(within(dialog).getByLabelText(/Observações/), 'Bem quente');
    await user.click(within(dialog).getByRole('button', { name: /Enviar no WhatsApp/ }));
    const url = decodeURIComponent(String(vi.mocked(window.open).mock.calls[0][0]));
    expect(url).toMatch(/\*Pagamento:\* Dinheiro \(troco para R\$\s20,00\)/);
    expect(url).toContain('*Observações:* Bem quente');
  });

  it('filtra por categoria', async () => {
    const user = userEvent.setup();
    render(<CardapioPage />);
    await user.click(screen.getByRole('button', { name: 'Combos' }));
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
  });
});
/* fim de CardapioPage.test.tsx */
