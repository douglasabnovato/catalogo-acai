import { useState } from 'react';
import { type MenuItem, acaiToppings } from '../../../../src/entities/menu/model/menu.data';
import { X, Check, Plus } from 'lucide-react';

interface AcaiBuilderModalProps {
  item: MenuItem;
  onClose: () => void;
  onAddToCart: (cartItem: { name: string; price: number; details: string }) => void;
}

export const AcaiBuilderModal = ({ item, onClose, onAddToCart }: AcaiBuilderModalProps) => {
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [hasWhey, setHasWhey] = useState(false);

  const WHEY_PRICE = 9.00;
  const freeToppingsLimit = 3;

  const handleToggleTopping = (topping: string) => {
    if (selectedToppings.includes(topping)) {
      setSelectedToppings(selectedToppings.filter(t => t !== topping));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const extraToppingsCount = Math.max(0, selectedToppings.length - freeToppingsLimit);
  const extraToppingsCost = extraToppingsCount * 2.00; // Exemplo de custo por adicional extra se necessário
  const finalPrice = item.price + (hasWhey ? WHEY_PRICE : 0) + extraToppingsCost;

  const handleConfirm = () => {
    const detailsList = [
      `Acompanhamentos (${selectedToppings.length}): ${selectedToppings.join(', ') || 'Nenhum'}`,
      hasWhey ? 'Com Adicional de Whey (+R$ 9,00)' : ''
    ].filter(Boolean).join(' | ');

    onAddToCart({
      name: item.name,
      price: finalPrice,
      details: detailsList
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header do Modal */}
        <div className="flex justify-between items-start pb-4 border-b border-zinc-800">
          <div>
            <h2 className="text-xl font-black text-white">{item.name}</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Escolha até {freeToppingsLimit} acompanhamentos inclusos em camadas</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Corpo com rolagem */}
        <div className="overflow-y-auto py-4 space-y-4 pr-1">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Acompanhamentos</span>
              <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-brand-yellow font-mono">
                {selectedToppings.length} selecionado(s)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {acaiToppings.map(topping => {
                const isSelected = selectedToppings.includes(topping);
                return (
                  <button
                    key={topping}
                    onClick={() => handleToggleTopping(topping)}
                    className={`p-3 rounded-2xl text-xs font-medium text-left transition-all flex items-center justify-between border ${isSelected
                      ? 'bg-purple-950/60 border-purple-500 text-purple-200 shadow-lg shadow-purple-900/20'
                      : 'bg-zinc-800/50 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                      }`}
                  >
                    <span>{topping}</span>
                    {isSelected && <Check size={14} className="text-purple-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Adicional de Whey */}
          <div className="pt-2 border-t border-zinc-800">
            <button
              onClick={() => setHasWhey(!hasWhey)}
              className={`w-full p-3.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between border ${hasWhey
                ? 'bg-amber-950/60 border-amber-500 text-amber-200'
                : 'bg-zinc-800/50 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                }`}
            >
              <span>Adicional de Whey no Açaí (+R$ 9,00)</span>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${hasWhey ? 'bg-amber-500 border-amber-500 text-zinc-950' : 'border-zinc-600'}`}>
                {hasWhey && <Check size={12} />}
              </div>
            </button>
          </div>
        </div>

        {/* Footer do Modal */}
        <div className="pt-4 border-t border-zinc-800 flex items-center justify-between mt-auto">
          <div>
            <span className="text-xs text-zinc-400 block">Valor Final</span>
            <span className="text-xl font-black text-brand-green font-mono">R$ {finalPrice.toFixed(2)}</span>
          </div>
          <button
            onClick={handleConfirm}
            className="bg-amber-400 hover:bg-amber-500 text-zinc-950 px-6 py-3 rounded-2xl font-black text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={16} /> Adicionar ao Pedido
          </button>
        </div>

      </div>
    </div>
  );
};