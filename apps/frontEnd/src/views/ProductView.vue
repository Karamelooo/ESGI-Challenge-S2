<script>
import ProductService from '@/services/ProductService'

export default {
  data() {
    return {
      products: [],
    }
  },
  mounted() {
    ProductService.getAll()
      .then((response) => {
        this.products = response.data
      })
      .catch((error) => {
        console.error(error)
      })
  },
}
</script>

<template>
  <div>
    <h1>Liste des produits</h1>
    <ul>
      <li v-for="product in products" :key="product._id">
        {{ product.name }} - {{ product.price }}€
      </li>
    </ul>
  </div>
</template>
