<script>
import ProductForm from '@/components/ProductForm.vue'
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  components: { ProductForm },
  setup() {
    const route = useRoute()
    const products = ref([])
    const editingProduct = ref(null)

    async function fetchProducts() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACK_APP_URL}/products`)
        products.value = response.data
      }
      catch (error) {
        console.error('Erreur lors de la récupération des produits:', error)
      }
    }

    async function editProduct(productId) {
      try {
        const response = await axios.get(`http://localhost:8080/products/${productId}`)
        editingProduct.value = response.data
      }
      catch (error) {
        console.error('Erreur lors de la récupération du produit:', error)
      }
    }

    async function updateProduct() {
      try {
        await axios.put(`http://localhost:8080/products/${editingProduct.value._id}`, editingProduct.value)
        editingProduct.value = null
        await fetchProducts()
      }
      catch (error) {
        console.error('Erreur lors de la mise à jour du produit:', error)
      }
    }

    onMounted(() => {
      fetchProducts()
    })

    return {
      route,
      products,
      editProduct,
      editingProduct,
      updateProduct,
    }
  },
}
</script>

<template>
  <div>
    <h1>Gestion des Produits</h1>
    <ProductForm v-if="route.path === '/products/create'" />
    <div v-else-if="editingProduct">
      <h2>Modifier le produit</h2>
      <form @submit.prevent="updateProduct">
        <div>
          <label for="name">Nom</label>
          <input id="name" v-model="editingProduct.name" required>
        </div>
        <div>
          <label for="description">Description</label>
          <textarea id="description" v-model="editingProduct.description" />
        </div>
        <div>
          <label for="price">Prix</label>
          <input id="price" v-model.number="editingProduct.price" type="number" required>
        </div>
        <div>
          <label for="stock">Stock</label>
          <input id="stock" v-model.number="editingProduct.stock" type="number" required>
        </div>
        <div>
          <label for="images">Images (séparées par des virgules)</label>
          <input id="images" v-model="editingProduct.images">
        </div>
        <button type="submit">
          Sauvegarder
        </button>
        <button type="button" @click="editingProduct = null">
          Annuler
        </button>
      </form>
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
            <img :src="product.images[0]" :alt="product.name">
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
