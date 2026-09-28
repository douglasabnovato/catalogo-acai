/*
 * order.ts · regras do pedido: preço do açaí montado, validação do checkout e mensagem do WhatsApp.
 */
import { STORE } from '../../../shared/config/store';
import { formatBRL } from '../../../shared/lib/money';
import { type CartLine, cartTotal } from '../../../entities/cart/model/cart';

export type DeliveryType = 'delivery' | 'retirada';

export interface CheckoutForm {
  name: string;
  phone: string;
  deliveryType: DeliveryType;
  address: string;
}

export type CheckoutErrors = Partial<Record<'name' | 'phone' | 'address', string>>;

/* Preço do copo: base + adicionais acima dos inclusos + whey. */
export function acaiPriceCents(baseCents: number, toppingsCount: number, hasWhey: boolean): number {
  const extras = Math.max(0, toppingsCount - STORE.freeToppings);
  return baseCents + extras * STORE.extraToppingCents + (hasWhey ? STORE.wheyCents : 0);
}

/* Mantém só os dígitos do telefone. */
export function phoneDigits(phone: string): string {
  return phone.replace(/\D/g, '');
}

/* Valida o formulário; telefone com DDD (10 ou 11 dígitos). */
export function validateCheckout(form: CheckoutForm): CheckoutErrors {
  const errors: CheckoutErrors = {};
  if (form.name.trim().length < 3) errors.name = 'Informe seu nome.';
  const digits = phoneDigits(form.phone);
  if (digits.length < 10 || digits.length > 11) errors.phone = 'Informe o WhatsApp com DDD, por exemplo (32) 99999-9999.';
  if (form.deliveryType === 'delivery' && form.address.trim().length < 8) {
    errors.address = 'Informe rua, número, bairro e um ponto de referência.';
  }
  return errors;
}

/* Monta o texto do pedido para o WhatsApp da loja. */
export function buildWhatsAppMessage(form: CheckoutForm, lines: CartLine[]): string {
  const rows = [
    `*NOVO PEDIDO - ${STORE.name.toUpperCase()}*`,
    '',
    `*Cliente:* ${form.name.trim()}`,
    `*WhatsApp:* ${form.phone.trim()}`,
    `*Tipo:* ${form.deliveryType === 'delivery' ? 'Entrega em casa' : 'Retirada no balcão'}`,
  ];
  if (form.deliveryType === 'delivery') rows.push(`*Endereço/Referência:* ${form.address.trim()}`);
  rows.push('', '*ITENS DO PEDIDO:*');
  lines.forEach((line, index) => {
    rows.push(`${index + 1}. ${line.quantity}x *${line.name}* - ${formatBRL(line.unitCents * line.quantity)}`);
    if (line.details) rows.push(`   _${line.details}_`);
  });
  rows.push('', `*TOTAL A PAGAR: ${formatBRL(cartTotal(lines))}*`);
  return rows.join('\n');
}

/* Link wa.me com o texto codificado. */
export function whatsAppUrl(text: string, phone: string = STORE.whatsapp): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
/* fim de order.ts */
