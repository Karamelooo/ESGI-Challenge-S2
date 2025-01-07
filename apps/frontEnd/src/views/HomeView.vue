<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref, watch } from 'vue'

const currentSlide = ref(2)
const slides = 3 // Nombre total d'images

const baseUrl = import.meta.env.VITE_BACK_APP_URL
const products = ref<Product[]>([])
interface Product {
  _id: string
  name: string
  description?: string
  images?: string[]
  stock: number
  price: number
}

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % slides
}

function prevSlide() {
  currentSlide.value = (currentSlide.value - 1 + slides) % slides
}

async function fetchProducts() {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACK_APP_URL}/products`)
    products.value = response.data
  }
  catch (error) {
    console.error('Erreur lors de la récupération des produits:', error)
  }
}

watch(currentSlide, (newSlide) => {
  document.documentElement.style.setProperty('--current-slide', newSlide)
})

onMounted(() => {
  fetchProducts()
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
        <img src="@/assets/images/carrousel1.jpg" alt="Slide 1">
        <img src="@/assets/images/carrousel2.jpg" alt="Slide 2">
        <img src="@/assets/images/carrousel3.jpg" alt="Slide 3">
      </div>
    </div>
    <div id="content">
      <div id="best">
        <h3>Best</h3>
        <div v-if="products.length" class="product">
          <div v-for="product in products" :key="product._id" class="product-cards">
            <div v-if="product.images && product.images.length">
              <img
                style="width: 125px; height: 200px;"
                :src="`${baseUrl}${product.images[0]}`"
                :alt="product.name"
              >
            </div>
            <div class="info">
              <p>{{ product.name }}</p>
              <p>Prix: {{ product.price }}€</p>
            </div>
          </div>
        </div>
      </div>
      <div id="new">
        <h3>Nouveauté</h3>
        <div v-if="products.length" class="product">
          <div v-for="product in products" :key="product._id" class="product-cards">
            <div v-if="product.images && product.images.length">
              <img
                style="width: 125px; height: 200px;"
                :src="`${baseUrl}${product.images[0]}`"
                :alt="product.name"
              >
            </div>
            <div class="info">
              <p>{{ product.name }}</p>
              <p>Prix: {{ product.price }}€</p>
            </div>
          </div>
        </div>
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
  height: 17em;
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
  height: 100%;
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

.product {
  display: flex;
  gap: 16px;
  padding: 16px;
}

.product-cards {
  width: 125px;
  height: 250px;
  background-color: #ccc;
  border-radius: 8px;
  overflow: hidden;
}

.product-cards img {
  object-fit: cover;
}

.info p {
  font-size: 14px;
  color: #333;
  line-height: .9;
}

.info p:last-child {
  font-weight: bold; /* Le prix est en gras */
}

#best {
  margin-top: 1.6em;
  margin-bottom: 3em;
}
</style>
