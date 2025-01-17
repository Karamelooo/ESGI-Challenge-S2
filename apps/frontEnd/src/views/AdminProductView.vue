<script setup lang="ts">
import Form from '@/forms/Form.vue'
import api from '@/services/api'
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

const editingProduct = ref<Product | null>(null)
const baseUrl = import.meta.env.VITE_BACK_APP_URL

const productFields = [
  {
    name: 'name',
    type: 'text',
    label: 'Nom',
    required: true,
  },
  {
    name: 'description',
    type: 'textarea',
    label: 'Description',
  },
  {
    name: 'price',
    type: 'number',
    label: 'Prix',
    required: true,
  },
  {
    name: 'stock',
    type: 'number',
    label: 'Stock',
    required: true,
  },
  {
    name: 'images',
    type: 'file',
    label: 'Images',
    multiple: true,
    accept: 'image/*'
  },
]

async function fetchProducts() {
  try {
    const response = await api.get('/products')
    products.value = response.data
  }
  catch (error) {
    console.error('Erreur lors de la récupération des produits:', error)
  }
}

async function editProduct(productId: string) {
  try {
    const response = await api.get(`/products/${productId}`)
    editingProduct.value = response.data
  }
  catch (error) {
    console.error('Erreur lors de la récupération du produit:', error)
  }
}

function handleSubmitSuccess() {
  editingProduct.value = null
  fetchProducts()
  if (route.path === '/admin/products/create') {
    router.push('/admin/products')
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div class="create-button-container">
    <router-link to="/admin/products/create" class="create-button">
      Créer un produit
    </router-link>
  </div>
  <div>
    <h1>Gestion des Produits</h1>
    <Form
      v-if="route.path === '/admin/products/create'"
      :fields="productFields"
      :submit-url="`${baseUrl}/products/create`"
      method="POST"
      submit-button-text="Créer"
      @submit-success="handleSubmitSuccess"
    />
    <div v-else-if="editingProduct">
      <h2>Modifier le produit</h2>
      <Form
        :fields="productFields"
        :submit-url="`${baseUrl}/products/${editingProduct._id}`"
        method="PUT"
        :initial-data="editingProduct"
        submit-button-text="Sauvegarder"
        @submit-success="handleSubmitSuccess"
      >
        <template #after-form>
          <button type="button" @click="editingProduct = null">
            Annuler
          </button>
        </template>
      </Form>
    </div>
    <div v-else>
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
          <button @click="editProduct(product._id)">
            Éditer
          </button>
        </div>
      </div>
      <p v-else>
        Aucun produit disponible
      </p>
    </div>
  </div>
</template>
