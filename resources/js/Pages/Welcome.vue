<script setup>
import { ref, computed } from "vue";
import { Head } from "@inertiajs/vue3";

const props = defineProps({
    categories: Array,
});

// Estado do Carrinho e UI
const cart = ref([]);
const isBuilderOpen = ref(false);
const selectedProduct = ref(null);

// Dados dos acompanhamentos (Podem vir do banco no futuro, mas fixamos para o MVP)
const toppings = [
    "Leite em pó",
    "Granola",
    "Paçoca",
    "Ovomaltine",
    "Chocoball",
    "Confete",
    "Morango",
    "Banana",
    "Calda de Chocolate",
    "Mel",
    "Leite Condensado",
    "Chantilly",
];
const selectedToppings = ref([]);

// Lógica de Seleção de Acompanhamentos
const toggleTopping = (topping) => {
    const index = selectedToppings.value.indexOf(topping);
    if (index > -1) {
        selectedToppings.value.splice(index, 1);
    } else if (selectedToppings.value.length < 3) {
        selectedToppings.value.push(topping);
    }
};

// Abrir Modal de Montagem ou Adicionar Direto (se não for Açaí)
const handleProductClick = (product) => {
    if (
        product.name.toLowerCase().includes("açaí") ||
        product.name.toLowerCase().includes("acai")
    ) {
        selectedProduct.value = product;
        selectedToppings.value = [];
        isBuilderOpen.value = true;
    } else {
        addToCart(product);
    }
};

const addToCart = (product, isCustom = false) => {
    const item = {
        ...product,
        id_unique: Date.now(), // ID temporário para o carrinho
        custom_toppings: isCustom ? [...selectedToppings.value] : [],
    };
    cart.value.push(item);

    // Fechar modal se estiver aberto
    isBuilderOpen.value = false;
    selectedProduct.value = null;
};

// Cálculo do Total do Carrinho
const cartTotal = computed(() => {
    return cart.value
        .reduce((total, item) => total + parseFloat(item.price), 0)
        .toFixed(2);
});

// Formatar mensagem para WhatsApp
const sendToWhatsApp = () => {
    let message = `*Novo Pedido - Açaí Garagem*%0A%0A`;
    cart.value.forEach((item, index) => {
        message += `${index + 1}. *${item.name}* - R$ ${item.price}%0A`;
        if (item.custom_toppings.length > 0) {
            message += `   _Acomp: ${item.custom_toppings.join(", ")}_%0A`;
        }
    });
    message += `%0A*Total: R$ ${cartTotal.value}*`;

    const phone = "5511999999999"; // Substitua pelo número da Garagem
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
};
</script>

<template>
    <Head title="Açaí Garagem | Catálogo Digital" />

    <div class="min-h-screen bg-gray-50 pb-24">
        <!-- HEADER STICKY -->
        <header class="sticky top-0 z-50 bg-[#6B2D8E] text-white shadow-md">
            <div
                class="max-w-4xl mx-auto p-4 flex justify-between items-center"
            >
                <div class="flex items-center gap-2">
                    <span class="text-2xl">🟣</span>
                    <h1 class="font-black tracking-tight text-xl">
                        AÇAÍ GARAGEM
                    </h1>
                </div>
                <div
                    class="bg-[#2EAD5E] px-4 py-1 rounded-full font-bold text-sm flex items-center gap-2"
                >
                    <span>🛒</span> {{ cart.length }} itens
                </div>
            </div>
        </header>

        <!-- LISTAGEM DE PRODUTOS -->
        <main class="max-w-4xl mx-auto p-4">
            <div
                v-for="category in categories"
                :key="category.id"
                class="mb-10"
            >
                <div class="flex items-center gap-3 mb-4">
                    <div class="h-8 w-2 bg-[#2EAD5E] rounded-full"></div>
                    <h2
                        class="text-2xl font-black text-gray-800 uppercase italic"
                    >
                        {{ category.name }}
                    </h2>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                        v-for="product in category.products"
                        :key="product.id"
                        @click="handleProductClick(product)"
                        class="bg-white border-2 border-transparent hover:border-[#6B2D8E] p-4 rounded-3xl shadow-sm transition-all cursor-pointer flex justify-between items-center group active:scale-95"
                    >
                        <div class="flex-1">
                            <h3
                                class="font-bold text-lg text-gray-700 group-hover:text-[#6B2D8E]"
                            >
                                {{ product.name }}
                            </h3>
                            <p class="text-sm text-gray-400 leading-tight">
                                {{
                                    product.description ||
                                    "Produto artesanal fresquinho"
                                }}
                            </p>
                        </div>
                        <div class="text-right">
                            <span
                                class="block font-black text-[#2EAD5E] text-lg"
                                >R$ {{ product.price }}</span
                            >
                            <span
                                class="text-[10px] bg-gray-100 px-2 py-1 rounded-lg uppercase font-bold text-gray-500"
                                >Adicionar</span
                            >
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- VISUAL BUILDER (MODAL) -->
        <Transition name="fade">
            <div
                v-if="isBuilderOpen"
                class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-end md:items-center justify-center p-0 md:p-4"
            >
                <div
                    class="bg-white w-full max-w-md rounded-t-[3rem] md:rounded-[3rem] p-8 shadow-2xl relative"
                >
                    <button
                        @click="isBuilderOpen = false"
                        class="absolute top-6 right-6 text-gray-400"
                    >
                        ✕
                    </button>

                    <h2 class="text-2xl font-black text-[#6B2D8E] mb-1">
                        MONTE SEU COPO
                    </h2>
                    <p class="text-gray-500 mb-6 text-sm">
                        Selecione até 3 acompanhamentos gratuitos para seu
                        <b>{{ selectedProduct?.name }}</b
                        >.
                    </p>

                    <div
                        class="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto mb-6 pr-2"
                    >
                        <button
                            v-for="topping in toppings"
                            :key="topping"
                            @click="toggleTopping(topping)"
                            :class="
                                selectedToppings.includes(topping)
                                    ? 'bg-[#6B2D8E] text-white border-[#6B2D8E]'
                                    : 'bg-gray-50 text-gray-600 border-gray-100'
                            "
                            class="p-3 rounded-2xl text-xs font-bold border-2 transition-all flex items-center justify-center text-center"
                        >
                            {{ topping }}
                        </button>
                    </div>

                    <div class="flex items-center justify-between mb-6">
                        <span class="text-sm font-bold text-gray-400">
                            Selecionados:
                            <span
                                :class="
                                    selectedToppings.length === 3
                                        ? 'text-[#2EAD5E]'
                                        : 'text-orange-500'
                                "
                            >
                                {{ selectedToppings.length }} / 3
                            </span>
                        </span>
                        <span class="font-black text-xl text-[#2EAD5E]"
                            >R$ {{ selectedProduct?.price }}</span
                        >
                    </div>

                    <button
                        @click="addToCart(selectedProduct, true)"
                        :disabled="selectedToppings.length === 0"
                        class="w-full bg-[#2EAD5E] disabled:bg-gray-300 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-[#2ead5e]/30 transition-all active:scale-95"
                    >
                        ADICIONAR AO CARRINHO
                    </button>
                </div>
            </div>
        </Transition>

        <!-- BARRA DE FINALIZAÇÃO (CARRINHO) -->
        <div
            v-if="cart.length > 0"
            class="fixed bottom-6 left-4 right-4 max-w-4xl mx-auto z-40"
        >
            <button
                @click="sendToWhatsApp"
                class="w-full bg-[#2EAD5E] text-white p-4 rounded-2xl shadow-2xl flex justify-between items-center animate-bounce-subtle"
            >
                <div class="flex items-center gap-3">
                    <span class="bg-white/20 p-2 rounded-xl text-xl">✅</span>
                    <div class="text-left">
                        <span
                            class="block text-xs font-bold uppercase opacity-80"
                            >Finalizar Pedido</span
                        >
                        <span class="font-black text-lg"
                            >ENVIAR PARA WHATSAPP</span
                        >
                    </div>
                </div>
                <span class="font-black text-xl">R$ {{ cartTotal }}</span>
            </button>
        </div>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

@keyframes bounce-subtle {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-5px);
    }
}
.animate-bounce-subtle {
    animation: bounce-subtle 3s infinite ease-in-out;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
    width: 4px;
}
::-webkit-scrollbar-track {
    background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
    background: #6b2d8e;
    border-radius: 10px;
}
</style>
