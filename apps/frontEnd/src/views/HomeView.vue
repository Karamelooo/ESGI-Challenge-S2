<script setup lang="ts">
import { ref, watch } from 'vue'

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
</script>

<template>
  <main>
    <div id="carousel" class="carousel">
      <button class="contrast" @click="prevSlide">
        ‹
      </button>
      <div class="carousel-track">
        <img src="@/assets/images/1000x400.png" alt="Slide 1">
        <img src="@/assets/images/1000x400.png" alt="Slide 2">
        <img src="@/assets/images/1000x400.png" alt="Slide 3">
      </div>
      <button class="contrast" @click="nextSlide">
        ›
      </button>
    </div>
    <div id="content">
      <div id="best" />
      <div id="new" />
    </div>
  </main>
</template>

<style scoped>
.carousel {
  display: flex;
  align-items: center; /* Aligner les boutons et les images verticalement */
  justify-content: center; /* Centrer le carousel horizontalement */
  overflow: hidden;
  width: 100%;
  margin: auto; /* Centrer horizontalement */
  position: relative; /* Position relative pour l'alignement interne */
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease-in-out;
  transform: translateX(calc(-100% * var(--current-slide, 0)));
  width: 100%; /* Occupe toute la largeur disponible */
}

.carousel img {
  width: 100%;
  height: fit-content;
  flex-shrink: 0;
  border-radius: var(--radius);
}

button.contrast {
  background: rgba(0, 0, 0, 0.5); /* Couleur de fond semi-transparente */
  color: white;
  border: none;
  padding: 0.5em 1em;
  cursor: pointer;
  font-size: 1.2rem;
  border-radius: 0.3em; /* Bords arrondis */
  flex-shrink: 0; /* Les boutons conservent leur taille */
  z-index: 2; /* Assurer que les boutons sont devant */
}

button.contrast:hover {
  background: rgba(0, 0, 0, 0.7); /* Rendre les boutons plus visibles au survol */
}
</style>
