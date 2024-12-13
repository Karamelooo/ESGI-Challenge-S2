<template>
  <div class="payment-container">
    <div class="payment-box">
      <h1 class="payment-title">Paiement Sécurisé</h1>
      <p class="payment-description">
        Complétez les informations ci-dessous pour effectuer votre paiement.
      </p>

      <form @submit.prevent="handlePayment">
        <!-- Field for Product Name -->
        <label for="productName">Nom du produit :</label>
        <input
          id="productName"
          v-model="productName"
          type="text"
          placeholder="Ex : Abonnement premium"
          required
        />

        <!-- Field for Amount -->
        <label for="amount">Montant (€) :</label>
        <input
          id="amount"
          v-model.number="amount"
          type="number"
          placeholder="Ex : 20.00"
          min="1"
          required
        />

        <!-- Stripe Card Element -->
        <label for="card-element">Informations de la carte :</label>
        <div id="card-element" class="card-element"></div>
        <p v-if="paymentError" class="error">{{ paymentError }}</p>

        <!-- Submit Button -->
        <button
          type="submit"
          class="payment-button"
          :disabled="isProcessing"
        >
          <span v-if="isProcessing" class="loader"></span>
          <span v-else>Payer</span>
        </button>
      </form>

      <!-- Display Invoice URL -->
      <div v-if="invoiceUrl" class="invoice-display">
        <p>Votre facture :</p>
        <a :href="invoiceUrl" target="_blank">Voir la facture</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { loadStripe, type StripeCardElement, type StripeElements } from '@stripe/stripe-js';
import axios from 'axios';
import { onMounted, ref } from 'vue';

const stripePromise = loadStripe('pk_test_your_publishable_key'); // Replace with your actual publishable key

// State Variables
const productName = ref('');
const amount = ref<number | null>(null);
const invoiceUrl = ref<string | null>(null);
const isProcessing = ref(false);
const paymentError = ref<string | null>(null);
const elements = ref<StripeElements | null>(null);
const cardElement = ref<StripeCardElement | null>(null);

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

  if (!productName.value || !amount.value) {
    paymentError.value = 'Veuillez remplir tous les champs.';
    isProcessing.value = false;
    return;
  }

  try {
    const stripe = await stripePromise;

    if (!stripe) {
      throw new Error('Stripe n\'a pas pu être chargé.');
    }

    // Call your backend to create the payment intent
    const { data } = await axios.post('http://localhost:8080/create-payment-intent', {
      amount: amount.value * 100, // Convert to cents
      currency: 'eur',
      productName: productName.value,
      userId: 'test-user-id', // Replace with actual user ID
    });

    const { clientSecret, invoiceUrl: backendInvoiceUrl } = data;

    // Confirm the payment
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement.value!,
      },
    });

    if (result.error) {
      paymentError.value = result.error.message || 'Une erreur inconnue s\'est produite.';
    } else if (result.paymentIntent?.status === 'succeeded') {
      alert('Paiement réussi !');
      invoiceUrl.value = backendInvoiceUrl; // Store the invoice URL for display
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

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
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

.invoice-display {
  margin-top: 15px;
  font-size: 14px;
}

.invoice-display a {
  color: #007bff;
  text-decoration: underline;
  font-weight: bold;
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
