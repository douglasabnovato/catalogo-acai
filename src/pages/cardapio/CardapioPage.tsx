/*
 * CardapioPage.tsx · cardápio da Garagem Lanches: categorias, montagem de açaí, carrinho editável
 * e checkout que envia o pedido pelo WhatsApp (canal principal) e o registra no Supabase quando configurado.
 */
import { useReducer, useState, type FormEvent } from 'react';
import { ShoppingBag, Utensils, Sparkles, PhoneCall, Check, ChevronRight, Flame, Coffee, Sandwich, Star, Home, PartyPopper, Minus, Plus, Trash2 } from 'lucide-react';
import { menuData, type MenuItem } from '../../entities/menu/model/menu.data';
import { cartReducer, cartTotal, cartCount } from '../../entities/cart/model/cart';
import { AcaiBuilderModal } from '../../features/order/ui/AcaiBuilderModal';
import { buildWhatsAppMessage, validateCheckout, whatsAppUrl, phoneDigits, type CheckoutErrors, type CheckoutForm } from '../../features/order/model/order';
import { supabase } from '../../shared/api/supabase';
import { Dialog } from '../../shared/ui/Dialog';
import { formatBRL, toCents } from '../../shared/lib/money';
import { STORE } from '../../shared/config/store';

const CATEGORIES = [
  { id: 'all', label: 'Todos', icon: Flame },
  { id: 'acai', label: 'Açaís', icon: Sparkles },
  { id: 'salgados', label: 'Salgados', icon: Utensils },
  { id: 'sanduiches', label: 'Sanduíches', icon: Sandwich },
  { id: 'combos', label: 'Combos', icon: Star },
  { id: 'bebidas', label: 'Sucos e Vitaminas', icon: Coffee },
  { id: 'takeaway', label: 'Para Casa', icon: Home },
];

const EMPTY_FORM: CheckoutForm = { name: '', phone: '', deliveryType: 'delivery', address: '' };

/* Grava o pedido no Supabase sem bloquear o cliente; falha fica só no console. */
async function saveOrder(form: CheckoutForm, lines: ReturnType<typeof cartReducer>) {
  if (!supabase) return;
  const { error } = await supabase.from('orders').insert([{
    customer_name: form.name.trim(),
    customer_phone: phoneDigits(form.phone),
    delivery_type: form.deliveryType,
    address: form.deliveryType === 'delivery' ? form.address.trim() : 'Retirada no balcão',
    items: lines.map(({ name, details, quantity, unitCents }) => ({ name, details, quantity, unit_cents: unitCents })),
    total_amount: cartTotal(lines) / 100,
  }]);
  if (error) console.error('Pedido não registrado no Supabase:', error.message);
}

/* Página única do cardápio. */
export const CardapioPage = () => {
  const [selectedAcai, setSelectedAcai] = useState<MenuItem | null>(null);
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const [form, setForm] = useState<CheckoutForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [announcement, setAnnouncement] = useState('');

  const filteredItems = activeCategory === 'all' ? menuData : menuData.filter((item) => item.category === activeCategory);
  const totalCents = cartTotal(cart);
  const count = cartCount(cart);

  /* Adiciona ao carrinho e anuncia para leitores de tela. */
  const addToCart = (item: { name: string; unitCents: number; details: string }) => {
    dispatch({ type: 'add', item });
    setAnnouncement(`${item.name} adicionado ao pedido.`);
  };

  /* Açaí abre o montador; os demais entram direto. */
  const handleQuickAdd = (item: MenuItem) => {
    if (item.category === 'acai') setSelectedAcai(item);
    else addToCart({ name: item.name, unitCents: toCents(item.price), details: item.description ?? '' });
  };

  /* Atualiza um campo do checkout e limpa o erro dele. */
  const updateField = <K extends keyof CheckoutForm>(field: K, value: CheckoutForm[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  /* Valida, abre o WhatsApp no mesmo gesto do clique (evita bloqueio de pop-up) e registra o pedido. */
  const submitOrder = (event: FormEvent) => {
    event.preventDefault();
    if (cart.length === 0) return;
    const found = validateCheckout(form);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      document.getElementById(`checkout-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    const url = whatsAppUrl(buildWhatsAppMessage(form, cart));
    window.open(url, '_blank', 'noopener');
    void saveOrder(form, cart).catch((error) => console.error('Falha ao registrar pedido:', error));
    dispatch({ type: 'clear' });
    setIsCheckoutOpen(false);
    setSentUrl(url);
  };

  /* Fecha a confirmação e prepara um novo pedido. */
  const startNewOrder = () => {
    setSentUrl(null);
    setForm(EMPTY_FORM);
    setErrors({});
  };

  const inputClass = (hasError: boolean) =>
    `w-full bg-zinc-800 border rounded-2xl px-4 py-3 text-sm text-white placeholder:text-zinc-400 ${hasError ? 'border-red-400' : 'border-zinc-600'}`;

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 pb-32 selection:bg-amber-400 selection:text-zinc-950">
      <p className="sr-only" role="status" aria-live="polite">{announcement}</p>

      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-zinc-950 font-black text-xl" aria-hidden="true">
              G
            </div>
            <div>
              <h1 className="text-lg font-black tracking-wider text-white">GARAGEM <span className="text-amber-400">LANCHES</span></h1>
              <p className="text-[11px] text-zinc-400 font-medium">Cardápio digital · feito na hora</p>
            </div>
          </div>
          <a
            href={whatsAppUrl('Olá! Gostaria de tirar dúvidas sobre o cardápio.')}
            target="_blank"
            rel="noreferrer"
            className="bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 p-2.5 rounded-2xl text-emerald-400 transition-all flex items-center gap-2 text-xs font-bold"
          >
            <PhoneCall size={16} aria-hidden="true" /> <span className="hidden sm:inline">Suporte</span>
            <span className="sr-only sm:hidden">Falar com a loja no WhatsApp</span>
          </a>
        </div>
      </header>

      <nav aria-label="Categorias do cardápio" className="sticky top-[73px] z-30 bg-[#09090b]/95 backdrop-blur border-b border-zinc-800/60 py-3 px-4">
        <div className="max-w-4xl mx-auto flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            return (
              <button
                type="button"
                key={category.id}
                aria-pressed={isActive}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${isActive
                  ? 'bg-amber-400 border-amber-400 text-zinc-950'
                  : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800'
                  }`}
              >
                <Icon size={14} aria-hidden="true" />
                {category.label}
              </button>
            );
          })}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 pt-6">
        <h2 className="sr-only">Produtos</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <li key={item.id} className="bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 rounded-3xl p-5 transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-base font-bold text-white">{item.name}</h3>
                  <span className="font-mono text-sm font-black text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-xl whitespace-nowrap">
                    {formatBRL(toCents(item.price))}
                  </span>
                </div>
                {item.description && <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{item.description}</p>}
              </div>
              <div className="pt-4 mt-4 border-t border-zinc-800/60 flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-bold">
                  {item.category === 'acai' ? 'Artesanal customizável' : 'Pronto para consumo'}
                </span>
                <button
                  type="button"
                  onClick={() => handleQuickAdd(item)}
                  aria-label={`${item.category === 'acai' ? 'Montar copo' : 'Adicionar'}: ${item.name}`}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${item.category === 'acai'
                    ? 'bg-purple-950/80 border border-purple-400/60 text-purple-100 hover:bg-purple-900'
                    : 'bg-emerald-400 hover:bg-emerald-300 text-zinc-950'
                    }`}
                >
                  <Sparkles size={14} aria-hidden="true" />
                  {item.category === 'acai' ? 'Montar copo' : 'Adicionar'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>

      {selectedAcai && <AcaiBuilderModal item={selectedAcai} onClose={() => setSelectedAcai(null)} onAddToCart={addToCart} />}

      {count > 0 && !isCheckoutOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-400 text-zinc-950 flex items-center justify-center" aria-hidden="true">
                <ShoppingBag size={20} />
              </div>
              <div>
                <span className="text-xs text-zinc-400 block font-medium">{count} {count === 1 ? 'item' : 'itens'} no pedido</span>
                <span className="text-lg font-black text-white font-mono">{formatBRL(totalCents)}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsCheckoutOpen(true)}
              className="bg-amber-400 hover:bg-amber-500 text-zinc-950 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2"
            >
              Ver pedido <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {isCheckoutOpen && (
        <Dialog titleId="checkout-title" onClose={() => setIsCheckoutOpen(false)} className="max-w-md overflow-y-auto">
          <h2 id="checkout-title" className="text-lg font-black text-white mb-4">Seu pedido</h2>

          <section aria-labelledby="itens-title" className="bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800 space-y-3 mb-4">
            <h3 id="itens-title" className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Itens</h3>
            {cart.length === 0 && <p className="text-xs text-zinc-400">Seu pedido está vazio.</p>}
            <ul className="space-y-3 text-xs">
              {cart.map((line) => (
                <li key={line.key} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-zinc-100 font-bold">{line.name}</p>
                    {line.details && <p className="text-zinc-400">{line.details}</p>}
                    <p className="font-mono text-amber-400">{formatBRL(line.unitCents * line.quantity)}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button type="button" onClick={() => dispatch({ type: 'decrement', key: line.key })} aria-label={`Diminuir ${line.name}`} className="p-1.5 rounded-lg bg-zinc-800 text-zinc-200">
                      <Minus size={14} aria-hidden="true" />
                    </button>
                    <span className="w-6 text-center font-mono" aria-label={`Quantidade: ${line.quantity}`}>{line.quantity}</span>
                    <button type="button" onClick={() => dispatch({ type: 'increment', key: line.key })} aria-label={`Aumentar ${line.name}`} className="p-1.5 rounded-lg bg-zinc-800 text-zinc-200">
                      <Plus size={14} aria-hidden="true" />
                    </button>
                    <button type="button" onClick={() => dispatch({ type: 'remove', key: line.key })} aria-label={`Remover ${line.name}`} className="p-1.5 rounded-lg bg-zinc-800 text-red-300">
                      <Trash2 size={14} aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="pt-2 border-t border-zinc-800 flex justify-between font-black text-sm">
              <span>Total</span>
              <span className="text-amber-400 font-mono">{formatBRL(totalCents)}</span>
            </div>
          </section>

          <form onSubmit={submitOrder} noValidate className="space-y-4">
            <div>
              <label htmlFor="checkout-name" className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1">Seu nome *</label>
              <input id="checkout-name" type="text" autoComplete="name" value={form.name} onChange={(e) => updateField('name', e.target.value)}
                aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'checkout-name-error' : undefined}
                placeholder="Ex.: João da Silva" className={inputClass(Boolean(errors.name))} />
              {errors.name && <p id="checkout-name-error" className="text-xs text-red-300 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="checkout-phone" className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1">WhatsApp / telefone *</label>
              <input id="checkout-phone" type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={(e) => updateField('phone', e.target.value)}
                aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'checkout-phone-error' : undefined}
                placeholder="(32) 99999-9999" className={inputClass(Boolean(errors.phone))} />
              {errors.phone && <p id="checkout-phone-error" className="text-xs text-red-300 mt-1">{errors.phone}</p>}
            </div>

            <fieldset>
              <legend className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1">Tipo de atendimento</legend>
              <div className="grid grid-cols-2 gap-2">
                {(['delivery', 'retirada'] as const).map((type) => (
                  <button key={type} type="button" aria-pressed={form.deliveryType === type} onClick={() => updateField('deliveryType', type)}
                    className={`py-2.5 rounded-2xl text-xs font-bold border transition-all ${form.deliveryType === type ? 'bg-amber-400 border-amber-400 text-zinc-950' : 'bg-zinc-800 border-zinc-600 text-zinc-200'}`}>
                    {type === 'delivery' ? 'Entrega em casa' : 'Retirada no balcão'}
                  </button>
                ))}
              </div>
            </fieldset>

            {form.deliveryType === 'delivery' && (
              <div>
                <label htmlFor="checkout-address" className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1">Endereço e referência *</label>
                <textarea id="checkout-address" autoComplete="street-address" rows={3} value={form.address} onChange={(e) => updateField('address', e.target.value)}
                  aria-invalid={Boolean(errors.address)} aria-describedby={errors.address ? 'checkout-address-error' : undefined}
                  placeholder="Rua, número, bairro e ponto de referência" className={`${inputClass(Boolean(errors.address))} resize-none`} />
                {errors.address && <p id="checkout-address-error" className="text-xs text-red-300 mt-1">{errors.address}</p>}
              </div>
            )}

            <p className="text-[11px] text-zinc-400">
              Seus dados são usados só para preparar e entregar este pedido pela {STORE.name}.
            </p>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setIsCheckoutOpen(false)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 py-3 rounded-2xl text-xs font-bold transition-all">
                Continuar comprando
              </button>
              <button type="submit" disabled={cart.length === 0} className="flex-1 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-zinc-950 py-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-1.5">
                <Check size={16} aria-hidden="true" /> Enviar no WhatsApp
              </button>
            </div>
          </form>
        </Dialog>
      )}

      {sentUrl && (
        <Dialog titleId="success-title" onClose={startNewOrder} className="max-w-sm text-center space-y-4 border-amber-400/30">
          <div className="w-16 h-16 bg-amber-400/10 border border-amber-400/30 rounded-full flex items-center justify-center mx-auto text-amber-400" aria-hidden="true">
            <PartyPopper size={32} />
          </div>
          <div>
            <h2 id="success-title" className="text-lg font-black text-white">Pedido pronto para envio!</h2>
            <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
              Abrimos o WhatsApp da loja com o seu pedido. Toque em <strong>enviar</strong> na conversa para concluir.
            </p>
          </div>
          <a href={sentUrl} target="_blank" rel="noreferrer" className="block text-xs font-bold text-emerald-300 underline">
            O WhatsApp não abriu? Toque aqui.
          </a>
          <button type="button" onClick={startNewOrder} className="w-full bg-amber-400 hover:bg-amber-500 text-zinc-950 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all">
            Fazer novo pedido
          </button>
        </Dialog>
      )}
    </div>
  );
};
/* fim de CardapioPage.tsx */
