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
        await axios.post('http://localhost:8000/products', productData)
        alert('Produit ajouté avec succès !')
      }
      catch (error) {
        alert('Erreur lors de l\'ajout du produit')
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
      <input v-model="product.name" placeholder="Nom du produit" required>
      <input v-model="product.description" placeholder="Description">
      <input v-model.number="product.price" placeholder="Prix" required>
      <input v-model.number="product.stock" placeholder="Stock" required>
      <input v-model="product.images" placeholder="Images (séparées par des virgules)">
      <button type="submit">
        Ajouter le produit
      </button>
    </form>
  </div>
</template>
