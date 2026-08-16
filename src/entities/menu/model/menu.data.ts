export interface MenuItem {
  id: string;
  name: string;
  category: 'acai' | 'salgados' | 'sanduiches' | 'combos' | 'bebidas' | 'takeaway';
  price: number;
  description?: string;
}

export const menuData: MenuItem[] = [
  // Açaís
  { id: 'acai-300', name: 'Açaí 300ml', category: 'acai', price: 17.90, description: 'Artesanal feito na hora com direito a 3 acompanhamentos em camadas.' },
  { id: 'acai-400', name: 'Açaí 400ml', category: 'acai', price: 21.90, description: 'Artesanal feito na hora com direito a 3 acompanhamentos em camadas.' },
  { id: 'acai-500', name: 'Açaí 500ml', category: 'acai', price: 24.90, description: 'Artesanal feito na hora com direito a 3 acompanhamentos em camadas.' },
  { id: 'acai-700', name: 'Açaí 700ml', category: 'acai', price: 26.90, description: 'Artesanal feito na hora com direito a 3 acompanhamentos em camadas.' },
  
  // Salgados
  { id: 'salgado-1', name: 'Esfirra Frango c/ Catupiry', category: 'salgados', price: 9.50 },
  { id: 'salgado-2', name: 'Esfirra Carne', category: 'salgados', price: 9.50 },
  { id: 'salgado-3', name: 'Coxinha Frango c/ Catupiry', category: 'salgados', price: 9.50 },
  { id: 'salgado-4', name: 'Pastel Integral Frango', category: 'salgados', price: 9.50 },
  { id: 'salgado-5', name: 'Cigarrete (Presunto e Queijo)', category: 'salgados', price: 9.50 },
  { id: 'salgado-6', name: 'Enrolado (Presunto, Queijo e Tomate)', category: 'salgados', price: 9.50 },
  { id: 'salgado-7', name: 'Pastel Gaúcho (Frango c/ Bacon e Catupiry)', category: 'salgados', price: 9.50 },

  // Sanduíches Naturais e Sírios
  { id: 'sand-1', name: 'Sanduíche Natural - Frango c/ Milho', category: 'sanduiches', price: 11.90 },
  { id: 'sand-2', name: 'Sanduíche Natural - Frango c/ Cenoura', category: 'sanduiches', price: 11.90 },
  { id: 'sand-3', name: 'Sanduíche Natural - Frango c/ Ricota', category: 'sanduiches', price: 11.90 },
  { id: 'sand-4', name: 'Sanduíche Natural - Peito de Peru, Ricota e Salada', category: 'sanduiches', price: 11.90 },
  { id: 'sand-5', name: 'Sanduíche Sírio - Frango c/ Palmito', category: 'sanduiches', price: 11.90 },
  { id: 'sand-6', name: 'Sanduíche Sírio - Frango, Tomate Seco, Passas e Salada', category: 'sanduiches', price: 11.90 },

  // Sucos e Vitaminas
  { id: 'suco-1', name: 'Suco ou Vitamina - Morango', category: 'bebidas', price: 11.90 },
  { id: 'suco-2', name: 'Suco ou Vitamina - Frutas Vermelhas', category: 'bebidas', price: 11.90 },
  { id: 'suco-3', name: 'Suco ou Vitamina - Maracujá', category: 'bebidas', price: 11.90 },
  { id: 'suco-4', name: 'Suco ou Vitamina - Limão', category: 'bebidas', price: 11.90 },
  { id: 'suco-5', name: 'Suco ou Vitamina - Banana', category: 'bebidas', price: 11.90 },

  // Combos
  { id: 'combo-1', name: 'Combo 1: Salgado + Guaraná Natural (300ml) + Maionese', category: 'combos', price: 13.00 },
  { id: 'combo-2', name: 'Combo 2: Salgado + Guaraná Natural (500ml) + Maionese', category: 'combos', price: 14.00 },
  { id: 'combo-3', name: 'Combo 3: Sanduíche + Guaraná Natural (300ml) + Maionese', category: 'combos', price: 14.00 },
  { id: 'combo-4', name: 'Combo 4: Sanduíche + Guaraná Natural (500ml) + Maionese', category: 'combos', price: 15.00 },

  // Takeaway (Para Fazer em Casa)
  { id: 'take-1', name: 'Açaí 1 Litro', category: 'takeaway', price: 39.00, description: 'Leve para casa e aproveite a qualidade Garagem.' },
  { id: 'take-2', name: 'Açaí Barra 1 Kg', category: 'takeaway', price: 29.00, description: 'Barra tradicional de açaí.' },
  { id: 'take-3', name: 'Xarope de Guaraná 500ml', category: 'takeaway', price: 9.00 },
  { id: 'take-4', name: 'Xarope de Guaraná 5 Litros', category: 'takeaway', price: 65.00 },
  { id: 'take-5', name: 'Granola 1 Kg', category: 'takeaway', price: 39.00 },
];

export const acaiToppings = [
  'Leite em Pó', 'Granola', 'Paçoca', 'Leite Condensado', 'Chocoball', 'Mel',
  'Morango Picado', 'Banana Picada', 'Ovomaltine', 'Confete', 'Calda de Chocolate', 'Chantily'
];