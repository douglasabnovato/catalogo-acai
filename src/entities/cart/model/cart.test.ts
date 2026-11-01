/*
 * cart.test.ts · reducer do carrinho e totais em centavos.
 */
import { describe, expect, it } from 'vitest';
import { cartReducer, cartTotal, cartCount, loadCart, saveCart } from './cart';

const esfirra = { name: 'Esfirra Carne', unitCents: 950, details: '' };

describe('carrinho salvo', () => {
  const line = { key: 'a', name: 'Esfirra', details: '', unitCents: 500, quantity: 2 };

  it('recupera o que foi salvo e ignora o que venceu ou está inválido', () => {
    saveCart([line], 1000);
    expect(loadCart(2000)).toEqual([line]);
    expect(loadCart(1000 + 13 * 60 * 60 * 1000)).toEqual([]);
    localStorage.setItem('garagem-carrinho', '{"savedAt":1000,"lines":[{"name":"x"}]}');
    expect(loadCart(2000)).toEqual([]);
    localStorage.setItem('garagem-carrinho', 'não é json');
    expect(loadCart(2000)).toEqual([]);
  });
});

describe('cartReducer', () => {
  it('agrupa itens iguais e soma a quantidade', () => {
    const state = cartReducer(cartReducer([], { type: 'add', item: esfirra }), { type: 'add', item: esfirra });
    expect(state).toHaveLength(1);
    expect(state[0].quantity).toBe(2);
    expect(cartTotal(state)).toBe(1900);
  });

  it('mantém separados copos com montagens diferentes', () => {
    let state = cartReducer([], { type: 'add', item: { name: 'Açaí 300ml', unitCents: 1790, details: 'Granola' } });
    state = cartReducer(state, { type: 'add', item: { name: 'Açaí 300ml', unitCents: 1790, details: 'Paçoca' } });
    expect(state).toHaveLength(2);
  });

  it('diminui, remove na quantidade zero e limpa', () => {
    let state = cartReducer([], { type: 'add', item: esfirra });
    const key = state[0].key;
    state = cartReducer(state, { type: 'increment', key });
    state = cartReducer(state, { type: 'decrement', key });
    expect(cartCount(state)).toBe(1);
    state = cartReducer(state, { type: 'decrement', key });
    expect(state).toEqual([]);
    state = cartReducer(cartReducer([], { type: 'add', item: esfirra }), { type: 'clear' });
    expect(state).toEqual([]);
  });

  it('soma em centavos sem erro de ponto flutuante', () => {
    let state = cartReducer([], { type: 'add', item: { name: 'A', unitCents: 10, details: '' } });
    state = cartReducer(state, { type: 'add', item: { name: 'B', unitCents: 20, details: '' } });
    expect(cartTotal(state)).toBe(30);
  });
});
/* fim de cart.test.ts */
