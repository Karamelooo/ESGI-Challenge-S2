<template>
    <div class="payment-container">
      <div class="payment-box">
        <h1 class="payment-title">Finalisez votre paiement</h1>
        <p class="payment-description">Entrez vos coordonnées bancaires ci-dessous pour procéder au paiement.</p>
  
        <form @submit.prevent="handlePayment">
          <div id="card-element" class="card-element"></div>
          <p v-if="paymentError" class="error">{{ paymentError }}</p>
  
          <button
            type="submit"
            class="payment-button"
            :disabled="isProcessing"
          >
            <span v-if="isProcessing" class="loader"></span>
            <span v-else>Payer {{ cartStore.total }}€</span>
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { loadStripe, type StripeCardElement, type StripeElements } from '@stripe/stripe-js';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';

const route = useRoute();
const baseUrl = import.meta.env.VITE_BACK_APP_URL;
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const cartStore = useCartStore();
cartStore.fetchCart();
  // à ajouter: publishable key
  const stripePromise = loadStripe(stripePublicKey);
  const amount = ref(parseFloat(route.query.amount as string) || 0);
  
  const isProcessing = ref(false);
  const paymentError = ref<string | null>(null);
  const elements = ref<StripeElements | null>(null);
  const cardElement = ref<StripeCardElement | null>(null);
  
  const router = useRouter();
  
  onMounted(async () => {
    const stripe = await stripePromise;
    if (stripe) {
      elements.value = stripe.elements();
      cardElement.value = elements.value.create('card');
      cardElement.value.mount('#card-element');
    }
  });
  
  const handlePayment = async () => {
    isProcessing.value = true;
    paymentError.value = null;
  
    try {
      const stripe = await stripePromise;
  
      if (!stripe) {
        throw new Error('Stripe failed to load.');
      }
  
      console.log(baseUrl)
      const { data } = await axios.post(`${baseUrl}/payment/create-payment-intent`, {
        amount: cartStore.total * 100,
        currency: 'eur',
      });
  
      const { clientSecret } = data;
  
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement.value!,
        },
      });
  
      if (result.error) {
        paymentError.value = result.error.message || 'An unknown error occurred.';
      } else if (result.paymentIntent?.status === 'succeeded') {
        try {
          await axios.post(`${baseUrl}/orders/create`, {
            products: cartStore.items.map(item => ({
              productId: item.id,
              quantity: item.quantity
            })),
            totalAmount: cartStore.total,
            shippingAddress: "À remplir",
            postalCode: "À remplir" 
          });

          await cartStore.clearCart();

          alert('Paiement réussi et commande créée !');
          router.push('/orders');
        } catch (error) {
          console.error('Erreur lors de la création de la commande:', error);
          paymentError.value = "Erreur lors de la création de la commande";
        }
      }
    } catch (error) {
      paymentError.value = (error as Error).message;
    } finally {
      isProcessing.value = false;
    }
  };
  </script>
  
  <style>
  .payment-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f4f4f9;
  }
  
  .payment-box {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 100%;
  }
  
  .payment-title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
  }
  
  .payment-description {
    font-size: 14px;
    color: #666;
    margin-bottom: 20px;
  }
  
  .card-element {
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
    background-color: #f9f9f9;
  }
  
  .error {
    color: red;
    font-size: 14px;
    margin-bottom: 10px;
  }
  
  .payment-button {
    width: 100%;
    background-color: #007bff;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    transition: background-color 0.3s ease;
  }
  
  .payment-button:hover {
    background-color: #0056b3;
  }
  
  .payment-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .loader {
    border: 3px solid #f3f3f3;
    border-top: 3px solid #007bff;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    animation: spin 1s linear infinite;
    display: inline-block;
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  </style>
  