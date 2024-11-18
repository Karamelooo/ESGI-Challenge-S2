<script>
import axios from 'axios'

export default {
  name: 'ProductForm',
  data() {
    return {
      product: {
        name: '',
        description: '',
        price: 0,
        stock: 0,
        images: '',
      },
    }
  },
  methods: {
    async addProduct() {
      try {
        // Conversion des images en tableau
        const productData = {
          ...this.product,
          images: this.product.images.split(',').map(img => img.trim()),
        }
        await axios.post('http://localhost:8080/products/create', productData)
        console.log('Produit ajouté avec succès !')
      }
      catch (error) {
        console.log('Erreur lors de l\'ajout du produit')
        console.error(error)
      }
    },
  },
}
</script>

<template>
  <div>
    <h2>Créer un nouveau produit</h2>
    <form @submit.prevent="addProduct">
      <label for="name">Nom du produit</label>
      <input v-model="product.name" placeholder="Nom du produit" required>
      <label for="description">Description</label>
      <input v-model="product.description" placeholder="Description">
      <label for="price">Prix</label>
      <input v-model.number="product.price" placeholder="Prix" required>
      <label for="stock">Stock</label>
      <input v-model.number="product.stock" placeholder="Stock" required>
      <label for="images">Images (séparées par des virgules)</label>
      <input v-model="product.images" placeholder="Images (séparées par des virgules)">
      <button type="submit">
        Ajouter le produit
      </button>
    </form>
  </div>
</template>
