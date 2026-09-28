/*
 * AcaiBuilderModal.tsx · montagem do copo de açaí: acompanhamentos, whey e preço transparente.
 */
import { useState } from 'react';
import { X, Check, Plus } from 'lucide-react';
import { type MenuItem, acaiToppings } from '../../../entities/menu/model/menu.data';
import { Dialog } from '../../../shared/ui/Dialog';
import { STORE } from '../../../shared/config/store';
import { formatBRL, toCents } from '../../../shared/lib/money';
import { acaiPriceCents } from '../model/order';

interface AcaiBuilderModalProps {
  item: MenuItem;
  onClose: () => void;
  onAddToCart: (cartItem: { name: string; unitCents: number; details: string }) => void;
}

/* Modal de montagem; o preço final aparece discriminado antes de adicionar. */
export const AcaiBuilderModal = ({ item, onClose, onAddToCart }: AcaiBuilderModalProps) => {
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [hasWhey, setHasWhey] = useState(false);

  const extras = Math.max(0, selectedToppings.length - STORE.freeToppings);
  const finalCents = acaiPriceCents(toCents(item.price), selectedToppings.length, hasWhey);

  /* Liga ou desliga um acompanhamento. */
  const toggleTopping = (topping: string) => {
    setSelectedToppings((current) =>
      current.includes(topping) ? current.filter((t) => t !== topping) : [...current, topping],
    );
  };

  /* Adiciona o copo ao carrinho com os detalhes da montagem. */
  const confirm = () => {
    const details = [
      `Acompanhamentos: ${selectedToppings.join(', ') || 'nenhum'}`,
      extras > 0 ? `${extras} adicional(is)` : '',
      hasWhey ? 'com whey' : '',
    ].filter(Boolean).join(' | ');
    onAddToCart({ name: item.name, unitCents: finalCents, details });
    onClose();
  };

  return (
    <Dialog titleId="acai-title" onClose={onClose} className="max-w-lg">
      <div className="flex justify-between items-start pb-4 border-b border-zinc-800">
        <div>
          <h2 id="acai-title" className="text-xl font-black text-white">{item.name}</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            {STORE.freeToppings} acompanhamentos inclusos; a partir do {STORE.freeToppings + 1}º, {formatBRL(STORE.extraToppingCents)} cada.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="p-2 rounded-full bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="overflow-y-auto py-4 space-y-4 pr-1">
        <fieldset>
          <legend className="w-full flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Acompanhamentos</span>
            <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-brand-yellow font-mono" aria-live="polite">
              {selectedToppings.length} selecionado(s)
            </span>
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {acaiToppings.map((topping) => {
              const isSelected = selectedToppings.includes(topping);
              return (
                <button
                  type="button"
                  key={topping}
                  aria-pressed={isSelected}
                  onClick={() => toggleTopping(topping)}
                  className={`p-3 rounded-2xl text-xs font-medium text-left transition-all flex items-center justify-between border ${isSelected
                    ? 'bg-purple-950/60 border-purple-400 text-purple-100'
                    : 'bg-zinc-800/50 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                    }`}
                >
                  <span>{topping}</span>
                  {isSelected && <Check size={14} className="text-purple-300" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="pt-2 border-t border-zinc-800">
          <button
            type="button"
            aria-pressed={hasWhey}
            onClick={() => setHasWhey((value) => !value)}
            className={`w-full p-3.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between border ${hasWhey
              ? 'bg-amber-950/60 border-amber-400 text-amber-100'
              : 'bg-zinc-800/50 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
              }`}
          >
            <span>Adicional de whey no açaí (+{formatBRL(STORE.wheyCents)})</span>
            <span className={`w-5 h-5 rounded-full border flex items-center justify-center ${hasWhey ? 'bg-amber-400 border-amber-400 text-zinc-950' : 'border-zinc-500'}`}>
              {hasWhey && <Check size={12} aria-hidden="true" />}
            </span>
          </button>
        </div>
      </div>

      <div className="pt-4 border-t border-zinc-800 flex items-center justify-between mt-auto gap-4">
        <div>
          <span className="text-xs text-zinc-400 block">Valor final</span>
          <span className="text-xl font-black text-brand-green font-mono" aria-live="polite">{formatBRL(finalCents)}</span>
          {extras > 0 && <span className="text-[11px] text-zinc-400 block">inclui {extras} adicional(is)</span>}
        </div>
        <button
          type="button"
          onClick={confirm}
          className="bg-amber-400 hover:bg-amber-500 text-zinc-950 px-6 py-3 rounded-2xl font-black text-xs transition-all flex items-center gap-1.5"
        >
          <Plus size={16} aria-hidden="true" /> Adicionar ao pedido
        </button>
      </div>
    </Dialog>
  );
};
/* fim de AcaiBuilderModal.tsx */
