<script>
import ProductForm from '@/components/ProductForm.vue'
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  components: { ProductForm },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const products = ref([])

    async function fetchProducts() {
      try {
        const response = await axios.get('http://localhost:8080/products')
        products.value = response.data
      }
      catch (error) {
        console.error('Erreur lors de la récupération des produits:', error)
      }
    }

    function editProduct(productId) {
      router.push(`/products/edit/${productId}`)
    }

    onMounted(() => {
      fetchProducts()
    })

    return {
      route,
      products,
      editProduct,
    }
  },
}
</script>

<template>
  <div>
    <h1>Gestion des Produits</h1>
    <ProductForm v-if="route.path === '/products/create'" />
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
