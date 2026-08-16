import { useState } from 'react';
import { menuData, type MenuItem } from '../../entities/menu/model/menu.data';
import { AcaiBuilderModal } from '../../features/order/ui/AcaiBuilderModal';
import { supabase } from '../../shared/api/supabase';
import { ShoppingBag, Utensils, Sparkles, PhoneCall, Check, ChevronRight, Flame, Coffee, Sandwich, Star, Home, PartyPopper } from 'lucide-react';

interface CartItem {
  name: string;
  price: number;
  details: string;
}

export const CardapioPage = () => {
  const [selectedAcai, setSelectedAcai] = useState<MenuItem | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Estados do Formulário de Checkout
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'retirada'>('delivery');
  const [address, setAddress] = useState('');

  const filteredItems = activeCategory === 'all'
    ? menuData
    : menuData.filter(item => item.category === activeCategory);

  const handleAddToCart = (item: CartItem) => {
    setCart([...cart, item]);
  };

  const handleQuickAdd = (item: MenuItem) => {
    if (item.category === 'acai') {
      setSelectedAcai(item);
    } else {
      handleAddToCart({
        name: item.name,
        price: item.price,
        details: item.description || 'Item tradicional'
      });
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const sendWhatsAppOrder = async () => {
    if (cart.length === 0) return;

    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Por favor, informe seu Nome e Telefone/WhatsApp.');
      return;
    }
    if (deliveryType === 'delivery' && !address.trim()) {
      alert('Por favor, informe o endereço completo e referência para a entrega.');
      return;
    }

    // 1. Salvar o pedido no banco de dados do Supabase
    try {
      const { error } = await supabase.from('orders').insert([
        {
          customer_name: customerName,
          customer_phone: customerPhone,
          delivery_type: deliveryType,
          address: deliveryType === 'delivery' ? address : 'Retirada no Balcão',
          items: cart,
          total_amount: totalPrice,
        }
      ]);

      if (error) {
        console.error('Erro ao registrar pedido no banco:', error);
      }
    } catch (err) {
      console.error('Falha de conexão ao salvar pedido:', err);
    }

    // 2. Montar mensagem formatada e abrir o WhatsApp
    const phoneNumber = '5532988367667'; // Substitua pelo número real da Garagem
    let text = `*NOVO PEDIDO - GARAGEM LANCHES* 🍔\n\n`;
    text += `👤 *Cliente:* ${customerName}\n`;
    text += `📞 *WhatsApp:* ${customerPhone}\n`;
    text += `📍 *Tipo:* ${deliveryType === 'delivery' ? 'Entrega em Casa' : 'Retirada no Balcão'}\n`;

    if (deliveryType === 'delivery') {
      text += `🏠 *Endereço/Referência:* ${address}\n`;
    }

    text += `\n*ITENS DO PEDIDO:*\n`;
    cart.forEach((item, index) => {
      text += `${index + 1}. *${item.name}* - R$ ${item.price.toFixed(2)}\n`;
      if (item.details) text += `   _Obs: ${item.details}_\n`;
    });

    text += `\n💰 *TOTAL A PAGAR: R$ ${totalPrice.toFixed(2)}*`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${phoneNumber}?text=${encoded}`, '_blank');

    // 3. Resetar estado, limpar carrinho e exibir tela de sucesso
    setCart([]);
    setIsCheckoutOpen(false);
    setOrderSuccess(true);
  };

  const categories = [
    { id: 'all', label: 'Todos', icon: Flame },
    { id: 'acai', label: 'Açaís', icon: Sparkles },
    { id: 'salgados', label: 'Salgados', icon: Utensils },
    { id: 'sanduiches', label: 'Sanduíches', icon: Sandwich },
    { id: 'combos', label: 'Combos', icon: Star },
    { id: 'bebidas', label: 'Sucos e Vitaminas', icon: Coffee },
    { id: 'takeaway', label: 'Para Casa', icon: Home },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 pb-32 selection:bg-amber-400 selection:text-zinc-950">

      {/* HEADER PREMIUM */}
      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-zinc-950 font-black text-xl shadow-lg shadow-amber-500/20">
              G
            </div>
            <div>
              <h1 className="text-lg font-black tracking-wider text-white">GARAGEM <span className="text-amber-400">LANCHES</span></h1>
              <p className="text-[11px] text-zinc-400 flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Aberto • Feito na hora
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/5532988367667?text=Olá!%20Gostaria%20de%20tirar%20dúvidas%20sobre%20o%20cardápio."
            target="_blank"
            rel="noreferrer"
            className="bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 p-2.5 rounded-2xl text-emerald-400 transition-all flex items-center gap-2 text-xs font-bold"
          >
            <PhoneCall size={16} /> <span className="hidden sm:inline">Suporte</span>
          </a>
        </div>
      </header>

      {/* MODAL DE SUCESSO APÓS O ENVIO */}
      {orderSuccess && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-zinc-900 border border-amber-400/30 w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 bg-amber-400/10 border border-amber-400/30 rounded-full flex items-center justify-center mx-auto text-amber-400">
              <PartyPopper size={32} />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Pedido Enviado com Sucesso!</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Seu pedido foi registrado e enviado para o nosso WhatsApp. Já estamos preparando tudo com capricho!
              </p>
            </div>
            <button
              onClick={() => {
                setOrderSuccess(false);
                setCustomerName('');
                setCustomerPhone('');
                setAddress('');
              }}
              className="w-full bg-amber-400 hover:bg-amber-500 text-zinc-950 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20"
            >
              Fazer Novo Pedido
            </button>
          </div>
        </div>
      )}

      {/* CARROSSEL DE CATEGORIAS */}
      <nav className="sticky top-[73px] z-30 bg-[#09090b]/95 backdrop-blur border-b border-zinc-800/60 py-3 px-4">
        <div className="max-w-4xl mx-auto flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${isActive
                    ? 'bg-amber-400 border-amber-400 text-zinc-950 shadow-lg shadow-amber-500/20 scale-105'
                    : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
              >
                <Icon size={14} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* GRID DE PRODUTOS */}
      <main className="max-w-4xl mx-auto px-4 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 rounded-3xl p-5 transition-all flex flex-col justify-between group shadow-xl"
            >
              <div>
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                    {item.name}
                  </h3>
                  <span className="font-mono text-sm font-black text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-xl">
                    R$ {item.price.toFixed(2)}
                  </span>
                </div>
                {item.description && (
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-800/60 flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold">
                  {item.category === 'acai' ? 'Artesanal customizável' : 'Pronto para consumo'}
                </span>
                <button
                  onClick={() => handleQuickAdd(item)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${item.category === 'acai'
                      ? 'bg-purple-950/80 border border-purple-500/50 text-purple-200 hover:bg-purple-900 shadow-lg shadow-purple-950/50'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-zinc-950 shadow-lg shadow-emerald-500/20'
                    }`}
                >
                  <Sparkles size={14} />
                  {item.category === 'acai' ? 'Montar Copo' : 'Adicionar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL DE MONTAGEM DE AÇAÍ */}
      {selectedAcai && (
        <AcaiBuilderModal
          item={selectedAcai}
          onClose={() => setSelectedAcai(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* BARRA INFERIOR FLUTUANTE (CARRINHO) */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800 p-4 animate-slide-up">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-400 text-zinc-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/30">
                <ShoppingBag size={20} />
              </div>
              <div>
                <span className="text-xs text-zinc-400 block font-medium">{cart.length} iten(s) no pedido</span>
                <span className="text-lg font-black text-white font-mono">R$ {totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="bg-amber-400 hover:bg-amber-500 text-zinc-950 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2"
            >
              Finalizar Pedido <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE CHECKOUT COM DADOS DO CLIENTE */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-black text-white mb-4">Finalizar Pedido</h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Seu Nome Completo *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ex: João da Silva"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">WhatsApp / Telefone *</label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="(32) 99999-9999"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Tipo de Atendimento:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setDeliveryType('delivery')}
                    className={`py-2.5 rounded-2xl text-xs font-bold border transition-all ${deliveryType === 'delivery'
                        ? 'bg-amber-400 border-amber-400 text-zinc-950'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                      }`}
                  >
                    Entrega em Casa
                  </button>
                  <button
                    onClick={() => setDeliveryType('retirada')}
                    className={`py-2.5 rounded-2xl text-xs font-bold border transition-all ${deliveryType === 'retirada'
                        ? 'bg-amber-400 border-amber-400 text-zinc-950'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                      }`}
                  >
                    Retirada no Balcão
                  </button>
                </div>
              </div>

              {deliveryType === 'delivery' && (
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Endereço Completo e Referência *</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Rua, Número, Bairro e Ponto de Referência"
                    rows={3}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl p-3 text-sm text-white focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>
              )}

              <div className="bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800 space-y-2">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Resumo dos Itens:</span>
                <div className="max-h-32 overflow-y-auto space-y-1 text-xs">
                  {cart.map((c, i) => (
                    <div key={i} className="flex justify-between text-zinc-300">
                      <span>{c.name}</span>
                      <span className="font-mono text-amber-400">R$ {c.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-zinc-800 flex justify-between font-black text-sm">
                  <span>Total Geral:</span>
                  <span className="text-amber-400 font-mono">R$ {totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-3 rounded-2xl text-xs font-bold transition-all"
              >
                Continuar Comprando
              </button>
              <button
                onClick={sendWhatsAppOrder}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 py-3 rounded-2xl text-xs font-black transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5"
              >
                <Check size={16} /> Enviar no WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};