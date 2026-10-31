/*
 * cart.ts · carrinho como reducer puro: adiciona (agrupando itens iguais), altera quantidade e remove.
 */
export interface CartLine {
  key: string;
  name: string;
  unitCents: number;
  details: string;
  quantity: number;
}

export type CartAction =
  | { type: 'add'; item: Omit<CartLine, 'key' | 'quantity'> }
  | { type: 'increment'; key: string }
  | { type: 'decrement'; key: string }
  | { type: 'remove'; key: string }
  | { type: 'clear' };

/* Chave estável: o mesmo produto com os mesmos detalhes vira uma linha só. */
export function lineKey(item: { name: string; details: string; unitCents: number }): string {
  return `${item.name}|${item.details}|${item.unitCents}`;
}

/* Função de transição do carrinho. */
export function cartReducer(state: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case 'add': {
      const key = lineKey(action.item);
      const existing = state.find((line) => line.key === key);
      if (existing) return state.map((line) => (line.key === key ? { ...line, quantity: line.quantity + 1 } : line));
      return [...state, { ...action.item, key, quantity: 1 }];
    }
    case 'increment':
      return state.map((line) => (line.key === action.key ? { ...line, quantity: line.quantity + 1 } : line));
    case 'decrement':
      return state
        .map((line) => (line.key === action.key ? { ...line, quantity: line.quantity - 1 } : line))
        .filter((line) => line.quantity > 0);
    case 'remove':
      return state.filter((line) => line.key !== action.key);
    case 'clear':
      return [];
    default:
      return state;
  }
}

/* Total em centavos. */
export function cartTotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.unitCents * line.quantity, 0);
}

/* Quantidade total de unidades. */
export function cartCount(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

const STORAGE_KEY = 'garagem-carrinho';
const MAX_AGE_MS = 12 * 60 * 60 * 1000;

function isCartLine(line: unknown): line is CartLine {
  const candidate = line as CartLine | null;
  return Boolean(candidate) && typeof candidate?.key === 'string' && typeof candidate?.name === 'string'
    && typeof candidate?.details === 'string' && Number.isInteger(candidate?.unitCents) && Number.isInteger(candidate?.quantity) && candidate.quantity > 0;
}

/* Recupera o carrinho salvo; dados antigos ou inválidos são ignorados para não mostrar preço vencido. */
export function loadCart(now: number = Date.now()): CartLine[] {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    if (!saved || now - saved.savedAt > MAX_AGE_MS || !Array.isArray(saved.lines) || !saved.lines.every(isCartLine)) return [];
    return saved.lines;
  } catch {
    return [];
  }
}

/* Salva o carrinho; sem armazenamento disponível, o pedido segue só na memória. */
export function saveCart(lines: CartLine[], now: number = Date.now()): void {
  try {
    if (lines.length === 0) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, JSON.stringify({ savedAt: now, lines }));
  } catch {
    /* Navegação privada ou armazenamento cheio. */
  }
}
/* fim de cart.ts */
