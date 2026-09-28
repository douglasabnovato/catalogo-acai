/*
 * order.test.ts · preço do açaí, validação do checkout e mensagem do WhatsApp.
 */
import { describe, expect, it } from 'vitest';
import { acaiPriceCents, validateCheckout, buildWhatsAppMessage, whatsAppUrl } from './order';

describe('acaiPriceCents', () => {
  it('não cobra os 3 primeiros acompanhamentos', () => {
    expect(acaiPriceCents(1790, 3, false)).toBe(1790);
  });
  it('cobra R$ 2,00 por adicional e R$ 9,00 de whey', () => {
    expect(acaiPriceCents(1790, 5, true)).toBe(1790 + 400 + 900);
  });
});

describe('validateCheckout', () => {
  it('exige nome, telefone com DDD e endereço na entrega', () => {
    const errors = validateCheckout({ name: 'Jo', phone: '9999', deliveryType: 'delivery', address: '' });
    expect(Object.keys(errors).sort()).toEqual(['address', 'name', 'phone']);
  });
  it('dispensa endereço na retirada', () => {
    expect(validateCheckout({ name: 'Ana Lima', phone: '(32) 99999-0000', deliveryType: 'retirada', address: '' })).toEqual({});
  });
});

describe('buildWhatsAppMessage', () => {
  it('lista quantidade, subtotal em pt-BR e total', () => {
    const text = buildWhatsAppMessage(
      { name: 'Ana Lima', phone: '32999990000', deliveryType: 'retirada', address: '' },
      [{ key: 'k', name: 'Esfirra Carne', unitCents: 950, details: '', quantity: 2 }],
    );
    expect(text).toContain('2x *Esfirra Carne* - R$ 19,00');
    expect(text).toContain('*TOTAL A PAGAR: R$ 19,00*');
    expect(text).toContain('Retirada no balcão');
    expect(text).not.toContain('Endereço');
  });
  it('codifica o texto no link wa.me', () => {
    expect(whatsAppUrl('a b&c', '5532000000000')).toBe('https://wa.me/5532000000000?text=a%20b%26c');
  });
});
/* fim de order.test.ts */
