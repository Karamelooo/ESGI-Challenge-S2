<script setup lang="ts">
import Form from '@/forms/Form.vue'
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const products = ref<Product[]>([])
interface Product {
  _id: string
  name: string
  description?: string
  images?: string[]
  stock: number
  price: number
}

const baseUrl = import.meta.env.VITE_BACK_APP_URL

async function fetchProducts() {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACK_APP_URL}/products`)
    products.value = response.data
  }
  catch (error) {
    console.error('Erreur lors de la récupération des produits:', error)
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div>
    <h1>Gestion des Produits</h1>
    <div>
      <h2>Liste des produits</h2>
      <div v-if="products.length" class="products-grid">
        <div v-for="product in products" :key="product._id" class="product-card">
          <h3>{{ product.name }}</h3>
          <p>{{ product.description }}</p>
          <p>Prix: {{ product.price }}€</p>
          <p>Stock: {{ product.stock }}</p>
          <div v-if="product.images && product.images.length">
            <img style="width: 100px; height: 100px;" :src="`${baseUrl}${product.images[0]}`" :alt="product.name">
          </div>
        </div>
      </div>
      <p v-else>
        Aucun produit disponible
      </p>
    </div>
  </div>
</template>
