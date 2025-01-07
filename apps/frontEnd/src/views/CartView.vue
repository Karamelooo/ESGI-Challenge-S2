<template>
    <div>
      <h1>Votre Panier</h1>
      <div v-if="cartStore.items.length === 0">Votre panier est vide</div>
      <div v-else>
        <div v-for="item in cartStore.items" :key="item.id">
          <h3>{{ item.name }}</h3>
          <p>Prix: €{{ item.price }} x {{ item.quantity }}</p>
          <button @click="cartStore.removeFromCart(item.id)">Retirer</button>
        </div>
        <h2>Total: €{{ cartStore.total }}</h2>
        <button @click="cartStore.clearCart">Vider le panier</button>
        <button @click="goToPayment">Payer</button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useCartStore } from '@/stores/cart';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
  const router = useRouter();
  const cartStore = useCartStore();
  cartStore.fetchCart();
  const total = computed(() => cartStore.total);

const goToPayment = () => {
  router.push({ name: 'PaymentPage', query: { amount: total.value } });
};
  </script>