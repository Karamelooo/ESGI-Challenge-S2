<script setup lang="ts">
import { ref, watch } from 'vue'
import axios from 'axios'

const currentSlide = ref(2)
const slides = 3 // Nombre total d'images

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % slides
}

function prevSlide() {
  currentSlide.value = (currentSlide.value - 1 + slides) % slides
}

watch(currentSlide, (newSlide) => {
  document.documentElement.style.setProperty('--current-slide', newSlide)
})

interface Product {
  _id: string
  name: string
  description: string
  price: number
  category: any
  stock: number
  images: string[]
}

const searchQuery = ref('')
const searchResults = ref<Product[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

let timeoutId: NodeJS.Timeout
async function searchProducts() {
  try {
    isLoading.value = true
    error.value = null

    const apiUrl = `${import.meta.env.VITE_API_URL}/products/search`
    console.log('URL appelée:', apiUrl)

    const response = await axios.get(apiUrl, {
      params: { 
        query: searchQuery.value.trim() 
      },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      withCredentials: true
    })
    
    console.log("Réponse API:", response.data)
    
    if (Array.isArray(response.data)) {
      searchResults.value = response.data
    } else {
      searchResults.value = []
      console.error("Format de réponse inattendu:", response.data)
    }
  }
  catch (err) {
    console.error("Erreur détaillée:", err)
    error.value = "Erreur lors de la recherche"
    searchResults.value = []
  }
  finally {
    isLoading.value = false
  }
}

watch(searchQuery, () => {
  clearTimeout(timeoutId)
  timeoutId = setTimeout(searchProducts, 300)
})
</script>

<template>
  <main>
    <div id="carousel" class="carousel">
      <div>
        <button class="contrast" @click="prevSlide">
          ‹
        </button>
        <button class="contrast" style="right: 0em" @click="nextSlide">
          ›
        </button>
      </div>
      <div class="carousel-track">
        <img src="@/assets/images/1000x400.png" alt="Slide 1">
        <img src="@/assets/images/1000x400.png" alt="Slide 2">
        <img src="@/assets/images/1000x400.png" alt="Slide 3">
      </div>
    </div>
    <div id="content">
      <div id="best">
        <h3>Best</h3>
        <div class="product">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
        </div>
      </div>
      <div id="new">
        <h3>Nouveauté</h3>
        <div class="product">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
        </div>
      </div>
    </div>
    <div class="search-container">
      <input 
        type="text"
        v-model="searchQuery"
        placeholder="Rechercher un produit..."
        class="search-input"
      >
      
      <div v-if="isLoading" class="search-loading">
        Recherche en cours...
      </div>
      
      <div v-else-if="error" class="search-error">
        {{ error }}
      </div>
      
  <div v-else-if="searchQuery && searchResults.length > 0" class="search-results">
    <div v-for="product in searchResults" 
         :key="product._id" 
         class="search-result-item">
      <div class="product-info">
        <h4>{{ product.name || 'Sans nom' }}</h4>
        <p class="description">{{ product.description || 'Pas de description' }}</p>
        <p class="price" v-if="product.price">{{ product.price.toFixed(2) }}€</p>
      </div>
    </div>
  </div>
      
      <div v-else-if="searchQuery" class="no-results">
        Aucun résultat trouvé
      </div>
    </div>
  </main>
</template>

<style scoped>
.carousel {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 100%;
  height: 15em;
  margin: auto;
  position: relative;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease-in-out;
  transform: translateX(calc(-100% * var(--current-slide, 0)));
  width: 100%;
}

.carousel img {
  width: 100%;
  height: fit-content;
  flex-shrink: 0;
  border-radius: var(--radius);
}

button.contrast {
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 0.5em 1em;
  cursor: pointer;
  font-size: 1.2rem;
  border-radius: 0.3em;
  flex-shrink: 0;
  z-index: 2;
}

button.contrast:hover {
  background: rgba(0, 0, 0, 0.7);
}

#content {
  margin-left: 1.5em;
}

.product img {
  margin-right: 1.2em;
  margin-bottom: 1.5em;
}

#best {
  margin-top: 1.6em;
  margin-bottom: 3em;
}

.search-container {
  position: relative;
  margin: 1em auto;
  width: 100%;
  max-width: 600px;
}

.search-input {
  width: 100%;
  padding: 0.8em;
  border-radius: var(--radius);
  border: 1px solid #ddd;
}

.search-results {
  position: absolute;
  width: 100%;
  background: white;
  border: 1px solid #ddd;
  border-radius: var(--radius);
  margin-top: 0.5em;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.search-result-item {
  padding: 1em;
  border-bottom: 1px solid #eee;
  display: flex;
  gap: 1em;
}

.product-image img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--radius);
}

.product-info {
  flex: 1;
}

.product-info h4 {
  margin: 0 0 0.5em 0;
}

.description {
  font-size: 0.9em;
  color: #666;
  margin: 0.2em 0;
}

.price {
  font-weight: bold;
  color: #2c3e50;
  margin: 0.2em 0;
}

.search-loading, .search-error, .no-results {
  padding: 1em;
  text-align: center;
  background: white;
  border: 1px solid #ddd;
  border-radius: var(--radius);
  margin-top: 0.5em;
}

.search-error {
  color: #dc3545;
}
</style>
