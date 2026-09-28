/*
 * store.ts · dados comerciais da loja num só lugar (preços de adicionais e WhatsApp).
 */
export const STORE = {
  name: 'Garagem Lanches',
  whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER || '5532988367667',
  freeToppings: 3,
  extraToppingCents: 200,
  wheyCents: 900,
};
/* fim de store.ts */
